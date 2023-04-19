import React from 'react'
import styled from 'styled-components'
import { Login } from '../../components/login'

export { Page }

function Page() {
    return (
        <Login />
    )
}

const Background = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: end;
`

const Button = styled.button`
  width: auto;
  height: 48px;
`
