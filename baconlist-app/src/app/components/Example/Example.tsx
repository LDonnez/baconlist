import React, { useCallback, useEffect } from "react"
import * as actions from "app/redux/example/example.actions"
import * as selectors from "app/redux/example/example.selectors"
import { useDispatch, useSelector } from "react-redux"

export const Example = () => {
  const dispatch = useDispatch()
  const getExample = useCallback(() => dispatch(actions.getExample()), [
    dispatch
  ])
  const example = useSelector(selectors.getExample)

  useEffect(() => {
    getExample()
  }, [getExample])

  return <div data-testid="example">{example}</div>
}
