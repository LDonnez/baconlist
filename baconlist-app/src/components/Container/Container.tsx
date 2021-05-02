import styled from "styled-components"

export type ContainerProps = {
  margin?: number
}

export const Container = styled.div.attrs(({ margin }: ContainerProps) => {
  return {
    display: "flex",
    margin: `${margin ?? 0}px`
  }
})
