import React, { PureComponent, Component } from 'react'

export const withFetch = (request, opts) => BaseComponent =>
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

      fetchFn(request, opts)
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

export default class Fetch extends PureComponent {
  constructor(props) {
    super(props)

    const { request, opts } = props
    this.fetch = withFetch(request, opts)(FetchHelper)
  }

  render() {
    return <this.fetch { ...this.props }/>
  }
}
