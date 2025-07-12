/**
 * @module kilowhat/lib/utils/events
 * @description Event handling utilities with automatic cleanup.
 * 
 * This module provides utilities for managing DOM events with automatic cleanup,
 * preventing memory leaks and ensuring proper resource management.
 */

/**
 * Event listener options with cleanup.
 * @internal
 */
interface EventListenerWithCleanup {
  element: EventTarget;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

/**
 * Managed event listeners for automatic cleanup.
 * 
 * EventManager tracks all event listeners and provides automatic cleanup
 * to prevent memory leaks. Use this for components that add multiple listeners.
 * 
 * @example
 * ```typescript
 * class MyComponent {
 *   private events = new EventManager();
 *   
 *   mount() {
 *     this.events.on(window, 'resize', this.handleResize);
 *     this.events.on(button, 'click', this.handleClick);
 *   }
 *   
 *   destroy() {
 *     this.events.cleanup(); // Removes all listeners
 *   }
 * }
 * ```
 */
export class EventManager {
  private listeners: EventListenerWithCleanup[] = [];

  /**
   * Add event listener with automatic cleanup tracking.
   * 
   * @param {EventTarget} element - Target element
   * @param {string} event - Event name
   * @param {EventListener} handler - Event handler function
   * @param {AddEventListenerOptions} [options] - Event listener options
   * @returns {() => void} Cleanup function to remove this specific listener
   */
  on<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): () => void;
  on(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): () => void;
  on(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): () => void {
    element.addEventListener(event, handler, options);
    
    const listener: EventListenerWithCleanup = { element, event, handler, options };
    this.listeners.push(listener);
    
    // Return cleanup function
    return () => this.off(element, event, handler, options);
  }

  /**
   * Remove specific event listener.
   * 
   * @param {EventTarget} element - Target element
   * @param {string} event - Event name
   * @param {EventListener} handler - Event handler function
   * @param {AddEventListenerOptions} [options] - Event listener options
   */
  off(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.removeEventListener(event, handler, options);
    
    // Remove from tracked listeners
    this.listeners = this.listeners.filter(
      l => !(l.element === element && l.event === event && l.handler === handler)
    );
  }

  /**
   * Remove all tracked event listeners.
   * 
   * Call this in component cleanup/destroy methods to prevent memory leaks.
   */
  cleanup(): void {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners = [];
  }

  /**
   * Get count of active listeners.
   * 
   * Useful for debugging and testing cleanup.
   * 
   * @returns {number} Number of active event listeners
   */
  get activeListeners(): number {
    return this.listeners.length;
  }
}

/**
 * Debounce function execution.
 * 
 * Delays function execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @template T - Function type
 * @param {T} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {(...args: Parameters<T>) => void} Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSave = debounce(saveData, 500);
 * input.addEventListener('input', debouncedSave);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;
  
  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, delay);
  };
}

/**
 * Throttle function execution.
 * 
 * Ensures function is called at most once per specified time period.
 * Useful for scroll and resize handlers.
 * 
 * @template T - Function type
 * @param {T} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {(...args: Parameters<T>) => void} Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  
  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs !== null) {
          throttled(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Create a one-time event listener.
 * 
 * Automatically removes the listener after first invocation.
 * 
 * @param {EventTarget} element - Target element
 * @param {string} event - Event name
 * @param {EventListener} handler - Event handler
 * @returns {() => void} Cleanup function
 * 
 * @example
 * ```typescript
 * once(video, 'loadeddata', () => {
 *   console.log('Video loaded');
 * });
 * ```
 */
export function once<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void
): () => void;
export function once(
  element: EventTarget,
  event: string,
  handler: EventListener
): () => void;
export function once(
  element: EventTarget,
  event: string,
  handler: EventListener
): () => void {
  const onceHandler = (e: Event) => {
    handler(e);
    element.removeEventListener(event, onceHandler);
  };
  
  element.addEventListener(event, onceHandler);
  
  // Return cleanup function
  return () => element.removeEventListener(event, onceHandler);
}

/**
 * Delegate event handling to a parent element.
 * 
 * Efficient event handling for dynamic elements using event delegation.
 * 
 * @param {HTMLElement} parent - Parent element
 * @param {string} selector - CSS selector for target elements
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {() => void} Cleanup function
 * 
 * @example
 * ```typescript
 * delegate(document.body, '.btn', 'click', (e, target) => {
 *   console.log('Button clicked:', target.textContent);
 * });
 * ```
 */
export function delegate<K extends keyof HTMLElementEventMap>(
  parent: HTMLElement,
  selector: string,
  event: K,
  handler: (ev: HTMLElementEventMap[K], target: HTMLElement) => void
): () => void;
export function delegate(
  parent: HTMLElement,
  selector: string,
  event: string,
  handler: (ev: Event, target: HTMLElement) => void
): () => void;
export function delegate(
  parent: HTMLElement,
  selector: string,
  event: string,
  handler: (ev: Event, target: HTMLElement) => void
): () => void {
  const delegatedHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    const matchedElement = target.closest(selector) as HTMLElement;
    
    if (matchedElement && parent.contains(matchedElement)) {
      handler(e, matchedElement);
    }
  };
  
  parent.addEventListener(event, delegatedHandler);
  
  // Return cleanup function
  return () => parent.removeEventListener(event, delegatedHandler);
}

/**
 * Create and dispatch custom event with data.
 * 
 * @template T - Type of event detail
 * @param {EventTarget} element - Target element
 * @param {string} eventName - Custom event name
 * @param {T} [detail] - Event detail data
 * @param {EventInit} [options] - Additional event options
 * @returns {boolean} False if event was cancelled
 * 
 * @example
 * ```typescript
 * emit(element, 'user-login', { userId: 123 });
 * ```
 */
export function emit<T = any>(
  element: EventTarget,
  eventName: string,
  detail?: T,
  options?: EventInit
): boolean {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true,
    ...options
  });
  
  return element.dispatchEvent(event);
}

/**
 * Wait for event to occur.
 * 
 * Returns a promise that resolves when the specified event fires.
 * 
 * @param {EventTarget} element - Target element
 * @param {string} event - Event name
 * @param {number} [timeout] - Optional timeout in milliseconds
 * @returns {Promise<Event>} Promise that resolves with the event
 * @throws {Error} If timeout is specified and exceeded
 * 
 * @example
 * ```typescript
 * try {
 *   const event = await waitForEvent(img, 'load', 5000);
 *   console.log('Image loaded');
 * } catch (e) {
 *   console.error('Image load timeout');
 * }
 * ```
 */
export function waitForEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  timeout?: number
): Promise<HTMLElementEventMap[K]>;
export function waitForEvent(
  element: EventTarget,
  event: string,
  timeout?: number
): Promise<Event>;
export function waitForEvent(
  element: EventTarget,
  event: string,
  timeout?: number
): Promise<Event> {
  return new Promise((resolve, reject) => {
    let timeoutId: number | undefined;
    
    const handler = (e: Event) => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      element.removeEventListener(event, handler);
      resolve(e);
    };
    
    element.addEventListener(event, handler, { once: true });
    
    if (timeout) {
      timeoutId = window.setTimeout(() => {
        element.removeEventListener(event, handler);
        reject(new Error(`Event ${event} timed out after ${timeout}ms`));
      }, timeout);
    }
  });
}