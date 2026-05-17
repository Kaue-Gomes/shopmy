const PULSE_EVENT = 'shopmy:cart-icon-pulse'

export function emitCartIconPulse(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(PULSE_EVENT))
}

export { PULSE_EVENT }
