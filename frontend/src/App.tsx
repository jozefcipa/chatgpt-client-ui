import React, { useState, useEffect } from 'react'
import logo from './assets/logo.svg'
import chatLogo from './assets/logo-chat.svg'
import './App.css'
import { fetchEventSource } from '@microsoft/fetch-event-source'

interface Message {
  // conforms to the OpenAI API
  role: 'assistant' | 'user'
  content: string
}

function Message({ message, isTyping = false }: { message: Message, isTyping?: boolean }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="author">
        <img src={message.role === 'assistant' ? chatLogo : logo} className="avatar" />
      </div>
      <div className={`text ${isTyping && 'typing-cursor'}`}>
        {message.content}
      </div>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState<Array<Message>>([])
  const [input, setInput] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')

  useEffect(() => {
    if (!isLoading && loadingMessage) {
      setMessages(messages => [...messages, { role: 'assistant', content: loadingMessage}])
      setLoadingMessage('')
    }
  }, [isLoading])

  useEffect(() => {
    if (isLoading) {
      fetchEventSource(`http://localhost:3333/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ messages }),
        onopen: async response => {
          // HANDLING REQUEST OR INPUT VALIDATION ERRORS HERE
        },
        onmessage: (evt) => {
          const message = evt.data
          if (message === '[DONE]') {
            setLoading(false)
            return
          }
          const data = JSON.parse(message)
          console.log('Incoming payload', data)
          
          if (data.choices[0]?.delta.content) {
            setLoadingMessage(loadingMessage => loadingMessage + data.choices[0].delta.content)
          }
        },
        onerror: err => {
          console.error('Streaming failed', err)
          setLoading(false)

          // throw err, otherwise it will automatically retry
          throw err
        },
      })
    }
    
  }, [messages, isLoading])

  return (
    <main>
      <div className="messages-box">
        {/* Print all messages history */}
        { messages.map((message, i) => <Message message={message} key={i} />) }

        {/* Print current message that is being written by the chatbot */}
        {isLoading && <Message message={{ role: 'assistant', content: loadingMessage }} isTyping/> }
      </div>

      <input
        type="text"
        className="prompt"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setMessages(messages => [...messages, { role: 'user', content: input}])
            setInput('')
            setLoading(true)
          }
        }}
        disabled={isLoading}
        placeholder="Send a message."
      />
   </main>
  )
}

export default App
