import React, { useCallback, useState } from "react"
import { StyledForm } from "./style"
import { TextFieldLabel } from "components/TextFieldLabel"
import { TextField } from "components/TextField"
import { SubmitButton } from "components/SubmitButton"
import { useTranslate } from "app/hooks/useTranslate"
import { authenticate } from "app/redux/auth/auth.slice"
import { useAppDispatch } from "store"
import { unwrapResult } from "@reduxjs/toolkit"
import { useHistory } from "react-router-dom"

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const { push } = useHistory()
  const [hasError, setError] = useState(false)
  const [loginValues, setLoginValues] = useState<{
    email: string
    password: string
  }>({
    email: "",
    password: ""
  })
  const { translate } = useTranslate()

  const handleChange = useCallback((name: string, value: string) => {
    setLoginValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async () => {
    try {
      unwrapResult(await dispatch(authenticate(loginValues)))
      push("/")
    } catch (error) {
      setError(true)
    }
  }

  return (
    <StyledForm>
      <TextFieldLabel label={translate("fields.e-mail")} name="email" />
      <TextField
        type="email"
        name="email"
        value={loginValues.email}
        onChange={handleChange}
      />
      <TextFieldLabel label={translate("fields.password")} name="password" />
      <TextField
        type="password"
        name="password"
        value={loginValues.password}
        onChange={handleChange}
      />
      <SubmitButton
        value={translate("buttons.log-in")}
        onClick={handleSubmit}
      />
      {hasError && <div> something went wrong </div>}
    </StyledForm>
  )
}
