import React from 'react'
import './index.scss'

export { Menu }

interface MenuProps {
  url: string
}

function Menu(props: React.PropsWithChildren<MenuProps>) {
  const { children, url, ...prop } = props
  return (
    <a className="menu" href={url} {...prop}>
      {children}
    </a>
  )
}
