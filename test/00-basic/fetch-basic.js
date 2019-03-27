import React from 'react'

import Fetch from './../../src/index'

describe("00-FetchBasic", () => {
  it("simple fetch request", () => {
    const Test = ({ response }) => <div>{response.total_count}</div>

    const mounted = mount(
      <Fetch
        request='https://api.github.com/search/users?q=alexanderdzhoganov'
        onLoading={}
      />
    )
    expect(mounted.props().request === url)
    mounted.update()

    return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      const text = mounted.render().text()
      console.log(text)
    })
  })
})
