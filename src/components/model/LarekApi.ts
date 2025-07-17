import { Api } from '../base/api';
import { IApiClient, Product, ApiOrder } from '../../types';
import { API_URL } from '../../utils/constants';

export class WebLarekApi extends Api implements IApiClient {
    constructor(baseUrl: string = API_URL) {
        super(baseUrl);
    }

    getProducts(): Promise<Product[]> {
        return this.get('/product')
            .then((data) => (data as { items: Product[] }).items);
    }

    getProductById(id: string): Promise<Product> {
        return this.get(`/product/${id}`) as Promise<Product>;
    }

    async submitOrder(order: ApiOrder): Promise<void> {
      if (order.items.some((id: string) => !id)) {
          throw new Error('Обнаружены товары без ID');
      }

      try {
          await this.post('/order', order);
      } catch (error) {
          throw error;
      }
    }
}