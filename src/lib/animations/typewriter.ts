/**
 * Typewriter animation module with accessibility support
 */

import { TYPEWRITER_TIMINGS, TAGLINES, getAnimationDuration } from '../config/animation';
import { EventManager } from '../utils/events';
import { clearElement, createTypewriterDisplay } from '../utils/dom';
import { announceToScreenReader, isScreenReaderActive } from '../utils/accessibility';

/**
 * Configuration options for the typewriter animation
 */
export interface TypewriterConfig {
  /** The DOM element to render the animation in */
  element: HTMLElement;
  /** Array of phrases to cycle through */
  phrases?: readonly string[];
  /** Speed of typing in milliseconds per character */
  typeSpeed?: number;
  /** Speed of erasing in milliseconds per character */
  eraseSpeed?: number;
  /** How long to display each phrase before erasing */
  displayDuration?: number;
  /** Pause duration between phrases */
  pauseDuration?: number;
  /** Initial delay before starting animation */
  initialDelay?: number;
  /** Whether to announce phrases to screen readers */
  announceToScreenReader?: boolean;
  /** Callback when a phrase is fully typed */
  onPhraseComplete?: (phrase: string, index: number) => void;
  /** Callback when animation completes a full cycle */
  onCycleComplete?: () => void;
}

/**
 * Typewriter animation class with proper cleanup and accessibility
 */
export class Typewriter {
  private element: HTMLElement;
  private phrases: readonly string[];
  private currentIndex = 0;
  private isDestroyed = false;
  private isPaused = false;
  private eventManager = new EventManager();
  private animationFrameId: number | null = null;
  private timeoutIds: number[] = [];
  private config: Required<Omit<TypewriterConfig, 'element' | 'onPhraseComplete' | 'onCycleComplete'>> & {
    onPhraseComplete?: TypewriterConfig['onPhraseComplete'];
    onCycleComplete?: TypewriterConfig['onCycleComplete'];
  };

  constructor(config: TypewriterConfig) {
    this.element = config.element;
    this.phrases = config.phrases || TAGLINES;
    
    // Apply configuration with defaults
    this.config = {
      phrases: this.phrases,
      typeSpeed: config.typeSpeed ?? TYPEWRITER_TIMINGS.TYPE_SPEED_MS,
      eraseSpeed: config.eraseSpeed ?? TYPEWRITER_TIMINGS.ERASE_SPEED_MS,
      displayDuration: config.displayDuration ?? TYPEWRITER_TIMINGS.DISPLAY_DURATION_MS,
      pauseDuration: config.pauseDuration ?? TYPEWRITER_TIMINGS.PAUSE_BETWEEN_MS,
      initialDelay: config.initialDelay ?? TYPEWRITER_TIMINGS.INITIAL_DELAY_MS,
      announceToScreenReader: config.announceToScreenReader ?? true,
      onPhraseComplete: config.onPhraseComplete,
      onCycleComplete: config.onCycleComplete
    };
    
    // Shuffle phrases on initialization
    this.phrases = this.shuffleArray([...this.phrases]);
    
    // Set up ARIA attributes
    this.setupAccessibility();
  }

  /**
   * Set up accessibility attributes
   */
  private setupAccessibility(): void {
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-label', 'Rotating tagline');
    this.element.setAttribute('aria-live', 'polite');
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Update the display with text and optional cursor
   */
  private updateDisplay(text: string, showCursor = true): void {
    if (this.isDestroyed) return;
    
    // Use safe DOM manipulation
    clearElement(this.element);
    const content = createTypewriterDisplay(text, showCursor);
    this.element.appendChild(content);
  }

  /**
   * Type a phrase character by character
   */
  private async typePhrase(phrase: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isDestroyed || this.isPaused) {
        resolve();
        return;
      }

      let charIndex = 0;
      this.updateDisplay('');
      
      const typeNextChar = () => {
        if (this.isDestroyed || this.isPaused) {
          resolve();
          return;
        }
        
        if (charIndex < phrase.length) {
          this.updateDisplay(phrase.substring(0, charIndex + 1));
          charIndex++;
          
          const delay = getAnimationDuration(this.config.typeSpeed);
          if (delay > 0) {
            const timeoutId = window.setTimeout(typeNextChar, delay);
            this.timeoutIds.push(timeoutId);
          } else {
            // If animations are disabled, type the whole phrase at once
            this.updateDisplay(phrase);
            charIndex = phrase.length;
            resolve();
          }
        } else {
          // Phrase complete
          if (this.config.announceToScreenReader && !isScreenReaderActive()) {
            announceToScreenReader(`Tagline: ${phrase}`, 'polite');
          }
          
          this.config.onPhraseComplete?.(phrase, this.currentIndex);
          resolve();
        }
      };
      
      typeNextChar();
    });
  }

  /**
   * Erase a phrase character by character
   */
  private async erasePhrase(phrase: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isDestroyed || this.isPaused) {
        resolve();
        return;
      }

      let charIndex = phrase.length;
      
      const eraseNextChar = () => {
        if (this.isDestroyed || this.isPaused) {
          resolve();
          return;
        }
        
        if (charIndex > 0) {
          charIndex--;
          this.updateDisplay(phrase.substring(0, charIndex));
          
          const delay = getAnimationDuration(this.config.eraseSpeed);
          if (delay > 0) {
            const timeoutId = window.setTimeout(eraseNextChar, delay);
            this.timeoutIds.push(timeoutId);
          } else {
            // If animations are disabled, clear immediately
            this.updateDisplay('');
            resolve();
          }
        } else {
          resolve();
        }
      };
      
      eraseNextChar();
    });
  }

  /**
   * Sleep for a specified duration
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const duration = getAnimationDuration(ms);
      if (duration > 0) {
        const timeoutId = window.setTimeout(resolve, duration);
        this.timeoutIds.push(timeoutId);
      } else {
        resolve();
      }
    });
  }

  /**
   * Start the typewriter animation
   */
  async start(): Promise<void> {
    if (this.isDestroyed) return;
    
    this.isPaused = false;
    
    // Initial delay
    await this.sleep(this.config.initialDelay);
    
    while (!this.isDestroyed && !this.isPaused) {
      const phrase = this.phrases[this.currentIndex];
      
      // Type the phrase
      await this.typePhrase(phrase);
      
      // Display the phrase
      await this.sleep(this.config.displayDuration);
      
      // Erase the phrase
      await this.erasePhrase(phrase);
      
      // Pause between phrases
      await this.sleep(this.config.pauseDuration);
      
      // Move to next phrase
      this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
      
      // Notify when we've completed a full cycle
      if (this.currentIndex === 0) {
        this.config.onCycleComplete?.();
      }
    }
  }

  /**
   * Pause the animation
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume the animation
   */
  resume(): void {
    if (this.isPaused && !this.isDestroyed) {
      this.isPaused = false;
      this.start();
    }
  }

  /**
   * Stop and reset the animation
   */
  stop(): void {
    this.isPaused = true;
    this.currentIndex = 0;
    this.updateDisplay('', false);
  }

  /**
   * Destroy the typewriter and clean up resources
   */
  destroy(): void {
    this.isDestroyed = true;
    this.isPaused = true;
    
    // Clear all timeouts
    this.timeoutIds.forEach(id => window.clearTimeout(id));
    this.timeoutIds = [];
    
    // Cancel animation frame if any
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Clean up event listeners
    this.eventManager.cleanup();
    
    // Clear the display
    clearElement(this.element);
    
    // Remove ARIA attributes
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-label');
    this.element.removeAttribute('aria-live');
  }

  /**
   * Get current animation state
   */
  getState(): {
    currentPhrase: string;
    currentIndex: number;
    isPlaying: boolean;
    isPaused: boolean;
  } {
    return {
      currentPhrase: this.phrases[this.currentIndex],
      currentIndex: this.currentIndex,
      isPlaying: !this.isDestroyed && !this.isPaused,
      isPaused: this.isPaused
    };
  }
}