# fetch-react

```bash
npm i fetch-react
```

`fetch-react` is a React [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) that wraps the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in a declarative way.

```js
<Fetch
  request={request} // first argument passed to fetch() - a string, URL or Request object
  opts={opts}       // second argument passed to fetch()
  onLoading={onLoading}   // loading handler - a function with no arguments
  onResponse={onResponse} // response handler - a function with one argument, the response instance
  onError={onError}       // error handler - a function with one argument, the request error
  responseFormat={responseFormat} // one of 'json', 'text', 'formData', 'blob' or 'arrayBuffer' (defaults to 'json')
/>
```

# Basic usage

```js
import React from 'react'
import Fetch from 'fetch-react'

const GitHubUser = ({ name }) =>
  <Fetch
    request='https://api.github.com/search/users?q=' + name
    onLoading={() => 'loading...'}
    onResponse={response => {
      const { avatar_url, login } = response.items[0]
      <div>
        <p>{login}</p>
        <img src={avatar_url}/>
      </div>
    }
    onError={error => 'an error occured'}
  />

<GitHubUser name="alexanderdzhoganov"/>
```

# Advanced usage

## Setting options

You can pass options to the `fetch` call using the `opts` prop.
Valid options are described [here](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch).

## Base URL and default options

You can wrap the component to set default options or a base URL.

```js
const fetchOpts = { credentials: 'same-origin' }

const MyFetch = props => <Fetch
  request={new URL('https://api.example.com/v1/', props.endpoint).href}
  opts={fetchOpts}
  { ...props }
/>

<MyFetch
  url="/user/11"
  onResponse={user => <User user={user}/>}
/>
```

## Handling errors in the response

You can `throw` from `onResponse` which will render `onError` with the thrown error as first argument.

## Low-level usage of `withFetch`

```js
import React from 'react'
import {withFetch} from 'fetch-react'

const url = 'https://api.github.com/search/users?q=alexanderdzhoganov'

class MyComponent extends React.Component {
  render() {
    const { fetchResponse, fetchError } = this.props

    if (!fetchResponse && !fetchError) {
      return <div>Loading!</div>
    }

    if (fetchError) {
      return <div>Error!</div>
    }

    return <img src={fetchResponse.avatar_url}/>
  }
}

export default withFetch(url)(MyComponent)
```
