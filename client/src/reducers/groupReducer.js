import {
  SET_ALL_GROUPS_LIST,
  SET_TOP_GROUPS_LIST,
  SUBSCRIBE_GROUP_FROM_LIST,
  ADD_NEW_GROUP,
} from "../actionTypes";
import groupService from "../services/group";

const groupReducer = (state = null, action) => {
  switch (action.type) {
    case SET_ALL_GROUPS_LIST:
      return { ...state, allGroups: action.payload };
    case SET_TOP_GROUPS_LIST:
      return { ...state, topGroups: action.payload };
    case SUBSCRIBE_GROUP_FROM_LIST:
      return {
        ...state,
        topGroups: state.topGroups.map((g) =>
          g.id !== action.payload.id ? g : { ...g, ...action.payload.data }
        ),
      };
    case ADD_NEW_GROUP:
      return { ...state, allGroups: [...state.allGroups, action.payload] };
    default:
      return state;
  }
};

export const fetchAllGroups = () => {
  return async (dispatch) => {
    const groups = await groupService.getAllGroups();
    dispatch({
      type: SET_ALL_GROUPS_LIST,
      payload: groups,
    });
  };
};

export const fetchTopGroups = () => {
  return async (dispatch) => {
    const topGroups = await groupService.getTopGroups();
    dispatch({
      type: SET_TOP_GROUPS_LIST,
      payload: topGroups,
    });
  };
};

export const toggleSubscribe = (id, subscribedBy) => {
  return async (dispatch) => {
    const subscriberCount = subscribedBy.length;
    dispatch({
      type: SUBSCRIBE_GROUP_FROM_LIST,
      payload: { id, data: { subscribedBy, subscriberCount } },
    });

    await groupService.toggleSubscribe(id);
  };
};

export const createNewGroup = (groupObj) => {
  return async (dispatch) => {
    try {
      console.log("Creating new group...");
      const createdGroup = await groupService.createGroup(groupObj);
      console.log("New group created:", createdGroup);
      dispatch({
        type: ADD_NEW_GROUP,
        payload: {
          groupTitle: createdGroup.groupTitle,
          groupId: createdGroup.id,
        },
      });
      console.log("New group dispatched to reducer.");
    } catch (error) {
      console.error("Error while creating new group:", error);
    }
  };
};

export default groupReducer;
