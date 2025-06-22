import { Product } from "../types";
import { EventEmitter } from "./base/events";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";

export class Card {
    cardElement: HTMLElement;
    category: HTMLElement;
    image: HTMLImageElement;
    product: Product;
    events: EventEmitter;

    protected color: Record<string, string> = {
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    };

    constructor(product: Product, events: EventEmitter, templateId: string = 'card-catalog') {
        this.product = product;
        this.events = events;
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        if (!template) {
            throw new Error(`Шаблон #${templateId} не найден`);
        }
        this.cardElement = template.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
        this.category = ensureElement<HTMLElement>('.card__category', this.cardElement);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.cardElement);
        this.render(product);
        const CardButton = this.cardElement.querySelector('.card__button');
        if (CardButton) {
            CardButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.events.emit('card:add', this.product);
            });
        } else {
            this.cardElement.addEventListener('click', () => {
                this.events.emit('card:select', this.product);
            });
        }
    }

    set cardCategory(value: string) {
        this.category.textContent = value;
        this.category.className = `card__category card__category_${this.color[value] || 'other'}`;
    }

    render(product: Product): HTMLElement {
        this.category.textContent = product.category;
        this.cardCategory = product.category;
        this.image.src = `${CDN_URL}${product.image}`;
        this.image.alt = product.title;
        const title = this.cardElement.querySelector('.card__title');
        if (title) title.textContent = product.title;
        const price = this.cardElement.querySelector('.card__price');
        if (price) price.textContent = (product.price === null || product.price === undefined) ? 'бесценно' : `${product.price} синапсов`;
        const desc = this.cardElement.querySelector('.card__text');
        if (desc && product.description) desc.textContent = product.description;
        return this.cardElement;
    }
}