import { Api } from '../base/api';
import { IApiClient, Product, Order } from '../../types';
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

  submitOrder(order: Order): Promise<void> {
    return this.post('/order', order).then(() => {});
  }
}