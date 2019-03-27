import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import jsdom from 'jsdom'
import expect from 'expect'

import fetch from 'node-fetch'

Enzyme.configure({ adapter: new Adapter() })

before(() => {
  const { JSDOM } = jsdom
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'})
  const { window } = dom

  global.window = window
  global.document = window.document
  global.navigator = {
      userAgent: 'node.js',
  }

  global.expect = expect
  global.mount = mount
  global.fetch = fetch
})
