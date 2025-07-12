/**
 * TouchLightbox component with touch gestures support
 */

import { BaseComponent, BaseComponentOptions } from './BaseComponent';
import { delegate } from '../utils/events';

/**
 * Touch state interface for tracking gestures
 */
interface TouchState {
  startX: number;
  startY: number;
  startDistance?: number;
  currentScale: number;
  currentX: number;
  currentY: number;
  velocityY: number;
  lastY: number;
  lastTime: number;
}

/**
 * Options for TouchLightbox
 */
export interface TouchLightboxOptions extends BaseComponentOptions {
  swipeThreshold?: number; // Percentage of screen height (0-1)
  velocityThreshold?: number; // Pixels per millisecond
  maxZoom?: number;
  minZoom?: number;
  animationDuration?: number; // ms
}

/**
 * TouchLightbox component for displaying images with touch support
 */
export class TouchLightbox extends BaseComponent<HTMLDivElement> {
  private lightboxClose: HTMLButtonElement | null = null;
  private lightboxContainer: HTMLDivElement | null = null;
  private lightboxImage: HTMLImageElement | null = null;
  private lightboxLoading: HTMLDivElement | null = null;
  
  private touchState: TouchState | null = null;
  private animationFrame: number | null = null;
  private currentImageElement: HTMLElement | null = null;
  
  // Override options property with TouchLightbox-specific type
  protected options: TouchLightboxOptions;
  
  constructor(element: HTMLDivElement, options: TouchLightboxOptions = {}) {
    const defaultOptions: TouchLightboxOptions = {
      autoInit: true,
      swipeThreshold: 0.15,
      velocityThreshold: 0.5,
      maxZoom: 3,
      minZoom: 0.5,
      animationDuration: 300
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    super(element, mergedOptions);
    
    // Store the full options with TouchLightbox-specific properties
    this.options = mergedOptions;
  }
  
  /**
   * Mount the component
   */
  protected mount(): void {
    // Cache DOM elements
    this.lightboxClose = this.element.querySelector('.lightbox-close');
    this.lightboxContainer = this.element.querySelector('.lightbox-container');
    this.lightboxImage = this.element.querySelector('.lightbox-image');
    this.lightboxLoading = this.element.querySelector('.lightbox-loading');
    
    if (!this.lightboxImage || !this.lightboxContainer) {
      throw new Error('TouchLightbox: Required elements not found');
    }
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  /**
   * Setup all event listeners
   */
  private setupEventListeners(): void {
    // Delegate click events for images with data-lightbox="true"
    this.events.on(document, 'click', (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Handle image clicks
      if (target.tagName === 'IMG' && target.dataset.lightbox === 'true') {
        e.preventDefault();
        this.open(target);
        return;
      }
      
      // Handle close button clicks
      if (target.closest('.lightbox-close')) {
        e.preventDefault();
        this.close();
        return;
      }
      
      // Handle backdrop clicks
      if (target === this.element || target === this.lightboxContainer) {
        this.close();
      }
    });
    
    // Keyboard events
    this.events.on(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
    
    // Touch events
    this.events.on(this.element, 'touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.events.on(this.element, 'touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.events.on(this.element, 'touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Prevent default zoom on double tap
    this.events.on(this.element, 'touchstart', (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });
  }
  
  /**
   * Handle touch start event
   */
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      // Single touch - prepare for swipe
      const touch = e.touches[0];
      this.touchState = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentScale: 1,
        currentX: 0,
        currentY: 0,
        velocityY: 0,
        lastY: touch.clientY,
        lastTime: Date.now()
      };
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      e.preventDefault();
      const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
      if (this.touchState) {
        this.touchState.startDistance = distance;
      }
    }
  }
  
  /**
   * Handle touch move event
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!this.touchState || !this.lightboxImage) return;
    
    if (e.touches.length === 1 && this.touchState.currentScale === 1) {
      // Single touch swipe when not zoomed
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchState.startX;
      const deltaY = touch.clientY - this.touchState.startY;
      
      // Calculate velocity for momentum
      const now = Date.now();
      const timeDelta = now - this.touchState.lastTime;
      if (timeDelta > 0) {
        this.touchState.velocityY = (touch.clientY - this.touchState.lastY) / timeDelta;
      }
      this.touchState.lastY = touch.clientY;
      this.touchState.lastTime = now;
      
      // Only allow vertical swipe when not zoomed
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        e.preventDefault();
        this.touchState.currentY = deltaY;
        
        // Apply transform with resistance at edges
        const resistance = Math.abs(deltaY) / window.innerHeight;
        const scale = 1 - Math.min(resistance * 0.3, 0.3);
        const opacity = 1 - Math.min(resistance * 0.5, 0.5);
        
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationFrame = requestAnimationFrame(() => {
          if (this.lightboxImage) {
            this.lightboxImage.style.transform = `translateY(${deltaY}px) scale(${scale})`;
          }
          this.element.style.opacity = String(opacity);
        });
      }
    } else if (e.touches.length === 2 && this.touchState.startDistance) {
      // Pinch zoom
      e.preventDefault();
      const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
      const scale = distance / this.touchState.startDistance;
      this.touchState.currentScale = Math.min(
        Math.max(scale, this.options.minZoom!),
        this.options.maxZoom!
      );
      
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      
      this.animationFrame = requestAnimationFrame(() => {
        if (this.lightboxImage && this.touchState) {
          this.lightboxImage.style.transform = `scale(${this.touchState.currentScale})`;
        }
      });
    }
  }
  
  /**
   * Handle touch end event
   */
  private handleTouchEnd(e: TouchEvent): void {
    if (!this.touchState || !this.lightboxImage) return;
    
    // Check if swipe to close
    const threshold = window.innerHeight * this.options.swipeThreshold!;
    const velocityThreshold = this.options.velocityThreshold!;
    
    if (this.touchState.currentScale === 1 && 
        (Math.abs(this.touchState.currentY) > threshold || 
         Math.abs(this.touchState.velocityY) > velocityThreshold)) {
      // Close lightbox with swipe
      this.close();
    } else {
      // Reset position
      this.lightboxImage.style.transform = `scale(${this.touchState.currentScale})`;
      this.element.style.opacity = '1';
    }
    
    this.touchState = null;
  }
  
  /**
   * Calculate distance between two touch points
   */
  private getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Open lightbox with an image
   */
  open(img: HTMLElement): void {
    // Handle both camelCase and hyphenated attribute names
    const fullSrc = img.dataset.fullSrc || img.getAttribute('data-full-src');
    if (!fullSrc || !this.lightboxImage) return;
    
    this.currentImageElement = img;
    
    // Show loading state
    this.element.classList.add('loading');
    
    // Load image
    const tempImg = new Image();
    tempImg.onload = () => {
      if (this.lightboxImage) {
        this.lightboxImage.src = fullSrc;
        this.lightboxImage.alt = img.getAttribute('alt') || 'Click to close enlarged image';
        this.element.classList.remove('loading');
      }
    };
    tempImg.onerror = () => {
      console.error('Failed to load image:', fullSrc);
      this.element.classList.remove('loading');
      this.close();
    };
    tempImg.src = fullSrc;
    
    // Show lightbox
    requestAnimationFrame(() => {
      this.element.classList.add('active');
      this.element.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      
      // Focus close button for accessibility
      this.lightboxClose?.focus();
      
      // Announce to screen readers
      this.announceToScreenReader('Image lightbox opened. Press Escape to close.');
    });
  }
  
  /**
   * Close the lightbox
   */
  close(): void {
    // Cancel any pending animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Animate out
    this.element.style.transition = `opacity ${this.options.animationDuration}ms ease`;
    this.element.classList.remove('active');
    this.element.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    
    // Reset transforms
    if (this.lightboxImage) {
      this.lightboxImage.style.transform = '';
    }
    this.element.style.opacity = '';
    
    // Clear image source after transition
    setTimeout(() => {
      if (this.lightboxImage) {
        this.lightboxImage.src = '';
      }
      this.element.classList.remove('loading');
      this.currentImageElement = null;
    }, this.options.animationDuration);
    
    // Announce to screen readers
    this.announceToScreenReader('Image lightbox closed.');
  }
  
  /**
   * Check if lightbox is open
   */
  isOpen(): boolean {
    return this.element.classList.contains('active');
  }
  
  /**
   * Announce message to screen readers
   */
  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  /**
   * Cleanup on unmount
   */
  protected unmount(): void {
    // Cancel any pending animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Close if open
    if (this.isOpen()) {
      this.close();
    }
    
    // Reset state
    this.touchState = null;
    this.currentImageElement = null;
  }
  
  /**
   * Static factory method
   */
  static create(element: HTMLElement, options?: BaseComponentOptions): TouchLightbox {
    if (!(element instanceof HTMLDivElement)) {
      throw new Error('TouchLightbox requires an HTMLDivElement');
    }
    return new TouchLightbox(element, options as TouchLightboxOptions);
  }
  
  /**
   * Auto-initialize lightboxes
   */
  static autoInit(selector: string = '#lightbox', options?: TouchLightboxOptions): TouchLightbox | null {
    const element = document.querySelector(selector) as HTMLDivElement;
    if (!element) {
      console.warn(`TouchLightbox: No element found with selector "${selector}"`);
      return null;
    }
    
    return TouchLightbox.create(element, options);
  }
}