const initialState = {
  isNavbarOpen: true,
};

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CLOSE_NAVBAR":
      return { ...state, isNavbarOpen: false };
    default:
      return state;
  }
};

export const closeNavbar = () => {
  return {
    type: "CLOSE_NAVBAR",
  };
};
