import React from 'react'
import logo from './logo.png'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'
import './PageShell.css'
import { Link } from './Link'
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '../authConfig'
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react'
import { Login } from '../components/login'

export { PageShell }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const pca = new PublicClientApplication(msalConfig)
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = pca.getAllAccounts()
  if (accounts.length > 0) {
    pca.setActiveAccount(accounts[0])
  }

  pca.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult
      const account = payload.account
      console.log('### account', account)
      pca.setActiveAccount(account)
    }
  });

  return (
    <React.StrictMode>
      <MsalProvider instance={pca}>
        <PageContextProvider pageContext={pageContext}>
          <UnauthenticatedTemplate>
            <Login />
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <Layout>
              <Sidebar>
                <Logo />
                <Link className="navitem" href="/">
                  Home
                </Link>
                <Link className="navitem" href="/about">
                  About
                </Link>
              </Sidebar>
              <Content>{children}</Content>
            </Layout>
          </AuthenticatedTemplate>
        </PageContextProvider>
      </MsalProvider>
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
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh'
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
