import React, { PureComponent, Component } from 'react'

export const withFetch = (url, opts) => BaseComponent =>
  class withFetch extends Component {
    static defaultProps = {
      fetchFn: /* istanbul ignore next */ fetch || window.fetch || global.fetch,
      readFn: response => response.json()
    }

    constructor(props) {
      super(props)

      this.state = {
        fetchResponse: undefined,
        fetchError: undefined
      }
    }

    componentDidMount() {
      const { fetchFn, readFn } = this.props

      fetchFn(url, opts)
      .then(readFn)
      .then(fetchResponse => this.setState({ fetchResponse }))
      .catch(fetchError => this.setState({ fetchError }))
    }

    render() {
      return <BaseComponent { ...this.props } { ...this.state } />;
    }
  }

class FetchHelper extends PureComponent {
  static defaultProps = {
    onLoading: () => null,
    onError: () => null
  }

  render() {
    const {
      fetchResponse,
      fetchError,
      onLoading,
      onData,
      onError
    } = this.props

    let content = null

    if (fetchError) {
      content = onError(fetchError)
    } else if (fetchResponse) {
      try {
        content = onData(fetchResponse)
      } catch (error) {
        content = onError(error)
      }
    } else {
      content = onLoading()
    }

    return typeof content === 'object' ? content : <div>{content}</div>
  }
}

export default props => {
  const { url, opts } = props
  const F = withFetch(url, opts)(FetchHelper)
  return <F { ...props }/>
}
