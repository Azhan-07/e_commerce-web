import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              An unexpected error occurred. Please try again.
            </p>
            <Link to="/" className="btn-primary inline-block" onClick={() => this.setState({ hasError: false })}>
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
