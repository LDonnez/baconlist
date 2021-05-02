import React from "react"
import { render, screen } from "testUtils"
import { TextFieldLabel } from "../TextFieldLabel"

describe("TextFieldLabel", () => {
  test("renders TextFieldLabel", async () => {
    render(<TextFieldLabel label="test" name="test" />)

    expect(screen.getByLabelText("test")).toBeInTheDocument()
  })
})
