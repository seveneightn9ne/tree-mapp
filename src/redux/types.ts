import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { UiState } from "./slices/ui";

export interface TMState {
  ui: UiState;
}

export type TMPlainAction = { type: string; payload?: {} };

interface ThunkAnnotation {
  thunkName: string;
  thunkArgs: { [k: string]: any };
}

export type TMThunkAction<R = void> = TMThunkActionFn<R> & ThunkAnnotation;
export type TMSyncThunkAction<R = void> = TMSyncThunkActionFn<R> &
  ThunkAnnotation;

type TMSyncThunkActionFn<R = void> = ThunkAction<
  R,
  TMState,
  undefined,
  TMPlainAction
>;

type TMThunkActionFn<R> = ThunkAction<
  Promise<R>,
  TMState,
  undefined,
  TMPlainAction
>;
export type TMThunkDispatch = ThunkDispatch<TMState, undefined, TMPlainAction>;

export function t<R = any>(
  thunkName: string,
  thunkArgs: { [k: string]: any },
  p: TMThunkActionFn<R>
): TMThunkAction<R> {
  // tslint:disable-next-line
  const r: TMThunkAction<R> = Object.assign(p, { thunkName, thunkArgs });
  return r;
}

export function tSync<R = any>(
  thunkName: string,
  thunkArgs: { [k: string]: any },
  p: TMSyncThunkActionFn<R>
): TMSyncThunkAction<R> {
  // tslint:disable-next-line
  const r: TMSyncThunkAction<R> = Object.assign(p, { thunkName, thunkArgs });
  return r;
}
