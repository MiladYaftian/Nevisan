const User = require("../models/user");
const Group = require("../models/group");
const Post = require("../models/post");
const paginateResults = require("../utils/paginateResults");

const getAllGroups = async (_req, res) => {
  const allGroups = await Group.find({});
  res.status(200).json(allGroups);
};

const getGroupPosts = async (req, res) => {
  const { groupName } = req.params;
  const sortBy = req.query.sortBy;
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);

  let sortQuery;
  switch (sortBy) {
    case "new":
      sortQuery = { createdAt: -1 };
      break;
    case "old":
      sortQuery = { createdAt: 1 };
      break;
    case "controversial":
      sortQuery = { commentsCount: -1 };
      break;
    case "top":
      sortQuery = { pointsCount: -1 };
    default:
      sortQuery = {};
  }

  const targetGroup = await Group.findOne({
    groupName: { $regex: new RegExp("^" + groupName + "$", "i") },
  }).populate("admin", "username");

  if (!targetGroup) {
    return res.status(404).send({ message: "گروه یافت نشد" });
  }

  const postCount = await Post.find({
    group: targetGroup.id,
  }).countDocuments();

  const paginated = paginateResults(page, limit, postCount);

  const groupPosts = await Post.find({ group: targetGroup.id })
    .sort(sortQuery)
    .select("-comments")
    .limit(limit)
    .skip(paginated.firstIndex)
    .populate("author", "username")
    .populate("group", "groupName");

  const paginatedGroupPosts = {
    previous: paginated.results.previous,
    results: groupPosts,
    next: paginated.results.next,
  };

  res
    .status(200)
    .json({ groupDetails: targetGroup, posts: paginatedGroupPosts });
};

const createGroup = async (req, res) => {
  const { groupName, groupDescription } = req.body;
  const admin = await User.findById(req.user._id);

  if (!admin) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (!groupDescription) {
    return res
      .status(400)
      .send({ message: "فیلد توضیحات گروه نباید خالی باشذ" });
  }
  const existingGroupName = await Group.findOne({
    groupName: { $regex: new RegExp("^" + groupName + "$", "i") },
  });

  if (existingGroupName) {
    return res
      .status(400)
      .send({ message: "گروه دیگری از قبل با این نام وجود دارد" });
  }

  const newGroup = new Group({
    groupName,
    groupDescription,
    admin: admin._id,
    subscribedBy: [admin._id],
    subscriberCount: 1,
  });

  const savedGroup = await newGroup.save();

  if (!admin.joinedGroups) {
    admin.joinedGroups = [];
  }

  admin.joinedGroups = admin.joinedGroups.concat(savedGroup._id);
  await admin.save();

  return res.status(201).json(savedGroup);
};

const getTopGroups = async (_req, res) => {
  const topGroups = await Group.find({})
    .sort({ subscriberCount: -1 })
    .limit(10)
    .select("-description -posts -admin ");
  res.status(200).json(topGroups);
};

const subscribeToGroup = async (req, res) => {
  const { id } = req.params;

  const targetGroup = await Group.findById(id);
  const user = await User.findById(req.user);

  if (!targetGroup) {
    return res.status(404).send({ message: "گروه مورد نظر یافت نشد" });
  }

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (targetGroup.subscribedBy.includes(user._id.toString())) {
    targetGroup.subscribedBy = targetGroup.subscribedBy.filter(
      (s) => s.toString() !== user._id.toString()
    );

    user.joinedGroups = user.joinedGroups.filter(
      (s) => s.toString() !== targetGroup._id.toString()
    );
  } else {
    targetGroup.subscribedBy = targetGroup.subscribedBy.concat(user._id);

    user.joinedGroups = user.joinedGroups.concat(targetGroup._id);
  }

  targetGroup.subscriberCount = targetGroup.subscribedBy.length;

  await targetGroup.save();
  await user.save();

  res.status(201).send({ message: "عضویت در گروه با موفقیت انجام شد!" });
};

const editGroupDescription = async (req, res) => {
  const { id: groupId } = req.params;
  const { description } = req.body;

  const admin = await User.findById(req.user);
  const targetGroup = await Group.findById(groupId);

  if (!description) {
    return res.status(400).send({ message: "فیلد توضیحات نباید خالی باشد" });
  }

  if (!admin) {
    return res.status(404).send({ message: "کاربر یافت نشد " });
  }

  if (!targetGroup) {
    return res.status(404).send({ message: "گروه مورد نظر یافت نشد" });
  }

  if (targetGroup.admin.toString() !== admin._id.toString()) {
    return res.status(401).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetGroup.groupDescription = description;
  await targetGroup.save();

  return res
    .status(201)
    .send({ message: "توضیحات گروه با موفقیت بروزرسانی شد!" });
};

module.exports = {
  getAllGroups,
  getGroupPosts,
  createGroup,
  getTopGroups,
  subscribeToGroup,
  editGroupDescription,
};
