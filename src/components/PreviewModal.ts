import { Modal } from './Modal';
import { Product } from '../types';
import { CDN_URL } from '../utils/constants';

interface IModalContent {}

export class PreviewModal extends Modal<IModalContent> {
  constructor(
    private onAddToBasket: (product: Product) => void
  ) {
    const container = document.getElementById('modal-container') as HTMLElement;
    super(container, null);
  }

  show(product: Product) {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as HTMLElement;

    (node.querySelector('.card__category') as HTMLElement).textContent = product.category;
    (node.querySelector('.card__title') as HTMLElement).textContent = product.name;
    (node.querySelector('.card__text') as HTMLElement).textContent = product.description;
    (node.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

    const image = node.querySelector('.card__image') as HTMLImageElement;
    image.src = `${CDN_URL}/${product.image}`;
    image.alt = product.name;

    const basketButton = node.querySelector('.card__button') as HTMLButtonElement;

    if (basketButton) {
      basketButton.addEventListener('click', () => {
        this.onAddToBasket(product);
        this.close();
      });
    }

    this.content = node;
    this.open();
  }
}
