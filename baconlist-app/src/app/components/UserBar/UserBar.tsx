import { useApi } from "app/hooks/useApi"
import { getCurrentUser, getUserById } from "app/redux/currentUser/currentUser.slice"
import { getTokenPayload } from "app/redux/auth/auth.slice"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Container } from "./style"

export const UserBar = () => {
  const call = useApi()
  const tokenPayload = useSelector(getTokenPayload)
  const user = useSelector(getCurrentUser)

  useEffect(() => {
    if (tokenPayload?.sub) {
      call(getUserById({ userId: tokenPayload?.sub }))
    }
  }, [call, tokenPayload?.sub])

  return (
    <Container>
      { user && `Hello, ${user.firstName}` }
    </Container>
  )
}
