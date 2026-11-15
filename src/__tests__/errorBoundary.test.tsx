import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    const boundary = new ErrorBoundary({
      children: React.createElement('div', { id: 'safe-child' }, 'Nội dung an toàn'),
    });
    expect(boundary.state.hasError).toBe(false);
    const html = renderToString(boundary.render() as React.ReactElement);
    expect(html).toContain('Nội dung an toàn');
    expect(html).not.toContain('Đã xảy ra lỗi ngoài ý muốn');
  });

  it('updates state to hasError=true when getDerivedStateFromError is called', () => {
    const testError = new Error('Lỗi render giả lập');
    const newState = ErrorBoundary.getDerivedStateFromError(testError);
    expect(newState.hasError).toBe(true);
    expect(newState.error).toBe(testError);
  });

  it('logs error and invokes onError in componentDidCatch', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onErrorSpy = vi.fn();
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Child'),
      onError: onErrorSpy,
    });

    const testError = new Error('Lỗi tải chunk component');
    const info = { componentStack: '\n    in LazyComponent\n    in Suspense' };

    boundary.componentDidCatch(testError, info);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      testError,
      info.componentStack
    );
    expect(onErrorSpy).toHaveBeenCalledWith(testError, info);

    consoleErrorSpy.mockRestore();
  });

  it('renders fallback UI with "Tải lại trang" when a child throws an error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boundary = new ErrorBoundary({
      children: React.createElement(() => {
        throw new Error('Cố ý gây lỗi kết xuất trong component con');
      }),
    });

    // Simulate child component throwing an error during lifecycle
    const childError = new Error('Cố ý gây lỗi kết xuất trong component con');
    boundary.state = ErrorBoundary.getDerivedStateFromError(childError);
    boundary.componentDidCatch(childError, { componentStack: '\n    in BombComponent' });

    const fallbackHtml = renderToString(boundary.render() as React.ReactElement);

    // Verify fallback UI contents as required by spec
    expect(fallbackHtml).toContain('Đã xảy ra lỗi ngoài ý muốn');
    expect(fallbackHtml).toContain('Tải lại trang');
    expect(fallbackHtml).toContain('Về trang chủ');
    expect(fallbackHtml).toContain('UniPath 2.0');
    consoleSpy.mockRestore();
  });

  it('renders custom fallback if provided via prop', () => {
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Child'),
      fallback: React.createElement('div', { id: 'custom-fallback' }, 'Custom Error Screen'),
    });
    boundary.state = { hasError: true, error: new Error('boom') };
    const html = renderToString(boundary.render() as React.ReactElement);
    expect(html).toContain('Custom Error Screen');
  });
});
