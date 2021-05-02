import { unwrapResult } from "@reduxjs/toolkit"
import {
  getAccessTokenIsExpired,
  getTokenPayload,
  refresh
} from "app/redux/auth/auth.slice"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useAppDispatch } from "store"

export const useAuth = () => {
  const { push } = useHistory()
  const dispatch = useAppDispatch()
  const isExpired = useSelector(getAccessTokenIsExpired)
  const tokenPayload = useSelector(getTokenPayload)
  const currentUserId = useMemo(() => {
    if (tokenPayload?.sub) {
      return tokenPayload.sub
    }
  }, [tokenPayload?.sub])
  const [authorized, setAuthorized] = useState(!isExpired)

  useEffect(() => {
    async function refreshToken() {
      try {
        unwrapResult(await dispatch(refresh()))
        setAuthorized(true)
      } catch (error) {
        push("/login")
      }
    }
    if (!authorized) {
      refreshToken()
    }
  }, [dispatch, authorized, push])

  return { authorized, tokenPayload, currentUserId }
}
