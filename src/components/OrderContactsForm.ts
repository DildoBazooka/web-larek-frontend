import { AppState } from "../components/AppState";
import { EventEmitter } from "../components/base/events";
import { ensureElement } from "../utils/utils";

export class OrderContactsForm {
    protected _element: HTMLElement;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(protected appState: AppState, protected events: EventEmitter) {
        const template = ensureElement<HTMLTemplateElement>('#contacts');
        this._element = document.importNode(template.content, true).firstElementChild as HTMLElement;

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this._element);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this._element);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this._element);

        this._submitButton.disabled = true;

        this._emailInput.addEventListener('input', () => {
            this.checkFields();
        });

        this._phoneInput.addEventListener('input', () => {
            this.checkFields();
        });

        this._element.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._submitButton.disabled) return;
            
            this.appState.updateOrder('email', this._emailInput.value);
            this.appState.updateOrder('phone', this._phoneInput.value);
            this.events.emit('contacts:confirmed');
        });
    }

    private checkFields(): void {
        const emailValid = /^\S+@\S+\.\S+$/.test(this._emailInput.value);
        const phoneValid = /^\+?\d{10,}$/.test(this._phoneInput.value);
        this._submitButton.disabled = !(emailValid && phoneValid);
    }

    get element(): HTMLElement {
        return this._element;
    }
}