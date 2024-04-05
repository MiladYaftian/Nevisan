import { SET_POSTS, LOAD_MORE_POSTS, TOGGLE_LIKE, DELETE_POST} from "../actionTypes";
import postService from "../services/post";

const postReducer = (state = null, action) => {
    switch(action.type) {
        case SET_POSTS:
            return action.payload;
        case LOAD_MORE_POSTS:
            return {
                ...action.payload,
                results: [...state.results, ...action.payload.results]
            }
        case TOGGLE_LIKE:
            return {
                ...state,
                results: state.results.map((r)=> r.id !== action.payload.id ? r : {...r, ...action.payload.data})
            }
        case DELETE_POST:
            return {
                ...state,
                results: state.results.map((r)=> r.id !== action.payload.id)
            }
        default:
            return state;                
    }
}

export const setPosts = (sortBy, page) => {
    return async(dispatch) => {
       let posts;

       if (sortBy !== 'subscribed') {
        posts = await postService.getPosts(sortBy, 10, 1)
       } else {
        posts = await postService.getSubscribedPosts(10, page)
       }

       dispatch({
        type: SET_POSTS,
        payload: posts
       })
    } 
}

export const loadMorePosts = (sortBy, page) => {
    return async (dispatch) => {
      let posts;
      if (sortBy !== "subscribed") {
        posts = await postService.getPosts(sortBy, 10, page);
      } else {
        posts = await postService.getMahfelPosts(10, page);
      }
  
      dispatch({
        type: LOAD_MORE_POSTS,
        payload: posts,
      });
    };
  };


  export const togglePostLike = (id, likedBy, dislikedBy) => {
    return async(dispatch) => {
        const pointsCount = likedBy.length - dislikedBy.length;
        dispatch({
            type: TOGGLE_LIKE,
            payload: { id, data: { likedBy, pointsCount, dislikedBy } },
        })
        await postService.likePost(id)
    }
  
  }
  export const togglePostDislike = (id, dislikedBy, likedBy) => {
    return async(dispatch) => {
        const pointsCount = likedBy.length - dislikedBy.length;
        dispatch({
            type: TOGGLE_LIKE,
            payload: { id, data: { likedBy, pointsCount, dislikedBy } },
        })
        await postService.dislikePost(id)
    }
  
  }


  export const deletePost = (postId) => {
    return async(dispatch) => {
        await postService.deletePost(postId);
        dispatch({
            type: DELETE_POST,
            payload: postId,
        })
    }
  }

  export default postReducer;