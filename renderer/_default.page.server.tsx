export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'urlParsed', 'env']

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import logoUrl from './logo.png'
import type { PageContextServer } from './types'
import { ServerStyleSheet } from "styled-components";

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  let pageHtml = ''
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  // if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined')

  const sheet = new ServerStyleSheet();

  if (Page) {
    console.log('Server')
    pageHtml = ReactDOMServer.renderToString(
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    )
  }

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'App using Vite + vite-plugin-ssr'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <style>${dangerouslySkipEscape(sheet.getStyleTags())}</style>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  console.log(process.env)
  console.log(import.meta.env)
  return {
    documentHtml,
    pageContext: {
      env: process.env,
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
      user: {
        roles: []
      }
    }
  }
}
