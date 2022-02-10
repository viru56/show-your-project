import {
  SIGN_IN,
  SIGN_UP,
  SEND_RESET_PASSWORD_MAIL,
  SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_FACEBOOK,
  FIND_USER,
  FIND_USERS,
  UPDATE_USER,
  UPDATE_PASSWORD,
  SIGN_IN_WITH_TWITTER,
  SIGN_IN_WITH_LINKEDIN,
  DELETE_USER
} from "../types";

export default function (state = {}, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case SIGN_UP:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null,
        info: action.payload.info || null
      };
    case SEND_RESET_PASSWORD_MAIL:
      return {
        ...state,
        info: action.payload.info || null,
        error: action.payload.error || null
      };
    case SIGN_IN_WITH_GOOGLE:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case SIGN_IN_WITH_FACEBOOK:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case SIGN_IN_WITH_TWITTER:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case SIGN_IN_WITH_LINKEDIN:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case FIND_USER:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null
      };
    case FIND_USERS:
      return {
        ...state,
        users: action.payload.users || null,
        error: action.payload.error || null
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user || null,
        error: action.payload.error || null,
        info: action.payload.info || null
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        error: action.payload.error || null,
        info: action.payload.info || null
      };
    case DELETE_USER:
      return {
        ...state,
        users: action.payload.email ? state.users.filter(u => u.email !== action.payload.email) : state.users,
        error: action.payload.error || null,
        info: action.payload.info || null
      }
    default:
      return state;
  }
}
