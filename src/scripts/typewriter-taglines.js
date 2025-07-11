// Simple tagline rotation with typewriter effect
(function initializeTypewriter() {
  // Clean up any existing animations
  if (window.typewriterCleanup) {
    window.typewriterCleanup();
  }
  
  // Store cleanup function globally
  let typeInterval = null;
  let eraseInterval = null;
  let timeouts = [];
  
  window.typewriterCleanup = function() {
    if (typeInterval) clearInterval(typeInterval);
    if (eraseInterval) clearInterval(eraseInterval);
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
  };
  const taglines = [
    "git commit -m 'still believing'",
    "segfault optimism since 2024",
    "try { hope() } catch { blog() }",
    "npm install faith --save-dev",
    "sudo make me believe",
    "undefined is not a feeling",
    "console.log('everything is fine')",
    "AI won't replace my anxiety",
    "docker run -it hope:latest",
    "// TODO: fix everything",
    "merge conflicts with reality",
    "stack overflow but make it poetry",
    "kubernetes for my emotions",
    "cached optimism (expires: never)",
    "rm -rf doubts 2>/dev/null",
    "404: pessimism not found",
    "debugging life in production",
    "ctrl+z doesn't work here",
    "async/await the apocalypse",
    "<div class='silver-lining' />"
  ];
  
  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Shuffle taglines on page load
  const shuffledTaglines = shuffleArray(taglines);
  
  const containerElement = document.getElementById('tagline-container');
  
  if (!containerElement) return;
  
  let currentTaglineIndex = 0;
  let isTyping = false;
  
  function updateDisplay(text, showCursor = true) {
    if (showCursor) {
      containerElement.innerHTML = `<span>${text}</span><span class="tagline-cursor text-gray-400">│</span>`;
    } else {
      containerElement.innerHTML = `<span>${text}</span>`;
    }
  }
  
  function typeTagline() {
    const tagline = shuffledTaglines[currentTaglineIndex];
    let charIndex = 0;
    isTyping = true;
    
    // Clear and show cursor
    updateDisplay('');
    
    // Type out the tagline
    typeInterval = setInterval(() => {
      if (charIndex < tagline.length) {
        updateDisplay(tagline.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        isTyping = false;
        
        // Wait before erasing
        const timeout = setTimeout(() => {
          eraseTagline();
        }, 3000); // Display for 3 seconds
        timeouts.push(timeout);
      }
    }, 70); // Type speed
  }
  
  function eraseTagline() {
    let text = shuffledTaglines[currentTaglineIndex];
    let charIndex = text.length;
    isTyping = true;
    
    eraseInterval = setInterval(() => {
      if (charIndex > 0) {
        charIndex--;
        updateDisplay(text.substring(0, charIndex));
      } else {
        clearInterval(eraseInterval);
        isTyping = false;
        
        // Move to next tagline
        currentTaglineIndex = (currentTaglineIndex + 1) % shuffledTaglines.length;
        
        // Small pause before typing next
        const timeout = setTimeout(() => {
          typeTagline();
        }, 500);
        timeouts.push(timeout);
      }
    }, 50); // Erase speed (faster than typing)
  }
  
  // Start the animation
  typeTagline();
})();