import { IOrderModel, IApiClient, ICartModel, ApiOrder } from '../types';

export class OrderModel implements IOrderModel {
  private paymentMethod: 'online' | 'cash' | null = null;
  private deliveryAddress = '';
  private contactEmail = '';
  private contactPhone = '';

  constructor(private api: IApiClient, private cart: ICartModel) {}

  setPaymentMethod(method: 'online' | 'cash'): void {
    this.paymentMethod = method;
  }

  setDeliveryAddress(address: string): void {
    this.deliveryAddress = address.trim();
  }

  setContactInfo(email: string, phone: string): void {
    this.contactEmail = email.trim();
    this.contactPhone = phone.trim();
  }

  async submitOrder(): Promise<void> {
    const cartItems = this.cart.getItems();
    if (!cartItems.length) {
      throw new Error('Корзина пуста');
    }

    if (!this.paymentMethod) {
      throw new Error('Способ оплаты не выбран');
    }

    if (!this.deliveryAddress) {
      throw new Error('Адрес доставки пуст');
    }

    if (!this.contactEmail || !/^\S+@\S+\.\S+$/.test(this.contactEmail)) {
      throw new Error('Недействительный или пустой адрес электронной почты');
    }

    if (!this.contactPhone || !/^\+?\d{10,}$/.test(this.contactPhone)) {
      throw new Error('Недействительный или пустой телефон');
    }

    const total = cartItems.reduce((sum, item) => {
      if (typeof item.product.price !== 'number') {
        throw new Error('Отсутствует цена у товара в корзине');
      }
      return sum + item.product.price * item.quantity;
    }, 0);

    const orderRequest: ApiOrder = {
      items: cartItems.map(item => item.product.id),
      payment: this.paymentMethod,
      address: this.deliveryAddress,
      email: this.contactEmail,
      phone: this.contactPhone,
      total,
    };

    try {
      await this.api.submitOrder(orderRequest);
      this.cart.clear();
    } catch (error) {
      throw new Error(
        `Не удалось отправить заказ: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}