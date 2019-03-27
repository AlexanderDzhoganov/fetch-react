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
  app.get('/json', (req, res) => {
    res.setHeader('content-type', 'application/json;encoding=utf-8')
    res.send(JSON.stringify({foo: 42}))
    res.end()
  })

  app.get('/text', (req, res) => {
    res.send('hello world')
    res.end()
  })

  app.get('/slow', (req, res) => {
    setTimeout(() => {
      res.send('rosebud')
      res.end()
    }, 15)
  })

  app.get('/headers', (req, res) => {
    res.setHeader('content-type', 'application/json;encoding=utf-8')
    res.send(JSON.stringify(req.headers))
    res.end()
  })

  return new Promise(resolve => listener = app.listen(PORT, resolve))
})

afterAll(() => listener.close())

const awaitResult = () => new Promise(resolve => setTimeout(resolve, 25))

describe("react-setup", () => {
  it("renders a simple component", () => {
    const Test = ({ name }) => <div>{name}</div>

    const mounted = mount(<Test name="foo"/>)
    expect(mounted.props().name === 'foo')
    const divs = mounted.find("div")
    expect(divs.length === 1)
    expect(divs.at(0).render().html() === 'foo')
  })
})

describe("fetch-react", () => {
  it("passes arguments to fetch() correctly", () => {
    const req = {foo: 1234}
    const opts = {bar: 'hello world'}

    const c = mount(<Fetch
      request={req}
      opts={opts}
      fetchFn={(_req, _opts) => {
        expect(_req).toBe(req)
        expect(_opts).toBe(opts)
        return Promise.resolve()
      }}
    />)
  })

  it("json get request", () => {
    const url = `http://localhost:${PORT}/json`
    const c = mount(<Fetch
      request={url}
      onData={resp => <div>{resp.foo}</div>}
    />)

    expect(c.props().request).toBe(url)
    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('42')
    })
  })

  it("json get request (onData returns string)", () => {
    const url = `http://localhost:${PORT}/json`
    const c = mount(<Fetch
      request={url}
      onData={resp => resp.foo}
    />)

    expect(c.props().request).toBe(url)
    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('42')
    })
  })

  it("get with custom headers", () => {
    const url = `http://localhost:${PORT}/headers`
    const headers = { 'x-foo': 'a custom header' }

    const c = mount(<Fetch
      request={url}
      opts={{ headers }}
      onData={resp => resp['x-foo']}
    />)

    expect(c.props().request).toBe(url)
    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('a custom header')
    })
  })

  it("use a custom readFn", () => {
    const url = `http://localhost:${PORT}/text`

    const c = mount(<Fetch
      request={url}
      onData={resp => resp}
      readFn={resp => resp.text()}
    />)

    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('hello world')
    })
  })

  it("error handler", () => {
    const url = `http://this-is-a-non-existent-address.com`

    const c = mount(<Fetch
      request={url}
      onError={err => 'this is an error'}
      readFn={resp => resp.text()}
    />)

    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('this is an error')
    })
  })

  it("response with invalid json", () => {
    const url = `http://localhost:${PORT}/text`

    const c = mount(<Fetch
      request={url}
      onError={err => err.type}
    />)

    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('invalid-json')
    })
  })

  it("error from onData", () => {
    const url = `http://localhost:${PORT}/text`

    const c = mount(<Fetch
      request={url}
      onData={resp => { throw 'custom error'} }
      onError={err => err}
      readFn={resp => resp.text()}
    />)

    c.update()

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('custom error')
    })
  })

  it("loading renderer", () => {
    const url = `http://localhost:${PORT}/slow`

    const c = mount(<Fetch
      request={url}
      onData={resp => resp}
      onLoading={() => 'i am loading'}
      readFn={resp => resp.text()}
    />)

    c.update()
    expect(c.render().text()).toBe('i am loading')

    return awaitResult()
    .then(() => {
      expect(c.render().text()).toBe('rosebud')
    })
  })
})
