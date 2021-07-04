import React, { memo } from "react"
import { UserBar } from "app/components/UserBar"

export const RootRoute = memo(() => {
  return (
    <div>
      <UserBar />
      You are successfully logged in
    </div>
  )
})
