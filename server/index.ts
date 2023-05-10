// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import express from 'express'
import compression from 'compression'
import cors from 'cors'
import fs from 'fs'
import { renderPage } from 'vite-plugin-ssr/server'
import { root } from './root.js'
import puppeteer from 'puppeteer'
import stream from 'stream'
import Mustache from 'mustache'

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded())
  app.use(compression())
  app.use(cors())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    res.status(statusCode).type(contentType).send(body)
  })

  app.post('/api/pdf', async (req, res, next) => {
    const { template, data } = req.body
    const template1 = fs.readFileSync(`${root}/templates/${template}.mustache`, { encoding: 'utf8' })
    const rendered = Mustache.render(template1, data)
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setContent(rendered)
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, })
    await page.close()
    await browser.close()

    const readStream = new stream.PassThrough()
    readStream.end(pdfBuffer)
    res.set('Content-Type', 'application/pdf')
    readStream.pipe(res)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
