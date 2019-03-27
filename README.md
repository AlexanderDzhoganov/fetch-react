# fetch-react

`fetch-react` is a React [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) that wraps the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in a declarative way.

```html
<Fetch
  request={request}
  opts={opts}
  responseFormat={responseFormat}
  onLoading={onLoading}
  onResponse={onResponse}
  onError={onError}
/>
```

# Basic usage

```jsx
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

## Low-level `withFetch` API

```jsx
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
