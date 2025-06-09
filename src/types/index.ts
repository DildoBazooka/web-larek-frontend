// Типы данных
export type Product = {
    id: string; // Уникальный идентификатор товара
    name: string; // Название товара
    description: string; // Описание товара
    price: number; // Цена в синапсах
    image: string; // URL изображения
    category: string; // Категория (например, "софт-скил", "другое")
};

export type CartItem = {
    productId: string; // ID товара в корзине
    quantity: number; // Количество единиц
};

export type Order = {
    id: string; // ID заказа
    items: CartItem[]; // Список товаров
    paymentMethod: 'online' | 'cash'; // Способ оплаты
    deliveryAddress: string; // Адрес доставки
    contactEmail: string; // Email покупателя
    contactPhone: string; // Телефон покупателя
};

// Интерфейсы API
export interface IApiClient {
    getProducts(): Promise<Product[]>; // Получение списка товаров
    getProductById(id: string): Promise<Product>; // Получение товара по ID
    submitOrder(order: Order): Promise<void>; // Отправка заказа
}

// Интерфейсы моделей
export interface IProductModel {
    getProducts(): Promise<Product[]>; // Получение всех товаров
    getProductById(id: string): Promise<Product>; // Получение товара по ID
}

export interface ICartModel {
    addItem(productId: string, quantity: number): void; // Добавление товара
    removeItem(productId: string): void; // Удаление товара
    getItems(): CartItem[]; // Получение списка товаров
    getTotal(): number; // Подсчёт общей суммы
    clear(): void; // Очистка корзины
}

export interface IOrderModel {
    setPaymentMethod(method: 'online' | 'cash'): void; // Установка способа оплаты
    setDeliveryAddress(address: string): void; // Установка адреса
    setContactInfo(email: string, phone: string): void; // Установка контактов
    submitOrder(): Promise<void>; // Отправка заказа
}

// Интерфейсы отображений
export interface IProductCatalogView {
    render(products: Product[]): void; // Рендер каталога
    onProductSelect(callback: (productId: string) => void): void; // Обработчик выбора товара
}

export interface IProductDetailView {
    render(product: Product): void; // Рендер деталей товара
    onAddToCart(callback: (productId: string, quantity: number) => void): void; // Обработчик добавления в корзину
    onRemoveFromCart(callback: (productId: string) => void): void; // Обработчик удаления из корзины
}

export interface ICartView {
    render(items: CartItem[], total: number): void; // Рендер корзины
    onCheckout(callback: () => void): void; // Обработчик перехода к оформлению
}

export interface ICheckoutView {
    renderStep1(): void; // Рендер первого шага (оплата и адрес)
    renderStep2(): void; // Рендер второго шага (контакты)
    onProceed(callback: () => void): void; // Обработчик перехода к шагу 2
    onSubmit(callback: () => void): void; // Обработчик отправки заказа
}

export interface ISuccessView {
    render(total: number): void; // Рендер успешного заказа
}