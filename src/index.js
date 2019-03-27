import React, { PureComponent } from 'react'

export const withFetch = (request, opts) => (Component) =>
  class withFetch extends Component {
    static defaultProps = {
      fetchFn: window.fetch || global.fetch,
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
      return <Component { ...this.props } { ...this.state } />;
    }
  }

class FetchHelper extends PureComponent {
  static defaultProps = {
    onData: () => null,
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

    let children = null

    if (!fetchResponse && !fetchError) {
      children = onLoading()
    } else if (fetchError) {
      children = onError(fetchError)
    } else if (fetchResponse) {
      try {
        children = onData(fetchResponse)
      } catch (error) {
        children = onError(error)
      }
    }

    return <div>{children}</div>
  }
}

export default class Fetch extends PureComponent {
  render() {
    const { request, opts } = this.props
    const HelperInstance = withFetch(request, opts)(FetchHelper)
    return <HelperInstance { ...this.props }/>
  }
}
