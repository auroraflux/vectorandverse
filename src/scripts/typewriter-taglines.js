// Typewriter effect for rotating taglines
document.addEventListener('DOMContentLoaded', () => {
  const taglines = document.querySelectorAll('.animate-tagline-rotate');
  
  // Add typewriter effect to each tagline
  taglines.forEach((tagline, index) => {
    const text = tagline.querySelector('.typewriter-tagline');
    if (!text) return;
    
    const originalText = text.textContent;
    const chars = originalText.split('');
    
    // Clear the text initially
    text.textContent = '';
    text.style.visibility = 'visible';
    
    // Create a cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor-element';
    cursor.textContent = '│';
    cursor.style.cssText = 'font-weight: 300; animation: blinkCursor 1s step-end infinite; margin-left: 0.1em;';
    text.appendChild(cursor);
    
    // Function to type out the text
    const typeText = () => {
      text.textContent = '';
      text.appendChild(cursor);
      
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < chars.length) {
          // Insert character before cursor
          const char = document.createTextNode(chars[charIndex]);
          text.insertBefore(char, cursor);
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 70); // Type one character every 70ms
    };
    
    // Calculate when this tagline should animate
    const delay = index * 5000; // 5 seconds per tagline
    const cycle = 25000; // Total cycle time (5 taglines * 5s)
    
    // Initial delay
    setTimeout(() => {
      typeText();
      // Then repeat on cycle
      setInterval(typeText, cycle);
    }, delay);
  });
});

// Add CSS for cursor blink if not already present
if (!document.querySelector('#typewriter-cursor-styles')) {
  const style = document.createElement('style');
  style.id = 'typewriter-cursor-styles';
  style.textContent = `
    @keyframes blinkCursor {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}