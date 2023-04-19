import React from 'react'
import styled from 'styled-components'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../../authConfig'
import './index.scss'

export { Login }

function Login() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).then(e => {
            console.log("::success", e)
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <div className="w-screen h-screen">
            <div className="bg">
                <div className="font-bold text-[32px]">
                    <p>Log in to your Account.</p>
                </div>

                <button
                    id="sign_in_button"
                    className="button"
                    type="button"
                    onClick={handleLogin}
                >
                    Sign in with Microsoft Azure
                </button>
            </div>
        </div>
    );
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
