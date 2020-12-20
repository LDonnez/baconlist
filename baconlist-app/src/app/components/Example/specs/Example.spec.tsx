import React from "react"
import MockAdapter from "axios-mock-adapter"
import { Example } from "../Example"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import store from "store"
import { exampleApi } from "app/api/api"

describe("Example", () => {
  let exampleProxyMock: MockAdapter

  beforeAll(async () => {
    exampleProxyMock = new MockAdapter(exampleApi)
    exampleProxyMock.onGet("/example").reply(200, "example")
  })

  afterAll(() => {
    exampleProxyMock.restore()
  })

  test("renders Example component", () => {
    render(
      <Provider store={store}>
        <Example />
      </Provider>
    )
  })

  test("renders Example component with 'example' inside div", async () => {
    render(
      <Provider store={store}>
        <Example />
      </Provider>
    )
    const example = await screen.findByTestId("example")
    expect(example.textContent).toEqual("example")
  })
})
