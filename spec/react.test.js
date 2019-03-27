import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe("01-ReactBasic", () => {
  it("renders a simple component", () => {
    const Test = ({ name }) => <div>{name}</div>

    const mounted = mount(<Test name="foo"/>)
    expect(mounted.props().name === 'foo')
    const divs = mounted.find("div")
    expect(divs.length === 1)
    expect(divs.at(0).render().html() === 'foo')
  })
})