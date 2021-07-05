import { unwrapResult } from "@reduxjs/toolkit"
import {
  getTokenPayload,
  getAccessToken,
  getAccessTokenSilently,
  getAccessTokenIsExpired
} from "app/redux/auth/auth.slice"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useAppDispatch } from "store"

export const useAuth = () => {
  const { push } = useHistory()
  const dispatch = useAppDispatch()
  const isExpired = useSelector(getAccessTokenIsExpired)
  const accessToken = useSelector(getAccessToken)
  const tokenPayload = useSelector(getTokenPayload)
  const currentUserId = useMemo(() => {
    if (tokenPayload?.sub) {
      return tokenPayload.sub
    }
  }, [tokenPayload?.sub])
  const [authorized, setAuthorized] = useState(!isExpired)

  useEffect(() => {
    async function authorize() {
      try {
        unwrapResult(await dispatch(getAccessTokenSilently()))
        setAuthorized(true)
      } catch (error) {
        push("/login")
      }
    }
    authorize()
  }, [dispatch, authorized, push])

  return { authorized, accessToken, tokenPayload, currentUserId }
}
