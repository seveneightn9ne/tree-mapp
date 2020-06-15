import { configureStore, combineReducers, Middleware } from "@reduxjs/toolkit";
import thunk, { ThunkMiddleware } from "redux-thunk";

import uiSlice from "./slices/ui";
import { TMState, TMPlainAction, TMThunkDispatch } from "./types";

const logger: Middleware<{}, TMState, TMThunkDispatch> = (_) => (next) => (
  action
) => {
  if (typeof action === "function") {
    console.log("Thunk Action:", action.thunkName, action.thunkArgs);
  } else if ("type" in action && action.type === "loaded-everything") {
    console.log("Action: loaded-everything (body omitted)");
  } else if ("type" in action) {
    console.log("Action:", action.type, action);
  } else {
    console.log("Action: Unloggable!?");
  }

  return next(action);
};

const store = configureStore({
  reducer: combineReducers({
    ui: uiSlice.reducer,
  }),
  middleware: [
    logger,
    thunk as ThunkMiddleware<TMState, TMPlainAction>,
  ] as const,
});

export default store;
