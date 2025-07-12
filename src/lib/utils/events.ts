/**
 * Event handling utilities with automatic cleanup
 */

/**
 * Event listener options with cleanup
 */
interface EventListenerWithCleanup {
  element: EventTarget;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

/**
 * Managed event listeners for automatic cleanup
 */
export class EventManager {
  private listeners: EventListenerWithCleanup[] = [];

  /**
   * Add event listener with automatic cleanup tracking
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
   * Remove specific event listener
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
   * Remove all tracked event listeners
   */
  cleanup(): void {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners = [];
  }

  /**
   * Get count of active listeners
   */
  get activeListeners(): number {
    return this.listeners.length;
  }
}

/**
 * Debounce function execution
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
 * Throttle function execution
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
 * Create a one-time event listener
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
 * Delegate event handling to a parent element
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
 * Create custom event with data
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
 * Wait for event to occur
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