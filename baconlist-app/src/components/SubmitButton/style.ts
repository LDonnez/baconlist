import styled from "styled-components"

export const StyledInput = styled.input`
  border-radius: 0.1rem;
  border: none;
  outline: none;
  height: 4.4rem;
  margin-top: 1rem;
  min-width: 5rem;
  font-family: inherit;
  line-height: 0;
  cursor: pointer;
  background-color: ${props => props.theme.colors.primary.black};
  color: ${props => props.theme.colors.secondary.white};
  font-size: ${props => props.theme.fontSize.label}; ;
`
