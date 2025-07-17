import { AppState } from "../components/AppState";
import { EventEmitter } from "../components/base/events";
import { ensureElement } from "../utils/utils";

export class OrderForm {
    protected _element: HTMLElement;
    protected _paymentOnline: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(protected appState: AppState, protected events: EventEmitter) {
        const template = ensureElement<HTMLTemplateElement>('#order');
        this._element = document.importNode(template.content, true).firstElementChild as HTMLElement;

        this._paymentOnline = ensureElement<HTMLButtonElement>('button[name="card"]', this._element);
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this._element);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this._element);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this._element);

        this._paymentOnline.addEventListener('click', () => {
            this.togglePaymentMethod('online');
            this.updateSubmitButton();
        });

        this._paymentCash.addEventListener('click', () => {
            this.togglePaymentMethod('cash');
            this.updateSubmitButton();
        });

        this._addressInput.addEventListener('input', () => {
            this.appState.updateOrder('address', this._addressInput.value);
            this.updateSubmitButton();
        });

        this._element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
    }

    private togglePaymentMethod(method: 'online' | 'cash') {
        this._paymentOnline.classList.toggle('button_alt-active', method === 'online');
        this._paymentCash.classList.toggle('button_alt-active', method === 'cash');
        this.appState.updateOrder('payment', method);
    }

    private updateSubmitButton() {
        const isValid = this._addressInput.value && 
                      (this._paymentOnline.classList.contains('button_alt-active') || 
                       this._paymentCash.classList.contains('button_alt-active'));
        this._submitButton.disabled = !isValid;
    }

    get element(): HTMLElement {
        return this._element;
    }
}