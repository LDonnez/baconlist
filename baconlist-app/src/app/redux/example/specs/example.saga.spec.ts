import * as api from "app/api/example"
import { call, put } from "redux-saga/effects"
import * as actions from "../example.actions"
import { getExampleFlow } from "../example.saga"

describe("Should successfully GET example", () => {
  const generator = getExampleFlow()
  let next

  it("should call getExample", () => {
    next = generator.next()
    expect(next.value).toMatchObject(call(api.getExample))
  })

  it("should call getExampleSuccess", () => {
    next = generator.next({ data: "example" })
    expect(next.value).toMatchObject(put(actions.getExampleSuccess("example")))
  })

  it("should be done", () => {
    next = generator.next()
    expect(next.done).toEqual(true)
  })
})
