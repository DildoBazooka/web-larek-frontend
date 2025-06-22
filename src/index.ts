import './scss/styles.scss';

import { WebLarekApi } from './components/model/LarekApi';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';

import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Form } from './components/Form';
import { Modal } from './components/Modal';
import { Success } from './components/Success';
import { BasketItem } from './components/BasketItem';
import { OrderContactsForm } from './components/Form';

import { ensureElement } from './utils/utils';
import { Product } from './types';
import { AppState } from './components/AppState';

const api = new WebLarekApi();
const events = new EventEmitter();
const productModel = new ProductModel(api);
const cartModel = new CartModel(api, events);
const appState = new AppState(events);

const catalogContainer = ensureElement<HTMLElement>('.gallery');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const modalContainerSelector = '#modal-container';
const modalContainer = ensureElement<HTMLElement>(modalContainerSelector);

const modal = new Modal(modalContainer, events);

productModel.getProducts()
  .then(products => {
    products.forEach(product => {
      const card = new Card(product, events, 'card-catalog');
      const cardElement = card.render(product);
      cardElement.addEventListener('click', () => {
        events.emit('card:select', product);
      });
      catalogContainer.appendChild(cardElement);
    });
  })

function updateBasketCounter() {
  basketCounter.textContent = String(cartModel.getItems().length);  
}

async function renderBasket() {
  const itemsData = await Promise.all(cartModel.getItems().map(async (item: any, index: number) => {
    const product = await productModel.getProductById(item.productId);
    return { product, quantity: item.quantity, index: index + 1 };
  }));
  const items = itemsData.map(({ product, quantity, index }) =>
    new BasketItem(product, quantity, () => {
      cartModel.removeItem(product.id);
      events.emit('cart:changed');
    }, index)
  );
  const total = itemsData.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  modal.content = basket.render(items, total);
}

events.on('cart:changed', () => {
  updateBasketCounter();
  if (isBasketOpen) {
    renderBasket();
    modal.open();
  }
});

events.on('card:select', (product: Product) => {
  const preview = new Card(product, events, 'card-preview');
  const previewElement = preview.render(product);
  const addButton = previewElement.querySelector('.card__button') as HTMLButtonElement;
  const inCart = cartModel.getItems().some((item: any) => item.productId === product.id);
  if (addButton) {
    if (inCart) {
      addButton.disabled = true;
      addButton.textContent = 'Уже в корзине';
    } else {
      addButton.disabled = false;
      addButton.textContent = 'В корзину';
    }
  }
  modal.content = previewElement;
  modal.open();
});

events.on('card:add', (product: Product) => {
  cartModel.addItem(product.id, 1).then(() => {
    updateBasketCounter();  
    modal.close();
  });
});

let isBasketOpen = false;
const basket = new Basket('basket', events);
events.on('basket:open', () => {
  isBasketOpen = true;
  renderBasket();
  modal.open();
});


events.on('order:start', () => {
  const orderForm = new Form(appState);
  modal.content = orderForm.element;
  modal.open();
});

events.on('order:submit', async () => {
  const contactsForm = new OrderContactsForm(appState);
  modal.content = contactsForm.element;
  modal.open();
});

events.on('order:success', async () => {
  const success = new Success(appState);
  const node = success.render();
  const buttonEl = node.querySelector('.order-success__close');
  if (buttonEl) buttonEl.addEventListener('click', () => {
    cartModel.clear();
    updateBasketCounter();
    modal.close();
  });
  modal.content = node;
  modal.open();
});

events.on('order:confirmed', () => {
  events.emit('order:submit');
});

events.on('contacts:confirmed', async () => {
  const order = appState.getOrder();
  if (order) {
    let total = 0;
    for (const item of cartModel.getItems()) {
      const product = await productModel.getProductById(item.productId);
      total += product.price * item.quantity;
    }
    (order as any).total = total;
  }
  events.emit('order:success');
});

events.on('modal: page.scrollLocked', (payload: { lock: boolean }) => {
  if (payload.lock) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const basketButton = document.querySelector('.header__basket');
if (basketButton) {
  basketButton.addEventListener('click', () => {
    events.emit('basket:open');
  });
}

updateBasketCounter();
