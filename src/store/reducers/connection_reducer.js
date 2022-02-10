import {
  FIND_CONNECTIONS,
  UPDATE_CONNECTION,
  ADD_CONNECTION,
  UPDATE_LAST_MESSAGE
} from "../types";
const defaultState = {
  connections: [],
  error: null
}
export default function (state = defaultState, action) {
  let connections = [...state.connections];
  switch (action.type) {
    case FIND_CONNECTIONS:
      return {
        ...state,
        connections: action.payload.connections || null,
        error: action.payload.error || null
      };
    case ADD_CONNECTION:
      return {
        ...state,
        error: action.payload.error || null
      };
    case UPDATE_CONNECTION:
      if (action.payload.type === 'reject') {
        connections = state.connections.filter((con) => con.email !== action.payload.connectionEmail);
      } else {
        connections.forEach((con) => {
          if (action.payload.connectionEmail === con.email) {
            con.isConnected = true;
          }
        })
      }
      return {
        ...state,
        connections,
        error: action.payload.error || null
      };
    case UPDATE_LAST_MESSAGE:
      if (action.payload.id) {
        const users = action.payload.id.split('#');
        for (let con of connections) {
          if (users.includes(con.email)) {
            con.lastMessage = action.payload.lastMessage;
            con.unread = con.unread ? con.unread + 1 : 1;
          }
        }
      }
      return {
        ...state,
        connections,
        error: action.payload.error || null
      };
    default:
      return state;
  }
}
