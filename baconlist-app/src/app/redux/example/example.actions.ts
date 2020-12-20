export enum Types {
  GET = "EXAMPLE_GET_EXAMPLE",
  GET_SUCCESS = "EXAMPLE_GET_EXAMPLE_SUCCESS",
  GET_FAIL = "EXAMPLE_GET_EXAMPLE_FAIL"
}

export type Action =
  | GetExampleAction
  | GetExampleSuccessAction
  | GetExampleFailAction

export type GetExampleAction = {
  type: Types.GET
}

export type GetExampleSuccessAction = {
  type: Types.GET_SUCCESS
  payload: { data: string }
}

export type GetExampleFailAction = {
  type: Types.GET_FAIL
  payload: { errors: Record<string, unknown> }
}

export function getExample(): Action {
  return {
    type: Types.GET
  }
}

export function getExampleSuccess(data: string): Action {
  return {
    type: Types.GET_SUCCESS,
    payload: { data }
  }
}

export function getExampleFail(errors: Record<string, unknown>): Action {
  return {
    type: Types.GET_FAIL,
    payload: { errors }
  }
}
