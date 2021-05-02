import styled from "styled-components"

export const StyledInput = styled.input`
  border: 0.3rem solid ${props => props.theme.colors.primary.black};
  outline: none;
  height: 4.4rem;
  box-sizing: border-box;
  width: 100%;
  font-family: inherit;
  font-size: 1.8rem;
`

export const Container = styled.div`
  width: 100%;
`
