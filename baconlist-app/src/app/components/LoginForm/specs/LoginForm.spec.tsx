import { LoginForm } from "../LoginForm"
import { render } from "testUtils"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as api from "app/api/auth"
import { AxiosPromise } from "axios"

describe("LoginForm", () => {
  it("renders LoginForm component", () => {
    render(<LoginForm />)
  })

  it("successfully logins", async () => {
    const spy = jest.spyOn(api, "login").mockImplementation(async () => {
      return Promise.resolve({
        data: { accessToken: "test", refreshToken: "test" }
      }) as AxiosPromise
    })
    render(<LoginForm />)
    userEvent.click(screen.getByRole("button"))
    expect(spy).toBeCalled()
  })

  it("fails loging in", async () => {
    const spy = jest.spyOn(api, "login").mockImplementation(async () => {
      return Promise.reject(Error("Network Error")) as AxiosPromise
    })
    render(<LoginForm />)
    userEvent.click(screen.getByRole("button"))
    expect(spy).toBeCalled()
    expect(await screen.findByText(/something went wrong/)).toBeInTheDocument()
  })
})
