import React from 'react'
import { Menu } from '../../components/menu'

export { Page }

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      <div className="menus">
        <Menu url="http://localhost:5173/">Menu 1</Menu>
        <Menu url="/">Menu 2</Menu>
        <Menu url="/">Menu 3</Menu>
      </div>
    </>
  )
}
