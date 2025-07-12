/**
 * @module kilowhat/lib/utils/dom
 * @description DOM utility functions for safe and efficient DOM manipulation.
 * 
 * This module provides type-safe wrappers around common DOM operations,
 * with built-in XSS prevention and performance optimizations.
 */

/**
 * Safely query a single element with type narrowing.
 * 
 * @template T - The expected element type
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Parent node to search within
 * @returns {T | null} The found element or null
 * 
 * @example
 * ```typescript
 * const button = querySelector<HTMLButtonElement>('.submit-btn');
 * if (button) {
 *   button.disabled = false;
 * }
 * ```
 */
export function querySelector<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Safely query all elements with type narrowing.
 * 
 * @template T - The expected element type
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Parent node to search within
 * @returns {T[]} Array of found elements (never null)
 * 
 * @example
 * ```typescript
 * const images = querySelectorAll<HTMLImageElement>('img[data-lightbox]');
 * images.forEach(img => console.log(img.src));
 * ```
 */
export function querySelectorAll<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Get element by ID with type narrowing.
 * 
 * @template T - The expected element type
 * @param {string} id - Element ID (without #)
 * @returns {T | null} The found element or null
 * 
 * @example
 * ```typescript
 * const canvas = getElementById<HTMLCanvasElement>('myCanvas');
 * ```
 */
export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Check if element exists and is visible.
 * 
 * Checks multiple visibility factors including dimensions, display, visibility, and opacity.
 * 
 * @param {Element | null} element - Element to check
 * @returns {boolean} True if element exists and is visible
 * 
 * @example
 * ```typescript
 * if (isVisible(modal)) {
 *   // Modal is visible, handle accordingly
 * }
 * ```
 */
export function isVisible(element: Element | null): boolean {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

/**
 * Create element with attributes and optional children.
 * 
 * @template K - HTML tag name
 * @param {K} tag - HTML tag name
 * @param {Record<string, string>} [attributes] - Element attributes
 * @param {(Node | string)[]} [children] - Child nodes or text content
 * @returns {HTMLElementTagNameMap[K]} The created element
 * 
 * @example
 * ```typescript
 * const button = createElement('button', 
 *   { class: 'btn btn-primary', type: 'submit' },
 *   ['Click me']
 * );
 * ```
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (children) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Safely set text content (prevents XSS).
 * 
 * Always use this instead of innerHTML when setting text to prevent XSS attacks.
 * 
 * @param {Element} element - Target element
 * @param {string} text - Text content to set
 * 
 * @example
 * ```typescript
 * setTextContent(titleElement, userInput); // Safe from XSS
 * ```
 */
export function setTextContent(element: Element, text: string): void {
  element.textContent = text;
}

/**
 * Add classes to element
 */
export function addClass(element: Element, ...classes: string[]): void {
  element.classList.add(...classes);
}

/**
 * Remove classes from element
 */
export function removeClass(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes);
}

/**
 * Toggle classes on element
 */
export function toggleClass(element: Element, className: string, force?: boolean): boolean {
  return element.classList.toggle(className, force);
}

/**
 * Check if element has class
 */
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Get or set data attribute
 */
export function data(element: HTMLElement, key: string, value?: string): string | undefined {
  if (value !== undefined) {
    element.dataset[key] = value;
    return value;
  }
  return element.dataset[key];
}

/**
 * Wait for DOM to be ready
 */
export function ready(callback: () => void): void {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  }
}

/**
 * Request animation frame with fallback
 */
export function raf(callback: FrameRequestCallback): number {
  return window.requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 */
export function cancelRaf(id: number): void {
  window.cancelAnimationFrame(id);
}

/**
 * Create typewriter display with optional cursor.
 * 
 * Creates a document fragment with text and an optional cursor element.
 * Used by the Typewriter animation component.
 * 
 * @param {string} text - Text to display
 * @param {boolean} [showCursor=true] - Whether to show cursor
 * @returns {DocumentFragment} Fragment containing text and cursor spans
 * 
 * @example
 * ```typescript
 * const display = createTypewriterDisplay('Hello World', true);
 * element.appendChild(display);
 * ```
 */
export function createTypewriterDisplay(text: string, showCursor = true): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  const textSpan = createElement('span', {}, [text]);
  fragment.appendChild(textSpan);
  
  if (showCursor) {
    const cursorSpan = createElement('span', {
      class: 'tagline-cursor text-gray-400'
    }, ['│']);
    fragment.appendChild(cursorSpan);
  }
  
  return fragment;
}

/**
 * Clear all child nodes from element
 */
export function clearElement(element: Element): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Safely replace element's children (alternative to innerHTML).
 * 
 * This prevents XSS attacks by ensuring all content is properly escaped.
 * Use this instead of innerHTML when you need to replace all children.
 * 
 * @param {Element} element - Parent element
 * @param {(Node | string)[]} children - New children (nodes or text)
 * 
 * @example
 * ```typescript
 * // Safe from XSS even with user input
 * setChildren(container, [
 *   createElement('h2', {}, [userTitle]),
 *   userContent // Will be escaped as text
 * ]);
 * ```
 */
export function setChildren(element: Element, children: (Node | string)[]): void {
  clearElement(element);
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
}