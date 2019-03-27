import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import express from 'express'

import fetch from 'node-fetch'
import Fetch from './../src/index'

global.fetch = fetch
Enzyme.configure({ adapter: new Adapter() })

const PORT = 48971

let app, listener

beforeAll(() => {
  app = express()
  app.get('/test', (req, res) => {
    res.setHeader('content-type', 'application/json;encoding=utf-8')
    res.send(JSON.stringify({foo: 42}))
    res.end()
  })

  return new Promise(resolve => listener = app.listen(PORT, resolve))
})

afterAll(() => listener.close())

describe("basic-get", () => {
  it("simple GET request", () => {
    const url = `http://localhost:${PORT}/test`
    const mounted = mount(
      <Fetch
        request={url}
        onData={resp => <div>{resp.foo}</div>}
      />
    )
    expect(mounted.props().request === url)
    mounted.update()

    return new Promise(resolve => setTimeout(resolve, 25))
    .then(() => {
      const text = mounted.render().text()
      expect(text === '42')
    })
  })
})
