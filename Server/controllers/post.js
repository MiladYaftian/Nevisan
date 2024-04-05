const User = require("../models/user");
const Group = require("../models/group");
const Post = require("../models/post");
const pointsCalculator = require("../utils/pointsCalculator");
const numOfComments = require("../utils/numOfComments");
const paginateResults = require("../utils/paginateResults");

const getPostAndComments = async (req, res) => {
  const { id } = req.params;

  const populatedPost = await Post.findById(id)
    .populate("author", "username")
    .populate("group", "groupName")
    .populate("comments.commentedBy", "username")
    .populate("comments.replies.repliedBy", "username")
    .exec();

  if (!populatedPost) {
    return res.status(404).send({ message: "پست یافت نشد" });
  }

  res.status(200).json(populatedPost);
};

const getSearchedPosts = async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  const query = req.query.query;

  const findQuery = {
    $or: [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        postBody: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  };

  const postsCount = await Post.find(findQuery).countDocuments();

  const paginated = paginateResults(page, limit, postsCount);

  const searchedPosts = await Post.find(findQuery)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(paginated.startIndex)
    .populate("author", "username")
    .populate("group", "groupName");

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: searchedPosts,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedPosts);
};
const getSubscribedPosts = async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);

  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const joinedGroups = await Group.find({
    _id: { $in: user.joinedGroups },
  });

  const postsCount = joinedGroups
    .map((g) => g.posts.length)
    .reduce((sum, g) => g + sum, 0);

  const paginated = paginateResults(page, limit, postsCount);

  const subscribedPosts = await Post.find({ group: { $in: user.joinedGroups } })
    .sort({ createdAt: -1 })
    .select("-comments")
    .limit(limit)
    .skip(paginated.startIndex)
    .populate("author", "username")
    .populate("group", "groupName");

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: subscribedPosts,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedPosts);
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { updatedBody } = req.body;

  if (!updatedBody) {
    return res.status(400).send({ message: "لطفا توضیحات جدید را وارد کنید" });
  }

  const author = await User.findById(req.user);
  const targetPost = await Post.findById(id);

  if (!author) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (!targetPost) {
    return res.status(404).send({ message: "پست یافت نشد" });
  }

  if (targetPost.author.toString() !== author._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetPost.postBody = updatedBody;
  targetPost.updatedAt = Date.now();
  await targetPost.save();

  const populatedPost = await Post.findById(id)
    .populate("author", "username")
    .populate("group", "groupName")
    .populate("comments.commentedBy", "username")
    .populate("comments.replies.repliedBy", "username")
    .exec();

  res.status(202).json(populatedPost);
};

const createPost = async (req, res) => {
  const { postTitle, postBody, group } = req.body;

  const author = await User.findById(req.user);
  const targetGroup = await Group.findById(group);

  if (!author) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }
  if (!targetGroup) {
    return res.status(404).send({ message: "گروه مورد نظر یافت نشد" });
  }

  if (!postTitle || !postBody || !group) {
    return res.status(400).send({ message: "لطفا تمام فیلدها را تکمیل کنید" });
  }

  const newPost = new Post({
    postTitle,
    postBody,
    group,
    author: author._id,
    likedBy: [author._id],
    pointsCount: 1,
  });

  await newPost.save();

  const populatedPost = await Post.findById(newPost._id)
    .populate("author", "username")
    .populate("group", "groupName")
    .exec();

  targetGroup.posts.push(newPost._id);
  await targetGroup.save();

  author.posts.push(newPost._id);
  author.likes.postLikes++;
  await author.save();

  res
    .status(201)
    .json({ message: "success", post: populatedPost, _id: populatedPost._id });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const author = await User.findById(req.user);
  const targetPost = await Post.findById(id);

  if (!author) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد " });
  }

  const group = await Group.findById(targetPost.group);

  if (!group) {
    return res.status(404).send({ message: "گروه مورد نظر یافت نشد" });
  }

  if (targetPost.author.toString() !== author._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  await Post.findByIdAndDelete(id);

  author.posts = author.posts.filter((p) => {
    p.toString() !== id;
  });

  await author.save();

  group.posts = group.posts.filter((p) => {
    p.toString() !== id;
  });

  await group.save();

  return res.status(204).send({ message: "پست با موفقیت حذف شد" });
};
const likePost = async (req, res) => {
  const { id } = req.params;
  const targetPost = await Post.findById(id);
  const user = await User.findById(req.user);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const postAuthor = await User.findById(targetPost.author);

  if (!postAuthor) {
    return res.status(404).send({ message: "نویسنده پست یافت نشد" });
  }

  if (targetPost.likedBy.includes(user._id.toString())) {
    targetPost.likedBy = targetPost.likedBy.filter(
      (l) => l.toString() !== user._id.toString()
    );
    postAuthor.likes.postLikes--;
  } else {
    targetPost.likedBy.push(user._id);
    targetPost.dislikedBy = targetPost.dislikedBy.filter(
      (d) => d.toString() !== user._id.toString()
    );
    postAuthor.likes.postLikes++;
  }

  const calculatedData = pointsCalculator(
    targetPost.likedBy.length,
    targetPost.dislikedBy.length
  );

  await targetPost.save();
  await postAuthor.save();

  return res.status(201).send({ message: "پست با موفقیت لایک شد" });
};

const dislikePost = async (req, res) => {
  const { id } = req.params;
  const targetPost = await Post.findById(id);
  const user = await User.findById(req.user);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const postAuthor = await User.findById(targetPost.author);

  if (!postAuthor) {
    return res.status(404).send({ message: "نویسنده پست یافت نشد" });
  }

  if (targetPost.dislikedBy.includes(user._id.toString())) {
    targetPost.dislikedBy = targetPost.dislikedBy.filter(
      (l) => l.toString() !== user._id.toString()
    );
    postAuthor.likes.postLikes--;
  } else {
    targetPost.dislikedBy.push(user._id);
    targetPost.likedBy = targetPost.likedBy.filter(
      (d) => d.toString() !== user._id.toString()
    );
    postAuthor.likes.postLikes++;
  }

  const calculatedData = pointsCalculator(
    targetPost.likedBy.length,
    targetPost.dislikedBy.length
  );

  await targetPost.save();
  await postAuthor.save();

  return res.status(201).send({ message: "پست با موفقیت دیسلایک شد" });
};

const likeComment = async (req, res) => {
  const { id, commentId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);
  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = await targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const commentAuthor = await User.findById(targetComment.commentedBy);

  if (!commentAuthor) {
    return res.status(404).send({ message: "نویسنده نظر یافت نشد" });
  }

  if (targetComment.likedBy.includes(user._id)) {
    targetComment.likedBy = targetComment.likedBy.filter((l) => {
      return l._id.toString() !== user._id.toString();
    });
    commentAuthor.commentLikes--;
  } else {
    targetComment.likedBy = targetComment.likedBy.concat(user._id);
    targetComment.dislikedBy = targetComment.dislikedBy.filter((d) => {
      return d._id.toString() !== user._id.toString();
    });
    commentAuthor.commentLikes++;
  }

  targetComment.pointsCount =
    targetComment.likedBy.length - targetComment.dislikedBy.length;

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  await targetPost.save();
  await commentAuthor.save();

  res.status(201).send({ message: "کامنت با موفقیت لایک شد" });
};
const dislikeComment = async (req, res) => {
  const { id, commentId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);
  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = await targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const commentAuthor = await User.findById(targetComment.commentedBy);

  if (!commentAuthor) {
    return res.status(404).send({ message: "نویسنده نظر یافت نشد" });
  }

  if (targetComment.dislikedBy.includes(user._id)) {
    targetComment.dislikedBy = targetComment.dislikedBy.filter((l) => {
      return l._id.toString() !== user._id.toString();
    });
    commentAuthor.commentLikes++;
  } else {
    targetComment.dislikedBy = targetComment.dislikedBy.concat(user._id);
    targetComment.likedBy = targetComment.likedBy.filter((d) => {
      return d._id.toString() !== user._id.toString();
    });
    commentAuthor.commentLikes--;
  }

  targetComment.pointsCount =
    targetComment.likedBy.length - targetComment.dislikedBy.length;

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  await targetPost.save();
  await commentAuthor.save();

  res.status(201).send({ message: "کامنت با موفقیت دیسلایک شد" });
};
const likeReply = async (req, res) => {
  const { id, commentId, replyId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const targetReply = targetComment.replies.find((r) => {
    return r._id.toString() === replyId;
  });

  if (!targetReply) {
    return res.status(404).send({ message: "پاسخ یافت نشد" });
  }

  const replyAuthor = await User.findById(targetReply.repliedBy);

  if (!replyAuthor) {
    return res.status(404).send({ message: "نویسنده پاسخ یافت نشد" });
  }

  if (targetReply.likedBy.includes(user._id.toString())) {
    targetReply.likedBy = targetReply.likedBy.filter((l) => {
      return l.toString() !== user._id.toString();
    });
    replyAuthor.likes.commentLikes--;
  } else {
    targetReply.likedBy = targetReply.likedBy.concat(user._id.toString());
    targetReply.dislikedBy = targetReply.dislikedBy.filter((l) => {
      return l.toString() !== user._id.toString();
    });
    replyAuthor.likes.commentLikes++;
  }

  targetReply.pointsCount =
    targetReply.likedBy.length - targetReply.dislikedBy.length;

  targetComment.replies = targetComment.replies.map((r) => {
    return r._id.toString() !== replyId ? r : targetReply;
  });

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  await targetReply.save();
  await targetComment.save();
  await targetPost.save();
  await replyAuthor.save();

  return res.status(202).send({ message: "پاسخ با موفقیت لایک شد" });
};
const dislikeReply = async (req, res) => {
  const { id, commentId, replyId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const targetReply = targetComment.replies.find((r) => {
    return r._id.toString() === replyId;
  });

  if (!targetReply) {
    return res.status(404).send({ message: "پاسخ یافت نشد" });
  }

  const replyAuthor = await User.findById(targetReply.repliedBy);

  if (!replyAuthor) {
    return res.status(404).send({ message: "نویسنده پاسخ یافت نشد" });
  }

  if (targetReply.dislikedBy.includes(user._id.toString())) {
    targetReply.dislikedBy = targetReply.dislikedBy.filter((l) => {
      return l.toString() !== user._id.toString();
    });
    replyAuthor.likes.commentLikes++;
  } else {
    targetReply.dislikedBy = targetReply.dislikedBy.concat(user._id.toString());
    targetReply.likedBy = targetReply.likedBy.filter((l) => {
      return l.toString() !== user._id.toString();
    });
    replyAuthor.likes.commentLikes--;
  }

  targetReply.pointsCount =
    targetReply.likedBy.length - targetReply.dislikedBy.length;

  targetComment.replies = targetComment.replies.map((r) => {
    return r._id.toString() !== replyId ? r : targetReply;
  });

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  await targetReply.save();
  await targetComment.save();
  await targetPost.save();
  await replyAuthor.save();

  return res.status(202).send({ message: "پاسخ با موفقیت دیسلایک شد" });
};
const postComment = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const targetPost = await Post.findById(id);
  const user = await User.findById(req.user);

  if (!comment) {
    return res.status(400).send({ message: "لطفا نظر خود را تایپ کنید" });
  }

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const postAuthor = await User.findById(targetPost.author);

  if (!postAuthor) {
    return res.status(404).send({ message: "نویسنده پست یافت نشد" });
  }

  targetPost.comments = targetPost.comments.concat({
    commentedBy: user._id,
    commentBody: comment,
    likedBy: [user._id],
    pointsCount: 1,
  });

  targetPost.commentCount = numOfComments(targetPost.comments);
  const savedPost = await targetPost.save();
  const populatedPost = await savedPost.populate(
    "comments.commentedBy",
    "username"
  );

  user.likes.commentLikes++;
  user.totalComments++;
  await user.save();

  const addedComment = populatedPost.comments[savedPost.comments.length - 1];
  res.status(201).json(addedComment);
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find(
    (c) => c._id.toString() === commentId
  );

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  if (targetComment.commentedBy.toString() !== user._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetPost.comments = targetPost.comments.filter(
    (c) => c._id.toString() !== commentId
  );
  targetPost.commentCount = numOfComments(targetPost.comments);

  await targetPost.save();

  return res.status(204).send({ message: "نظر با موفقیت حذف شد" });
};
const updateComment = async (req, res) => {
  const { comment } = req.body;
  const { id, commentId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (!comment) {
    return res.status(400).send({ message: "لطفا نظر خود را تایپ کنید" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  if (targetComment.commentedBy.toString() !== user._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetComment.commentBody = comment;
  targetComment.updatedAt = Date.now();

  targetPost.comments = targetPost.comments.map((c) =>
    c._id.toString() !== commentId ? c : targetComment
  );
  await targetPost.save();

  return res.status(202).send({ message: "نظر با موفقیت بروزرسانی شد" });
};

const postReply = async (req, res) => {
  const { id, commentId } = req.params;
  const { reply } = req.body;
  const targetPost = await Post.findById(id);
  console.log("targetPost.comments:", targetPost.comments);

  if (!reply) {
    return res.status(400).send({ message: "لطفا پاسخ خود را تایپ کنید" });
  }

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetComment = await targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر مورد نظر یافت نشد" });
  }

  targetComment.replies = targetComment.replies.concat({
    repliedBy: user._id,
    replyBody: reply,
    likedBy: [user._id],
    pointsCount: 1,
  });

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  targetPost.commentCount = numOfComments(targetPost.comments);
  const savedPost = await targetPost.save();

  const populatedPost = await savedPost.populate(
    "comments.replies.repliedBy",
    "username"
  );

  user.likes.commentLikes++;
  user.totalComments++;
  await user.save();

  const commentToReply = populatedPost.comments.find(
    (c) => c._id.toString() === commentId
  );

  const addedReply = commentToReply.replies[commentToReply.replies.length - 1];
  res.status(201).json(addedReply);
};

const deleteReply = async (req, res) => {
  const { id, commentId, replyId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const targetReply = targetComment.replies.find((r) => {
    return r._id.toString() === replyId;
  });

  if (!targetReply) {
    return res.status(404).send({ message: "پاسخ مورد نظر یافت نشد" });
  }

  if (targetReply.repliedBy.toString() !== user._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetComment.replies = targetComment.replies.filter(
    (r) => r._id.toString() !== replyId
  );
  targetPost.commentCount = numOfComments(targetPost.comments);

  await targetPost.save();

  return res.status(204).send({ message: "پاسخ با موفقیت حذف شد" });
};
const updateReply = async (req, res) => {
  const { reply } = req.body;
  const { id, commentId, replyId } = req.params;
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ message: "کاربر یافت نشد" });
  }

  if (!reply) {
    return res.status(400).send({ message: "لطفا پاسخ خود را تایپ کنید" });
  }

  const targetPost = await Post.findById(id);

  if (!targetPost) {
    return res.status(404).send({ message: "پست مورد نظر یافت نشد" });
  }

  const targetComment = targetPost.comments.find((c) => {
    return c._id.toString() === commentId;
  });

  if (!targetComment) {
    return res.status(404).send({ message: "نظر یافت نشد" });
  }

  const targetReply = targetComment.replies.find((r) => {
    return r._id.toString() === replyId;
  });

  if (!targetReply) {
    return res.status(404).send({ message: "پاسخ مورد نظر یافت نشد" });
  }

  if (targetReply.repliedBy.toString() !== user._id.toString()) {
    return res.status(403).send({ message: "دسترسی مجاز نمی باشد" });
  }

  targetReply.replyBody = reply;
  targetReply.updatedAt = Date.now();

  targetComment.replies = targetComment.replies.map((r) => {
    return r._id.toString() !== replyId ? r : targetReply;
  });

  targetPost.comments = targetPost.comments.map((c) => {
    return c._id.toString() !== commentId ? c : targetComment;
  });

  await targetPost.save();

  return res.status(202).send({ message: "پاسخ با موفقیت بروزرسانی شد" });
};

module.exports = {
  getPostAndComments,
  getSearchedPosts,
  getSubscribedPosts,
  updatePost,
  createPost,
  deletePost,
  likePost,
  dislikePost,
  likeComment,
  dislikeComment,
  likeReply,
  dislikeReply,
  postComment,
  deleteComment,
  updateComment,
  postReply,
  deleteReply,
  updateReply,
};
