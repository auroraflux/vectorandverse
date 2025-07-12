/**
 * @module kilowhat/lib/utils/accessibility
 * @description Accessibility utilities for ARIA live regions and screen reader support.
 * 
 * This module provides utilities for making web applications accessible to users
 * with disabilities, particularly those using screen readers.
 */

/**
 * Create or get an ARIA live region for announcements.
 * 
 * Live regions announce dynamic content changes to screen readers.
 * 
 * @param {string} id - Unique ID for the live region
 * @param {'polite' | 'assertive'} [politeness='polite'] - Announcement priority
 * @returns {HTMLElement} The live region element
 * 
 * @example
 * ```typescript
 * const region = createLiveRegion('notifications', 'polite');
 * region.textContent = 'File saved successfully';
 * ```
 */
export function createLiveRegion(
  id: string,
  politeness: 'polite' | 'assertive' = 'polite'
): HTMLElement {
  let region = document.getElementById(id);
  
  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only'; // Visually hidden but accessible to screen readers
    region.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(region);
  }
  
  return region;
}

/**
 * Announce a message to screen readers.
 * 
 * Creates a live region if needed and announces the message.
 * 
 * @param {string} message - Message to announce
 * @param {'polite' | 'assertive'} [politeness='polite'] - Announcement priority
 * 
 * @example
 * ```typescript
 * announceToScreenReader('Form submitted successfully');
 * announceToScreenReader('Error: Invalid email', 'assertive');
 * ```
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  const regionId = politeness === 'polite' ? 'aria-live-polite' : 'aria-live-assertive';
  const region = createLiveRegion(regionId, politeness);
  
  // Clear and set message for proper announcement
  region.textContent = '';
  
  // Use a timeout to ensure the change is detected by screen readers
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}

/**
 * Clear all live regions.
 * 
 * Removes any pending announcements from live regions.
 */
export function clearLiveRegions(): void {
  const politeRegion = document.getElementById('aria-live-polite');
  const assertiveRegion = document.getElementById('aria-live-assertive');
  
  if (politeRegion) {
    politeRegion.textContent = '';
  }
  
  if (assertiveRegion) {
    assertiveRegion.textContent = '';
  }
}

/**
 * Check if user is using a screen reader (heuristic).
 * 
 * This is a best-effort detection based on common indicators.
 * Not 100% reliable but useful for optimizations.
 * 
 * @returns {boolean} True if screen reader is likely active
 * 
 * @example
 * ```typescript
 * if (!isScreenReaderActive()) {
 *   // Enable visual-only animations
 * }
 * ```
 */
export function isScreenReaderActive(): boolean {
  // This is a heuristic check - not 100% reliable but useful for optimization
  const htmlElement = document.documentElement;
  
  return (
    // Check for common screen reader attributes
    htmlElement.hasAttribute('data-screen-reader-active') ||
    // Check if user prefers reduced motion (often correlated with screen reader use)
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    // Check for NVDA
    document.body.classList.contains('nvda') ||
    // Check for JAWS
    document.body.classList.contains('jaws')
  );
}

/**
 * Set element as described by another element.
 * 
 * Links an element to its description for screen readers.
 * 
 * @param {HTMLElement} element - Element to describe
 * @param {string | null} descriptionId - ID of description element, or null to remove
 * 
 * @example
 * ```typescript
 * setAriaDescribedBy(input, 'password-help');
 * ```
 */
export function setAriaDescribedBy(
  element: HTMLElement,
  descriptionId: string | null
): void {
  if (descriptionId) {
    element.setAttribute('aria-describedby', descriptionId);
  } else {
    element.removeAttribute('aria-describedby');
  }
}

/**
 * Manage focus trap for modal-like components.
 * 
 * Keeps keyboard focus within a container element, essential for
 * accessible modals, dialogs, and overlays.
 * 
 * @example
 * ```typescript
 * const modal = document.getElementById('modal');
 * const trap = new FocusTrap(modal);
 * 
 * // When opening modal
 * trap.activate();
 * 
 * // When closing modal
 * trap.deactivate();
 * ```
 */
export class FocusTrap {
  private element: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private handleKeyDown: (e: KeyboardEvent) => void;
  
  constructor(element: HTMLElement) {
    this.element = element;
    this.handleKeyDown = this.onKeyDown.bind(this);
  }
  
  /**
   * Activate the focus trap.
   * 
   * Stores current focus, moves focus to first focusable element,
   * and starts trapping Tab key navigation.
   */
  activate(): void {
    // Store currently focused element
    this.previouslyFocused = document.activeElement as HTMLElement;
    
    // Find focusable elements
    const focusableElements = this.element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      this.firstFocusable = focusableElements[0];
      this.lastFocusable = focusableElements[focusableElements.length - 1];
      
      // Focus first element
      this.firstFocusable.focus();
      
      // Add keyboard listener
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }
  
  /**
   * Deactivate the focus trap.
   * 
   * Removes key handlers and restores focus to previously focused element.
   */
  deactivate(): void {
    // Remove keyboard listener
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
    
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.previouslyFocused = null;
  }
  
  private onKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    
    if (!this.firstFocusable || !this.lastFocusable) return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }
}