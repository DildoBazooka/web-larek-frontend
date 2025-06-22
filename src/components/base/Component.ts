export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {
    }

	changeClassState(
        element: HTMLElement, 
        className: string, 
        state?: boolean
	): void {
	  element.classList.toggle(className, state);
	}

	changeDisabledState(element: HTMLElement, isDisabled: boolean): void {
	  if (!element) return;
	  
	  isDisabled 
		? element.setAttribute('disabled', 'true') 
		: element.removeAttribute('disabled');
	}

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}