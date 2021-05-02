import React from "react"
import { render, fireEvent, screen } from "testUtils"
import { SubmitButton } from "../SubmitButton"

describe("SubmitButton", () => {
  test("renders SubmitButton and clicks on it 1 time", async () => {
    const onClick = jest.fn()

    render(<SubmitButton value="test" onClick={onClick} />)

    fireEvent.click(await screen.findByTestId("submit_button-test"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
