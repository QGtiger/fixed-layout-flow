import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import * as Sentry from '@sentry/react';

console.log('开启异常监控');

Sentry.init({
  dsn: window.YD.SENTRY_DNS || 'https://cae77df9196c44cbbe1bdfb762583c51@sentry.winrobot360.com/8',
  tracesSampleRate: 1.0,
  beforeSend(event) {
    if (event.exception) {
      console.log('beforeSend', event);
      if (window.YD.ENABLE_REPORT) {
        const reportUrl = window.YD.REPORT_URL ? `${window.YD.REPORT_URL}/report-api` : '/report-api';
        fetch(reportUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'no-report': 'true'
          },
          body: JSON.stringify({
            level: 'error',
            span: 'webException',
            uuid: localStorage.getItem('uuid') || '',
            user: localStorage.getItem('user') || '',
            userName: localStorage.getItem('userName') || '',
            enterpriseName: localStorage.getItem('enterpriseName') || '',
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            search: window.location?.search || '',
            webExceptionType: event.exception?.values[0]?.type || '',
            webExceptionMsg: event.exception?.values[0]?.value || '',
            exception: JSON.stringify({
              url: event.request.url,
              ...event.exception?.values[0]
            })
          })
        });
      }
      return null;
    }
    return event;
  }
});

export const YDErrorBoundary = () => {
  const error = useRouteError() as Error;
  error.message;
  error.name, error.stack;
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h1>页面出错了</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
      <pre>{error.name}</pre>
    </div>
  );
};
