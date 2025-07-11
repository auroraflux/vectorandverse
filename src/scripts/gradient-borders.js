// Dynamic gradient borders for active elements
document.addEventListener('DOMContentLoaded', () => {
  // Create styles for gradient borders
  const style = document.createElement('style');
  style.textContent = `
    .gradient-border-active {
      position: relative;
      z-index: 1;
    }
    
    .gradient-border-active::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      padding: 2px;
      background: linear-gradient(
        45deg,
        rgba(59, 130, 246, 0.8),
        rgba(251, 146, 60, 0.8),
        rgba(20, 184, 166, 0.8),
        rgba(147, 51, 234, 0.8)
      );
      background-size: 300% 300%;
      animation: gradientShift 3s ease infinite;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    
    .gradient-border-active:hover::before,
    .gradient-border-active:focus::before,
    .gradient-border-active:focus-within::before,
    .gradient-border-active.active::before {
      opacity: 1;
    }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Special styling for links */
    a.gradient-border-active {
      padding: 0.25rem 0.5rem;
      margin: -0.25rem -0.5rem;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }
    
    a.gradient-border-active:hover {
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
  
  // Elements to apply gradient borders to
  const selectors = [
    'a[href]:not(.no-underline):not(.gradient-border-active)', // Links (except those with no-underline)
    'button:not(.gradient-border-active)', // Buttons
    'input:not([type="hidden"]):not(.gradient-border-active)', // Input fields
    'textarea:not(.gradient-border-active)', // Textareas
    'select:not(.gradient-border-active)', // Select dropdowns
    '[role="button"]:not(.gradient-border-active)', // Elements with button role
    '[tabindex]:not([tabindex="-1"]):not(.gradient-border-active)' // Focusable elements
  ];
  
  // Apply gradient border class to interactive elements
  const applyGradientBorders = () => {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Don't apply to article cards or main navigation elements
        if (!element.closest('article > a') && !element.closest('header')) {
          element.classList.add('gradient-border-active');
        }
      });
    });
  };
  
  // Apply on initial load
  applyGradientBorders();
  
  // Reapply when new content is added (for dynamic content)
  const observer = new MutationObserver(() => {
    applyGradientBorders();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Add active state to currently focused element
  document.addEventListener('focusin', (e) => {
    const element = e.target;
    if (element.classList.contains('gradient-border-active')) {
      element.classList.add('active');
    }
  });
  
  document.addEventListener('focusout', (e) => {
    const element = e.target;
    if (element.classList.contains('gradient-border-active')) {
      element.classList.remove('active');
    }
  });
});