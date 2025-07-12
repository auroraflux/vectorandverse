/**
 * Example animation module demonstrating how to use the TypeScript utilities
 */

import { querySelector, addClass, removeClass } from '@utils/dom';
import { EventManager, debounce } from '@utils/events';
import { DURATIONS, EASINGS, getAnimationDuration } from '@config/animation';

/**
 * Example fade animation using the utilities
 */
export class FadeAnimation {
  private element: HTMLElement;
  private events: EventManager;

  constructor(element: HTMLElement) {
    this.element = element;
    this.events = new EventManager();
  }

  /**
   * Fade in the element
   */
  async fadeIn(): Promise<void> {
    const duration = getAnimationDuration(DURATIONS.normal);
    
    // Set initial state
    this.element.style.opacity = '0';
    this.element.style.transition = `opacity ${duration}ms ${EASINGS.smooth}`;
    
    // Force reflow
    this.element.offsetHeight;
    
    // Start animation
    this.element.style.opacity = '1';
    
    // Wait for animation to complete
    if (duration > 0) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }

  /**
   * Fade out the element
   */
  async fadeOut(): Promise<void> {
    const duration = getAnimationDuration(DURATIONS.normal);
    
    this.element.style.transition = `opacity ${duration}ms ${EASINGS.smooth}`;
    this.element.style.opacity = '0';
    
    if (duration > 0) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }

  /**
   * Example of using event manager with debounce
   */
  setupScrollListener(): void {
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      
      if (scrollTop > 100) {
        addClass(this.element, 'scrolled');
      } else {
        removeClass(this.element, 'scrolled');
      }
    }, 50);

    this.events.on(window, 'scroll', handleScroll, { passive: true });
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.events.cleanup();
  }
}

/**
 * Example usage
 */
export function initExampleAnimations(): void {
  const element = querySelector<HTMLElement>('.fade-element');
  
  if (element) {
    const animation = new FadeAnimation(element);
    animation.setupScrollListener();
    
    // Example: fade in on page load
    animation.fadeIn();
  }
}