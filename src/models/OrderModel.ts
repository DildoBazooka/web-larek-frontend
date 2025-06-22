import { IOrderModel, Order, IApiClient, ICartModel } from '../types';

export class OrderModel implements IOrderModel {
  private paymentMethod: 'online' | 'cash' | null = null;
  private deliveryAddress: string = '';
  private contactEmail: string = '';
  private contactPhone: string = '';

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
    if (!this.paymentMethod) throw new Error('Способ оплаты не выбран');
    if (!this.deliveryAddress) throw new Error('Адрес доставки пуст');
    if (!this.contactEmail || !/^\S+@\S+\.\S+$/.test(this.contactEmail)) throw new Error('Недействительный или пустой адрес электронной почты');
    if (!this.contactPhone || !/^\+?\d{10,}$/.test(this.contactPhone)) throw new Error('Недействительный или пустой телефон');
    if (!this.cart.getItems().length) throw new Error('Корзина пуста');

    const order: Order = {
      id: crypto.randomUUID(),
      items: this.cart.getItems(),
      paymentMethod: this.paymentMethod,
      deliveryAddress: this.deliveryAddress,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
    };

    try {
      await this.api.submitOrder(order);
      this.cart.clear();
    } catch (error) {
      console.error('Не удалось отправить заказ:', error);
      throw new Error('Невозможно отправить заказ');
    }
  }
}