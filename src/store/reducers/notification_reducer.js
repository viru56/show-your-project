import {
  NOTIFICATIONS_PERMISSION,
  FIND_NOTIFICATIONS,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION
} from "../types";

export default function(state = {}, action) {
  switch (action.type) {
    case NOTIFICATIONS_PERMISSION:
      return {
        ...state,
        token: action.payload.token || null,
        error: action.payload.error || null
      };
    case FIND_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications || null,
        error: action.payload.error || null
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        error: action.payload.error || null
      };
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        error: action.payload.error || null
      };
    default:
      return state;
  }
}
