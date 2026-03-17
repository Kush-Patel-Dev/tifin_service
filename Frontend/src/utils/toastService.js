// Simple toast service that dispatches a global event to show toasts
export function showToast(type, message) {
  const event = new CustomEvent('tifin-toast', {
    detail: { type, message },
  });
  window.dispatchEvent(event);
}
