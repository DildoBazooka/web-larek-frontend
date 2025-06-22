import { Api } from "./base/api";
import { Product, Order } from "../types";
import { API_URL } from "../utils/constants";

export class WebLarekApi extends Api {
    
	constructor(baseUrl: string = API_URL) {
		super(baseUrl);
	}

	getProducts(): Promise<Product[]> {
	return this.get('/product').then((data) => (data as { items: Product[] }).items);
	}

	sendOrder(order: Order): Promise<{ id: string }> {
		return this.post('/order', order) as Promise<{ id: string }>;
	}

}