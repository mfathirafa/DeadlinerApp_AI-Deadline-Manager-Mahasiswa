export function trackEvent(eventName: string, payload: Record<string, any>) {
  const enrichedPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };
  if (process.env.NODE_ENV === 'development') {
    console.log(eventName, enrichedPayload);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('analytics_event', {
        detail: { event: eventName, payload: enrichedPayload },
      })
    );
  }
}
