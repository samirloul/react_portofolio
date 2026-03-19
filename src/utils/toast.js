// Utility voor toast notifications
export const showToast = (message, type = 'success', duration = 3000) => {
  // Maak container als die niet bestaat
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Maak toast element
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  
  toast.style.cssText = `
    background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
    font-family: system-ui, -apple-system;
    max-width: 350px;
    pointer-events: auto;
  `;
  
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export const copyToClipboard = (text, message = 'Copied!') => {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message, 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
};
