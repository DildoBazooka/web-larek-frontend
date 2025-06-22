import { BasketItem } from './BasketItem';
import { IEvents } from '../components/base/events';

export class Basket {
    private listElement: HTMLElement;
    private totalPriceEl: HTMLElement;
    private orderButton: HTMLButtonElement;
    private element: HTMLElement;
    private events: IEvents;

    constructor(template: string | HTMLTemplateElement, events: IEvents) {
        this.events = events;
        const tpl = typeof template === 'string' ? document.getElementById(template) as HTMLTemplateElement : template;
        const content = tpl.content.cloneNode(true) as HTMLElement;
        this.element = content.firstElementChild as HTMLElement;
        this.listElement = this.element.querySelector('.basket__list') as HTMLElement;
        this.totalPriceEl = this.element.querySelector('.basket__price') as HTMLElement;
        this.orderButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
        this.orderButton.addEventListener('click', () => {
            if (!this.orderButton.disabled) {
                this.events.emit('order:start');
            }
        });
    }

    get content(): HTMLElement {
        return this.element;
    }

    render(items: BasketItem[], total: number): HTMLElement {
        this.listElement.innerHTML = '';
        this.listElement.append(...items.map(item => item.basketItem));
        this.setTotalPrice(total);
        this.setOrderButtonEnabled(items.length > 0);
        return this.element;
    }

    setTotalPrice(price: number): void {
        this.totalPriceEl.textContent = `${price} синапсов`;
    }

    setOrderButtonEnabled(enabled: boolean): void {
        this.orderButton.disabled = !enabled;
    }
}
