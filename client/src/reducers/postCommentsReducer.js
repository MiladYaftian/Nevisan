import {
  FETCH_POST_COMMENTS,
  CREATE_NEW_POST,
  UPDATE_POST,
  TOGGLE_LIKE,
  LIKE_COMMENT,
  LIKE_REPLY,
  ADD_COMMENT,
  ADD_REPLY,
  EDIT_COMMENT,
  DELETE_COMMENT,
  EDIT_REPLY,
  DELETE_REPLY,
  SORT_COMMENTS,
} from "../actionTypes";
import postService from "../services/post";

const postCommentsReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_POST_COMMENTS:
      return action.payload;
    case "FETCH_POST_COMMENTS_FAILURE":
      return {
        ...state,
        error: action.payload, // Update error state with the error message
      };
    case CREATE_NEW_POST:
      return action.payload;

    case UPDATE_POST:
      return action.payload;
    case TOGGLE_LIKE:
      return { ...state, ...action.payload };
    case LIKE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.id ? c : { ...c, ...action.payload.data }
        ),
      };
    case LIKE_REPLY:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.id
            ? c
            : {
                ...c,
                replies: c.replies.map((r) =>
                  r.id !== action.payload.id
                    ? r
                    : { ...r, ...action.payload.data }
                ),
              }
        ),
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [...state.comments, ...action.payload],
      };
    case ADD_REPLY:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.commentId
            ? c
            : { ...c, replies: [...c.replies, ...action.payload.addedReply] }
        ),
      };
    case EDIT_COMMENT:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.id ? c : { ...c, ...action.payload.data }
        ),
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter((c) => c.id !== action.payload.id),
      };
    case EDIT_REPLY:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.commentId
            ? c
            : {
                ...c,
                replies: c.replies.map((r) =>
                  r.id !== action.payload.id
                    ? r
                    : { ...r, ...action.payload.data }
                ),
              }
        ),
      };
    case DELETE_REPLY:
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.commentId
            ? c
            : {
                ...c,
                replies: c.replies.filter(
                  (r) => r.id !== action.payload.replyId
                ),
              }
        ),
      };
    case SORT_COMMENTS:
      return {
        ...state,
        comments: state.comments.sort((a, b) => {
          switch (action.type) {
            case "new":
              return new Date(b.createdAt) - new Date(a.createdAt);
            case "liked":
              return b.pointsCount - a.pointsCount;
            case "disliked":
              return a.pointsCount - b.pointsCount;
            case "replied":
              return b.replies.length - a.replies.length;
            default:
              return new Date(a.createdAt) - new Date(b.createdAt);
          }
        }),
      };
    default:
      return state;
  }
};

export const getPostComments = (id) => {
  return async (dispatch) => {
    try {
      const fetchedPost = await postService.getPostAndComments(id);
      dispatch({
        type: FETCH_POST_COMMENTS,
        payload: fetchedPost,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_POST_COMMENTS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const addNewPost = (postObj) => {
  return async (dispatch) => {
    try {
      const createdPost = await postService.createPost(postObj);
      console.log("Created post:", createdPost);
      const newPostId = createdPost._id;
      console.log("New post ID:", newPostId);

      dispatch({
        type: CREATE_NEW_POST,
        payload: createdPost,
      });

      return newPostId;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };
};

export const updatePost = (id, updatedObj) => {
  return async (dispatch) => {
    const updatedPost = await postService.updatePost(id, { updatedObj });
    dispatch({
      type: UPDATE_POST,
      payload: updatedPost,
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
      type: TOGGLE_LIKE,
      payload: { likedBy, pointsCount, dislikedBy },
    });
    await postService.likePost(id);
  };
};

export const toggledisLike = (id, dislikedBy, likedBy) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }
    dispatch({
      type: TOGGLE_LIKE,
      payload: { likedBy, pointsCount, dislikedBy },
    });
    await postService.dislikePost(id);
  };
};

export const toggleCommentLike = (PostId, commentId, likedBy, dislikedBy) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: LIKE_COMMENT,
      payload: { commentId, data: { likedBy, pointsCount, dislikedBy } },
    });

    await postService.likeComment(PostId, commentId);
  };
};

export const toggleCommentDislike = (
  PostId,
  commentId,
  likedBy,
  dislikedBy
) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: LIKE_COMMENT,
      payload: { commentId, data: { likedBy, pointsCount, dislikedBy } },
    });

    await postService.dislikeComment(PostId, commentId);
  };
};

export const toggleReplyLike = (
  postId,
  commentId,
  replyId,
  likedBy,
  dislikedBy
) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: LIKE_REPLY,
      payload: {
        commentId,
        replyId,
        data: { likedBy, pointsCount, dislikedBy },
      },
    });

    await postService.likeReply(postId, commentId, replyId);
  };
};

export const toggleReplyDislike = (
  postId,
  commentId,
  replyId,
  likedBy,
  dislikedBy
) => {
  return async (dispatch) => {
    let pointsCount = likedBy.length - dislikedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: LIKE_REPLY,
      payload: {
        commentId,
        replyId,
        data: { likedBy, pointsCount, dislikedBy },
      },
    });

    await postService.dislikeReply(postId, commentId, replyId);
  };
};

export const postNewComment = (postId, postObj) => {
  return async (dispatch) => {
    const addedComment = await postService.addNewComment(postId, { postObj });
    dispatch({
      type: ADD_COMMENT,
      payload: addedComment,
    });
  };
};

export const postNewReply = (postId, commentId, replyObj) => {
  return async (dispatch) => {
    const addedReply = await postService.postReply(postId, commentId, {
      replyObj,
    });
    dispatch({
      type: ADD_REPLY,
      payload: { commentId, addedReply },
    });
  };
};

export const editComment = (postId, commentId, updatedObj) => {
  return async (dispatch) => {
    await postService.updateComment(postId, commentId, { updatedObj });
    const updatedAt = new Date();
    dispatch({
      type: UPDATE_POST,
      dispatch: { commentId, data: { updatedAt, commentBody: updatedObj } },
    });
  };
};

export const removeComment = (postId, commentId) => {
  return async (dispatch) => {
    await postService.deleteComment(postId, commentId);
    dispatch({
      type: DELETE_COMMENT,
      payload: commentId,
    });
  };
};

export const editReply = (postId, commentId, replyId, updatedObj) => {
  return async (dispatch) => {
    await postService.updateReply(postId, commentId, replyId, { updatedObj });
    const updatedAt = new Date();
    dispatch({
      type: EDIT_REPLY,
      payload: {
        commentId,
        replyId,
        data: { updatedAt, replyBody: updatedObj },
      },
    });
  };
};

export const removeReply = (postId, commentId, replyId) => {
  return async (dispatch) => {
    await postService.deleteReply(postId, commentId, replyId);
    dispatch({
      type: DELETE_COMMENT,
      payload: { commentId, replyId },
    });
  };
};

export const sortComments = (sortBy) => {
  return (dispatch) => {
    dispatch({
      type: "SORT_COMMENTS",
      payload: sortBy,
    });
  };
};

export default postCommentsReducer;
