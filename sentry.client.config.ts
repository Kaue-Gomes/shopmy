import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE_BROWSER ?? '0'),
    replaysOnErrorSampleRate: Number(process.env.SENTRY_REPLAY_ERROR_SAMPLE_RATE ?? '0'),
  })
}
