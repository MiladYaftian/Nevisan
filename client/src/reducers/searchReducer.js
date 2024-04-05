import { SET_SEARCH_RESULTS, TOGGLE_SEARCH_LIKE, LOAD_SEARCH_POSTS } from "../actionTypes";
import postService from "../services/post";

const searchReducer = (state=null, action) => {
    switch(action.type) {
        case SET_SEARCH_RESULTS:
            return action.payload;
        case TOGGLE_SEARCH_LIKE:
            return {
                ...state,
                posts: state.posts.map((p)=> p.id !== action.payload.id ? p : {...p, ...action.payload.data})
            }
            case LOAD_SEARCH_POSTS:
                return {
                  ...action.payload,
                  results: [...state.results, ...action.payload.results],
                };
              default:
                return state;       
    }
}

export const setSearchResults = (query) => {
    return async(dispatch) => {
        const searchResults = await postService.getSearchedPosts(query, 10, 1)
        dispatch({
            type: SET_SEARCH_RESULTS,
            payload: searchResults,
        })
    }
}

export const togglePostLike = (id, likedBy, dislikedBy) => {
    return async(dispatch) => {
        let pointsCount = likedBy.length - dislikedBy.length;
        if(pointsCount < 0) {
            pointsCount = 0;
        }
        dispatch({
            type:TOGGLE_SEARCH_LIKE,
            payload: {id, data: {likedBy, pointsCount, dislikedBy}}
        })

        await postService.likePost(id);

    }
}


export const togglePostDislike = (id, dislikedBy, likedBy) => {
    return async(dispatch) => {
        let pointsCount = likedBy.length - dislikedBy.length;
        if(pointsCount < 0) {
            pointsCount = 0;
        }
        dispatch({
            type:TOGGLE_SEARCH_LIKE,
            payload: {id, data: {likedBy, pointsCount, dislikedBy}}
        })

        await postService.dislikePost(id);

    }
}


export const loadSearchPosts = (query, page) => {
    return async (dispatch) => {
      const results = await postService.getSearchedPosts(query, 10, page);
  
      dispatch({
        type: LOAD_SEARCH_POSTS,
        payload: results,
      });
    };
  };

  export default searchReducer;