import {
  GET_GROUP,
  LOAD_GROUP_POSTS,
  TOGGLE_GROUPPAGE_LIKE,
  SUBSCRIBE_GROUP,
  EDIT_DESCRIPTION,
} from "../actionTypes";
import groupService from "../services/group";
import postService from "../services/post";

const initialState = {
  groupDescription: {
    description: "",
  },
};

const groupPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUP:
      return action.payload;
    case LOAD_GROUP_POSTS:
      return {
        ...state,
        posts: {
          ...action.payload.posts,
          results: [...state.posts.results, ...action.payload.posts.results],
        },
      };
    case TOGGLE_GROUPPAGE_LIKE:
      return {
        ...state,
        posts: {
          ...state.posts,
          results: state.posts.map((p) =>
            p.id !== action.payload.id ? p : { ...p, ...action.payload.data }
          ),
        },
      };

    case EDIT_DESCRIPTION:
      return {
        ...state,
        groupDescription: {
          ...state.groupDescription,
          description: action.payload,
        },
      };

    case SUBSCRIBE_GROUP:
      return {
        ...state,
        groupDescription: {
          ...state.groupDescription,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const getGroup = (groupName, sortBy) => {
  return async (dispatch) => {
    const group = await groupService.getGroup(groupName, sortBy, 10, 1);
    dispatch({
      type: GET_GROUP,
      payload: group,
    });
  };
};

export const loadGroupPosts = (groupName, sortBy, page) => {
  return async (dispatch) => {
    const groupPosts = await groupService.getGroupPosts(
      groupName,
      sortBy,
      10,
      page
    );

    dispatch({
      type: LOAD_GROUP_POSTS,
      payload: groupPosts,
    });
  };
};

export const toggleLike = (id, likedBy, dislikedBy) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: TOGGLE_GROUPPAGE_LIKE,
      dispatch: { id, data: { likedBy, pointsCount, dislikedBy } },
    });

    await postService.likePost(id);
  };
};

export const toggleDislike = (id, likedBy, dislikedBy) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: TOGGLE_GROUPPAGE_LIKE,
      dispatch: { id, data: { likedBy, pointsCount, dislikedBy } },
    });

    await postService.dislikePost(id);
  };
};

export const toggleSubscribe = (id, subscribedBy) => {
  return async (dispatch) => {
    const subscriberCount = subscribedBy.length;
    dispatch({
      type: SUBSCRIBE_GROUP,
      payload: subscriberCount,
    });

    await groupService.subscribeToGroup(id);
  };
};

export const editDescription = (id, description) => {
  return async (dispatch) => {
    await groupService.editGroupDescription(id, { description });
    dispatch({
      type: EDIT_DESCRIPTION,
      payload: description,
    });
  };
};

export default groupPageReducer;
