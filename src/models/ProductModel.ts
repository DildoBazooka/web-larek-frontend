import { IApiClient, IProductModel, Product } from '../types';

export class ProductModel implements IProductModel {
  private products: Product[] = [];

  constructor(private api: IApiClient) {}

  async getProducts(): Promise<Product[]> {
    try {
      this.products = await this.api.getProducts();
      return [...this.products];
    } catch (error) {
      throw new Error('Невозможно получить продукты');
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) throw new Error('Идентификатор продукта не может быть пустым');
    try {
      if (!this.products.length) {
        await this.getProducts();
      }
      const product = this.products.find(product => product.id === id);
      if (!product) {
        return await this.api.getProductById(id);
      }
      return product;
    } catch (error) {
      throw new Error('Продукт с идентификатором ${id} не найдено');
    }
  }
}