import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo?.componentStack);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Warning Icon Badge */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                marginBottom: '20px',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            {/* Brand Title */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#4F46E5',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              UniPath 2.0
            </div>

            {/* Error Heading */}
            <h1
              style={{
                margin: '0 0 10px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.3,
              }}
            >
              Đã xảy ra lỗi ngoài ý muốn
            </h1>

            {/* Short Description */}
            <p
              style={{
                margin: '0 0 24px',
                fontSize: '14px',
                color: '#64748B',
                lineHeight: 1.5,
              }}
            >
              Hệ thống đã ghi nhận sự cố gián đoạn khi kết xuất giao diện. Bạn có thể tải lại trang hoặc quay về trang chủ để tiếp tục trải nghiệm.
            </p>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <RefreshCw size={16} />
                Tải lại trang
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Home size={16} />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
