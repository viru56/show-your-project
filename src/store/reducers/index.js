import { combineReducers } from "redux";

import User from "./user_reducer";
import Idea from "./pitch_reducer";
import Notification from "./notification_reducer";
import Connection from './connection_reducer';

const rootReducers = combineReducers({
  User,Idea,Notification,Connection
});

export default rootReducers;
