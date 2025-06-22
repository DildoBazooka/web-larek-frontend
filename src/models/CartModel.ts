import { ICartModel, CartItem, IProductModel } from '../types';
import { EventEmitter } from '../components/base/events';

export class CartModel implements ICartModel {
  private items: CartItem[] = [];

  constructor(private productModel: IProductModel, private events: EventEmitter) {}

  async addItem(productId: string, quantity: number): Promise<void> {
    if (!productId) throw new Error('ID товара не может быть пустым');
    if (quantity <= 0) throw new Error('Количество должно быть положительным');
    try {
      await this.productModel.getProductById(productId);
      const existing = this.items.find(item => item.productId === productId);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ productId, quantity });
      }

      this.events.emit('cart:changed', this.items);
    } catch (error) {
      console.error('Не удалось добавить товар:', error);
      throw new Error('Невозможно добавить товар в корзину');
    }
  }

  removeItem(productId: string): void {
    if (!productId) throw new Error('ID товара не может быть пустым');
    this.items = this.items.filter(item => item.productId !== productId);
    this.events.emit('cart:changed', this.items);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  async getTotal(): Promise<number> {
    try {
      const products = await Promise.all(
        this.items.map(item => this.productModel.getProductById(item.productId))
      );
      return products.reduce((sum, product, index) => sum + product.price * this.items[index].quantity, 0);
    } catch (error) {
      console.error('Не удалось вычислить сумму корзины:', error);
      throw new Error('Невозможно вычислить сумму корзины');
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed', this.items);
  }
}
