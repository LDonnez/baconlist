import React, { memo } from "react"
import { StyledLabel } from "./style"

type Props = {
  label: string
  name: string
}

export const TextFieldLabel = memo(({ label, name }: Props) => {
  return (
    <StyledLabel htmlFor={name} aria-label={name}>
      {label}
    </StyledLabel>
  )
})
