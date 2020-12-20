import { State } from "../state"

export const getExample = (state: State) => state.example.data

export const loading = (state: State) => state.example.loading
