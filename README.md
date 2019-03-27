# fetch-react &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/AlexanderDzhoganov/fetch-react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/fetch-react.svg?style=flat)](https://www.npmjs.com/package/fetch-react) [![CircleCI Status](https://circleci.com/gh/AlexanderDzhoganov/fetch-react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/AlexanderDzhoganov/fetch-react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/alexanderdzhoganov/fetch-react/pulls)

`fetch-react` is a React [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) that wraps the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in a declarative way.

```html
<Fetch
  request={request}
  opts={opts}
  onResponse={onResponse}
  onLoading={onLoading}
  onError={onError}
  responseFormat={responseFormat}
  fetchFn={fetchFn}
/>
```

# Props

- `request` - the request url, the first argument passed to `fetch()` - a string, [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) or [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object
- `opts` - request options, the second argument passed to `fetch()`
- `onResponse` - response renderer - a function with one argument, the response instance
- `onLoading` - (optional) loading renderer - a function with no arguments
- `onError` - (optional) error renderer - a function with one argument, the request error
- `responseFormat` - (optional) one of `json`, `text`, `formData`, `blob` or `arrayBuffer` (defaults to `json`)
- `fetchFn` - (optional) `fetch()` implementation to use (defaults to `window.fetch`)

# Installation

```bash
npm i fetch-react
```

For [older browsers](https://caniuse.com/#feat=fetch) without native fetch support you need [a polyfill](https://github.com/github/fetch).

For Node.js usage you need [node-fetch](https://www.npmjs.com/package/node-fetch).

# Usage

```js
import React from 'react'
import Fetch from 'fetch-react'

const GitHubUser = ({ name }) =>
  <Fetch
    request={'https://api.github.com/search/users?q=' + name}
    onResponse={response => <img src={response.items[0].avatar_url}/>}
    onLoading={() => 'Loading...'}
    onError={error => 'An error occured!'}
  />

// and use like

<GitHubUser name="alexanderdzhoganov"/>
```

# Fetch options

You can pass options to the `fetch` call using the `opts` prop.
Valid options are described [here](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters).

# Default options and base URL

Wrap the component to set default options or a base URL.

```js
const fetchOpts = { credentials: 'same-origin' }

const ApiFetch = props => <Fetch
  request={new URL('https://api.example.com/v1/', props.url)}
  opts={fetchOpts}
  { ...props }
/>

// then use like

<ApiFetch
  url="/user/11"
  onResponse={user => <User user={user}/>}
/>
```

# Handling errors in the response

You can `throw` from `onResponse` which will render `onError` with the thrown error as first argument.

# Alternative `withFetch` API

```js
import React from 'react'
import { withFetch } from 'fetch-react'

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

const url = 'https://api.github.com/search/users?q=alexanderdzhoganov'
const WrappedComponent = withFetch(url)(MyComponent)
```
