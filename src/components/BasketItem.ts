import { Product } from '../types';

export class BasketItem {
    basketItem: HTMLElement;
    removeButton: HTMLButtonElement;
    product: Product;
    quantity: number;
    itemIndex: number;

    constructor(product: Product, quantity: number, onDelete: () => void, index: number) {
        this.product = product;
        this.quantity = quantity;
        this.itemIndex = index;
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const content = template.content.cloneNode(true) as HTMLElement;
        this.basketItem = content.querySelector('.basket__item') as HTMLElement;

        this.basketItem.querySelector('.basket__item-index').textContent = String(this.itemIndex);
        this.basketItem.querySelector('.card__title').textContent = this.product.name || this.product.title;
        this.basketItem.querySelector('.card__price').textContent = `${this.product.price} синапсов`;

        this.removeButton = this.basketItem.querySelector('.basket__item-delete') as HTMLButtonElement;
        this.removeButton.addEventListener('click', onDelete);
    }

    render(): HTMLElement {
        return this.basketItem;
    }
}
