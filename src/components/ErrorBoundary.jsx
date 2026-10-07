import { Component } from 'react';
import { ErrorState } from './States.jsx';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <ErrorState onRetry={() => { this.setState({ failed: false }); this.props.onRetry?.(); }} />
      : this.props.children;
  }
}
