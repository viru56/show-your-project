import { ADD_IDEA, FIND_IDEAS, FIND_IDEA, DELETE_IDEA, UPDATE_IDEA } from "../types";

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_IDEA:
      return {
        ...state,
        error: action.payload.error || null,
        info: action.payload.info || null
      };
    case FIND_IDEAS:
      return {
        ...state,
        error: action.payload.error || null,
        ideas: action.payload.ideas || null
      };
    case FIND_IDEA:
      return {
        ...state,
        error: action.payload.error || null,
        idea: action.payload.idea || null
      };
    case UPDATE_IDEA:
      return {
        ...state,
        error: action.payload.error || null,
      };
    case DELETE_IDEA:
      return {
        ...state,
        ideas: action.payload.pitchId ? state.ideas.filter(idea => idea.id !== action.payload.pitchId) : state.ideas,
        error: action.payload.error || null,
        info: action.payload.info || null
      }
    default:
      return state;
  }
}
