import { Action, Types } from "./example.actions"

export type ExampleState = {
  data?: string
  loading: boolean
  errors?: Record<string, unknown>
}

const initialState: ExampleState = {
  data: undefined,
  loading: false,
  errors: undefined
}

export const exampleReducer = (
  state = initialState,
  action: Action
): ExampleState => {
  switch (action.type) {
    case Types.GET:
      return {
        ...state,
        loading: true
      }

    case Types.GET_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }

    case Types.GET_FAIL:
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    default:
      return state
  }
}

export default exampleReducer
