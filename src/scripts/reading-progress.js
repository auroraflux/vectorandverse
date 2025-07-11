// Reading progress indicator for articles
document.addEventListener('DOMContentLoaded', () => {
  // Only run on article pages
  const article = document.querySelector('article');
  if (!article) return;
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(59, 130, 246, 0.9) 0%, 
      rgba(251, 146, 60, 0.9) 33%, 
      rgba(20, 184, 166, 0.9) 66%,
      rgba(147, 51, 234, 0.9) 100%
    );
    z-index: 100;
    transition: width 0.2s ease-out;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
  `;
  document.body.appendChild(progressBar);
  
  // Calculate progress on scroll
  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Account for the fact that you can't scroll past documentHeight - windowHeight
    const scrollableHeight = documentHeight - windowHeight;
    const progress = (scrollTop / scrollableHeight) * 100;
    
    // Update progress bar width
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  
  // Throttle scroll events for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateProgress);
  
  // Initial update
  updateProgress();
});