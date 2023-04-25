import React from 'react'
import { Menu } from '../../../components/menu'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'

export { Page }

function Page() {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const signout = async () => {
    await instance.logoutRedirect()
  }
  return (
    <>
      <h1 className="text-sm font-medium text-gray-900">Welcome {String(isAuthenticated)} #</h1>
      <div className="menus">
        <Menu url="http://localhost:5173/">Menu 1</Menu>
        <Menu url="/">Menu 2</Menu>
        <Menu url="/">Menu 3</Menu>
      </div>
      <div className="button" onClick={signout}>Sign Out</div>
    </>
  )
}
