import React, { memo } from "react"
import { StyledInput } from "./style"

type Props = {
  value: string
  onClick: () => void
}

export const SubmitButton = memo(
  ({ value, onClick }: Props): JSX.Element => {
    function handleOnClick(e: React.MouseEvent<HTMLInputElement>) {
      e.preventDefault()
      onClick()
    }

    return (
      <StyledInput
        data-testid={`submit_button-${value}`}
        id={value}
        type="submit"
        value={value}
        onClick={handleOnClick}
      />
    )
  }
)
