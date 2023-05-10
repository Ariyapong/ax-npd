import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import logo from './logo.png'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'
import { Link } from './Link'
import { persistor, store } from '../src/store'
import './PageShell.css'

export { PageShell }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PageContextProvider pageContext={pageContext}>
            <Layout>
              <Sidebar>
                <Logo />
                <Link className="navitem" href="/">
                  Home
                </Link>
                <Link className="navitem" href="/about">
                  About
                </Link>
                <Link className="navitem" href="/report">
                  Report
                </Link>
                <Link className="navitem" href="/workflow">
                  Workflow
                </Link>
              </Sidebar>
              <Content>{children}</Content>
            </Layout>
          </PageContextProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em'
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        // padding: 20,
        // paddingBottom: 50,
        // borderLeft: '2px solid #eee',
        // minHeight: '100vh'
      }}
    >
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  )
}
