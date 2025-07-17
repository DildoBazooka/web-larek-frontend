import { ICartModel, CartItem, IProductModel } from '../types';
import { EventEmitter } from '../components/base/events';

export class CartModel implements ICartModel {
  private items: CartItem[] = [];

  constructor(private productModel: IProductModel, private events: EventEmitter) {}

  async addItem(productId: string, quantity: number): Promise<void> {
    const product = await this.productModel.getProductById(productId);
    const existingItem = this.items.find(item => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

  this.events.emit('cart:changed', this.items);
  }

  removeItem(productId: string): void {
    if (!productId) throw new Error('ID товара не может быть пустым');
    this.items = this.items.filter(item => item.product.id !== productId);
    this.events.emit('cart:changed', this.items);
  }


  getItems(): CartItem[] {
    return this.items;
  }

  async getTotal(): Promise<number> {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed', this.items);
  }
}
