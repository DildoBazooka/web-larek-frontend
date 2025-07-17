import { EventEmitter } from './base/events';
import { Product, Order, FormErrors, TOrderInfo, CartItem } from '../types';

export class AppState {
    private catalog: Product[] = [];
    private basket: Product[] = [];
    private order: Partial<Order> | null = null;
    private formErrors: FormErrors = {};
    private preview: Product | null = null;
    public events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setCatalog(items: Product[]): void {
        this.catalog = items;
        this.events.emit('catalog:updated', items);
    }

    getCatalog(): Product[] {
        return this.catalog;
    }

    addToBasket(product: Product): void {
        this.basket.push(product);
        this.events.emit('basket:update');
    }

    removeFromBasket(productId: string): void {
        const index = this.basket.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.basket.splice(index, 1);
            this.events.emit('basket:update');
        }
    }

    getBasket(): Product[] {
        return this.basket;
    }

    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:update');
    }
    
    clearOrder(): void {
        this.order = null;
    }

    updateOrder<K extends keyof TOrderInfo>(key: K, value: TOrderInfo[K]): void {
        if (!this.order) {
            this.order = {
                payment: undefined,
                address: '',
                email: '',
                phone: '',
                items: [],
                total: 0
            };
        }

        switch (key) {
            case 'payment':
                this.order.payment = value as 'online' | 'cash';
                break;
            case 'address':
                this.order.address = value as string;
                break;
            case 'email':
                this.order.email = value as string;
                break;
            case 'phone':
                this.order.phone = value as string;
                break;
            default:
                (this.order as any)[key] = value;
        }

        this.setFormErrors({});

        if (key === 'address' || key === 'payment') {
            this.validateOrderInfo();
        } else if (key === 'email' || key === 'phone') {
            this.validateContacts();
        }

        this.events.emit('formErrors:updated');
    }

    setOrder(orderInfo: TOrderInfo): void {
        const items: CartItem[] = this.basket.map(product => ({
        product,
        quantity: 1
    }));
    const total = this.basket.reduce((sum, item) => sum + item.price, 0);

    this.order = {
        payment: orderInfo.payment as 'online' | 'cash',
        address: orderInfo.address,
        email: orderInfo.email,
        phone: orderInfo.phone,
        items,
        total
        };
    }

    getOrder(): Partial<Order> | null {
        return this.order;
    }

    setFormErrors(errors: FormErrors): void {
        this.formErrors = errors;
        this.events.emit('formErrors:updated');
    }

    getFormErrors(): FormErrors {
        return this.formErrors;
    }
    
    setPreview(product: Product): void {
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
        if (!this.order) return false;

        const errors: FormErrors = {};

        if (!this.order.address) {
            errors.address = 'Введите адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        this.setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    validateContacts(): boolean {
        if (!this.order) return false;

        const errors: FormErrors = {};

        if (!this.order.email) {
            errors.email = 'Введите email';
        }

        if (!this.order.phone) {
            errors.phone = 'Введите телефон';
        }

        this.setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
}