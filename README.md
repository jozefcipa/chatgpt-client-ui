## Custom ChatGPT client

> The purpose of this repo is to explain how Server Sent Events work on an example of a custom ChatGPT interface.

https://github.com/jozefcipa/chatgpt-client-ui/assets/11503453/50be7e62-b8b7-4868-aee9-c34936fe6fbb

This code is **not ready for production**! The goal was to build a simple prototype without no optimizations in mind.

You can find the article [jozefcipa.com/blog/server-sent-events-or-how-chatgpt-typing-animation-works](https://jozefcipa.com/blog/server-sent-events-or-how-chatgpt-typing-animation-works)

#### Running locally

1. API
Note that you have to configure an OpenAI [API key](https://platform.openai.com/account/api-keys).

- `cd ./backend`
- `npm install`
- `make build && make run`

2. Frontend

- `cd ./frontend`
- `npm install`
- `npm start`