import React, { memo } from "react"
import { StyledInput, Container } from "./style"

type Props = {
  value: string
  name: string
  type: "text" | "email" | "password" | "number"
  onChange: (name: string, value: string) => void
}

export const TextField = memo(
  ({ value, name, onChange, type }: Props): JSX.Element => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange(name, e.target.value)
    }

    return (
      <Container>
        <StyledInput
          data-testid={`textfield-${name}`}
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
        />
      </Container>
    )
  }
)
