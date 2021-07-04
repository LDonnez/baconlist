import { useCallback } from "react"
import { AppThunk, useAppDispatch } from "store"
import { useAuth } from "./useAuth"

export const useApi = () => {
  const { authorized } = useAuth()
  const dispatch = useAppDispatch()

  const call = useCallback(
    async (action: AppThunk) => {
      try {
        if (authorized) {
          return dispatch(action)
        }
      } catch (err) {
        console.error(err)
      }
    },
    [
      dispatch,
      authorized
    ]
  )

  return call
}
