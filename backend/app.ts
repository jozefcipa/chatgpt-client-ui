import * as Koa from 'koa'
import * as Router from 'koa-router'
import { koaBody } from 'koa-body'
import * as koaCors from '@koa/cors'
import { Configuration, OpenAIApi } from 'openai'
import { IncomingMessage } from 'http'

// initialize Koa
const app = new Koa()
const router = new Router()

// initialize OpenAI
const configuration = new Configuration({
  apiKey: 'YOUR-API-KEY'
})
const openai = new OpenAIApi(configuration)

router.post('/api/chat', async ctx => {
  console.log('Incoming request', ctx.request.body)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: ctx.request.body.messages,
      stream: true,
      n: 1,
      max_tokens: 2000,
      temperature: 0.5,
    }, { responseType: 'stream'})

    ;(completion.data as any as IncomingMessage).on('data', data => {
      console.log('Arriving chunk', data.toString())
    })

    // initialize the SSE stream
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Content-Type', 'text/event-stream')
    ctx.set('Connection', 'keep-alive')

    ctx.body = completion.data

  } catch (err) {
      console.error('Request failed', {
        err,
        response: err.response?.data
      })
  }
})

app.use(koaCors())
app.use(koaBody())
app.use(router.routes())

app.listen(3333, function(){
   console.log('Server running on https://localhost:3333')
})