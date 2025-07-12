/**
 * Base component class for creating reusable UI components
 */

import { EventManager } from '../utils/events';

/**
 * Component lifecycle states
 */
export enum ComponentState {
  CREATED = 'created',
  MOUNTED = 'mounted',
  DESTROYED = 'destroyed'
}

/**
 * Base component options
 */
export interface BaseComponentOptions {
  autoInit?: boolean;
}

/**
 * Abstract base class for components
 */
export abstract class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T;
  protected events: EventManager;
  protected state: ComponentState = ComponentState.CREATED;
  protected options: BaseComponentOptions;

  constructor(element: T, options: BaseComponentOptions = {}) {
    this.element = element;
    this.events = new EventManager();
    this.options = { autoInit: true, ...options };

    if (this.options.autoInit) {
      this.init();
    }
  }

  /**
   * Initialize the component
   */
  protected init(): void {
    if (this.state !== ComponentState.CREATED) {
      console.warn('Component already initialized');
      return;
    }

    this.mount();
    this.state = ComponentState.MOUNTED;
  }

  /**
   * Mount the component (setup event listeners, initial state, etc.)
   * Override this in child classes
   */
  protected abstract mount(): void;

  /**
   * Update component state/view
   * Override this in child classes if needed
   */
  protected update(): void {
    // Default implementation does nothing
  }

  /**
   * Destroy the component and cleanup
   */
  destroy(): void {
    if (this.state === ComponentState.DESTROYED) {
      console.warn('Component already destroyed');
      return;
    }

    this.unmount();
    this.events.cleanup();
    this.state = ComponentState.DESTROYED;
  }

  /**
   * Unmount the component (cleanup before destroy)
   * Override this in child classes if needed
   */
  protected unmount(): void {
    // Default implementation does nothing
  }

  /**
   * Get the current component state
   */
  getState(): ComponentState {
    return this.state;
  }

  /**
   * Check if component is mounted
   */
  isMounted(): boolean {
    return this.state === ComponentState.MOUNTED;
  }

  /**
   * Get the component's root element
   */
  getElement(): T {
    return this.element;
  }

  /**
   * Static factory method to create component instances
   * Override this in child classes
   */
  static create<T extends BaseComponent>(
    element: HTMLElement,
    options?: BaseComponentOptions
  ): T {
    throw new Error('create() must be implemented by child class');
  }

  /**
   * Static method to auto-initialize components on elements
   * Override this in child classes
   */
  static autoInit(selector: string, options?: BaseComponentOptions): void {
    throw new Error('autoInit() must be implemented by child class');
  }
}