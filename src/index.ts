import './scss/styles.scss';

import { WebLarekApi } from './components/model/LarekApi';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';

import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { Success } from './components/Success';
import { BasketItem } from './components/BasketItem';
import { OrderForm } from './components/OrderForm';
import { OrderContactsForm } from './components/OrderContactsForm';

import { ensureElement } from './utils/utils';
import { Product, Order } from './types';
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
  const itemsData = cartModel.getItems().map((item, index) => ({
  product: item.product,
  quantity: item.quantity,
  index: index + 1
}));
  const items = itemsData.map(({ product, quantity, index }) =>
    new BasketItem(product, quantity, () => {
      cartModel.removeItem(product.id);
      events.emit('cart:changed');
    }, index).render()
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
  const orderForm = new OrderForm(appState, events);
  modal.content = orderForm.element;
  modal.open();
});

events.on('order:submit', () => {
  const contactsForm = new OrderContactsForm(appState, events);
  modal.content = contactsForm.element;
  modal.open();
});

events.on('order:success', async () => {
  const total = await cartModel.getTotal();
  const success = new Success(total);
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

  if (!order?.payment || !order?.address || !order?.email || !order?.phone) {
    const missing = [
      !order?.payment && 'способ оплаты',
      !order?.address && 'адрес',
      !order?.email && 'email',
      !order?.phone && 'телефон'
    ].filter(Boolean).join(', ');
    alert(`Заполните все обязательные поля: ${missing}`);
    return;
  }

  const cartItems = cartModel.getItems();
  if (!cartItems.length) {
    alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
    return;
  }

  const orderToSend = {
    payment: order.payment,
    email: order.email,
    phone: order.phone,
    address: order.address,
    total: await cartModel.getTotal(),
    items: cartItems.map(item => item.product.id)
  };

  try {
    if (orderToSend.items.some(id => !id)) {
      throw new Error('Обнаружены товары без ID');
    }

    await api.submitOrder(orderToSend);
    events.emit('order:success');
  } catch (error) {
    alert(`Ошибка при отправке заказа: ${error.message}`);
  }
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
