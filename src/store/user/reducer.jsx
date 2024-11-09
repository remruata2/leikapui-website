import { SET_USER, CLEAR_USER, LOGIN_SUCCESS, LOGOUT } from "./actions";

const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
