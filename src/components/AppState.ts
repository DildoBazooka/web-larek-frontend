import { EventEmitter } from './base/events';
import { Product, Order, FormErrors,TOrderInfo } from '../types';

export class AppState {
    private catalog: Product[] = [];
    private basket: Product[] = [];
    private order: Order | null = null;
    private formErrors: FormErrors = {};
    private preview: Product | null = null;
    public events: EventEmitter;
    constructor(events: EventEmitter) {
        this.events = events;
    }

    setCatalog(items: Product[]) {
        this.catalog = items;
        this.events.emit('catalog:updated', items);
    }

    getCatalog(): Product[] {
        return this.catalog;
    }

    addToBasket(product: Product) {
        this.basket.push(product);
        this.events.emit('basket:update');
    }

    removeFromBasket(productId: string) {
    const index = this.basket.findIndex(p => p.id === productId);
    if (index !== -1) {
             this.basket.splice(index, 1);
             this.events.emit('basket:update');
        }
    }

    getBasket(): Product[] {
        return this.basket;
    }

    clearBasket() {
    this.basket = [];
    this.events.emit('basket:update');
    }
    
    clearOrder() {
    this.order = null;
}

updateOrder<K extends keyof TOrderInfo>(key: K, value: TOrderInfo[K]) {
        if (!this.order) {
            this.order = {
                address: '',
                email: '',
                phone: '',
                payment: '',
                total: 0,
                items: [],
            } as unknown as Order;
        }

    (this.order as any)[key] = value;

    this.setFormErrors({});

    if (key === 'address' || key === 'payment') {
        this.validateOrderInfo();
    } else if (key === 'email' || key === 'phone') {
        this.validateContacts();
    }

    this.events.emit('formErrors:updated');
    }

    setOrder(orderInfo: TOrderInfo) {
        const items = this.basket.map(product => product.id);
        const total = this.basket.reduce((sum, item) => sum + item.price, 0);

        this.order = {
            ...orderInfo,
            items,
            total,
        } as unknown as Order;
    }

    getOrder(): Order | null {
        return this.order;
    }

    setFormErrors(errors: FormErrors) {
        this.formErrors = errors;
        this.events.emit('formErrors:updated');
    }

    getFormErrors(): FormErrors {
        return this.formErrors;
    }
    
    setPreview(product: Product) {
    this.preview = product;
    this.events.emit('preview:changed', product);
    }
    
    getPreview(): Product | null {
        return this.preview;
    }
    
    getBasketIds(): string[] {
        return this.basket.map(product => product.id);
    }

    getTotal(): number {
        return this.basket.reduce((sum, product) => sum + product.price, 0);
    }

    
    validateOrderInfo(): boolean {
    const order = this.order;
    if (!order) return false;

    const errors: FormErrors = {};

    if (!(order as any).address) {
        errors.address = 'Введите адрес';
    }

    if (!(order as any).payment) {
        errors.payment = 'Выберите способ оплаты';
    }

    this.setFormErrors(errors);
    return Object.keys(errors).length === 0;
    }

    validateContacts(): boolean {
        const order = this.order;
        if (!order) return false;

        const errors: FormErrors = {};

        if (!(order as any).email) {
         errors.email = 'Введите email';
        }

        if (!(order as any).phone) {
         errors.phone = 'Введите телефон';
        }

        this.setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
}