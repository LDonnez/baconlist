import React from "react"
import { render, fireEvent, screen } from "testUtils"
import { TextField } from "../TextField"

describe("TextField", () => {
  test("renders TextField and calls onChange", async () => {
    const onChange = jest.fn()

    render(
      <TextField type="text" value="test" name="test" onChange={onChange} />
    )

    fireEvent.change(await screen.findByTestId("textfield-test"), {
      target: { value: "it works!" }
    })

    expect(onChange).toHaveBeenCalled()
  })
})
