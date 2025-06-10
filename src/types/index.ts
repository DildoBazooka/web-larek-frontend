/* Product описывает структуру товара, получаемого от API.
Используется для отображения в каталоге, деталях и расчёта цен.*/
export type Product = {
    id: string; // Уникальный идентификатор товара
    name: string; // Название товара
    description: string; // Описание товара
    price: number; // Цена в синапсах
    image: string; // URL изображения (из CDN)
    category: string; // Категория (например, "софт-скил", "другое")
};

/* CartItem описывает товар в корзине, связывая его с Product через productId.*/
export type CartItem = {
    productId: string; // ID товара в корзине
    quantity: number; // Количество единиц
};

/* Order описывает структуру заказа для отправки на сервер.*/
export type Order = {
    id: string; // ID заказа
    items: CartItem[]; // Список товаров
    paymentMethod: 'online' | 'cash'; // Способ оплаты
    deliveryAddress: string; // Адрес доставки
    contactEmail: string; // Email покупателя
    contactPhone: string; // Телефон покупателя
};

/* IApiClient определяет контракт для взаимодействия с сервером через HTTP-запросы.
Реализуется классом Api.*/
export interface IApiClient {
    getProducts(): Promise<Product[]>; // Получение списка товаров
    getProductById(id: string): Promise<Product>; // Получение товара по ID
    submitOrder(order: Order): Promise<void>; // Отправка заказа
}

/*IProductModel определяет контракт для управления данными о товарах.
Реализуется классом ProductModel.*/
export interface IProductModel {
    getProducts(): Promise<Product[]>; // Получение всех товаров
    getProductById(id: string): Promise<Product>; // Получение товара по ID
}

/* ICartModel определяет контракт для управления корзиной.
Реализуется классом CartModel.*/
export interface ICartModel {
    addItem(productId: string, quantity: number): void; // Добавление товара
    removeItem(productId: string): void; // Удаление товара
    getItems(): CartItem[]; // Получение списка товаров
    getTotal(): Promise<number>; // Подсчёт общей суммы
    clear(): void; // Очистка корзины
}

/* IOrderModel определяет контракт для формирования и отправки заказа.
Реализуется классом OrderModel.*/
export interface IOrderModel {
    setPaymentMethod(method: 'online' | 'cash'): void; // Установка способа оплаты
    setDeliveryAddress(address: string): void; // Установка адреса
    setContactInfo(email: string, phone: string): void; // Установка контактов
    submitOrder(): Promise<void>; // Отправка заказа
}

/* IModal определяет контракт для управления модальными окнами.
Реализуется классом Modal.*/
export interface IModal {
    open(content: HTMLElement): void; // Открывает модальное окно с содержимым
    close(): void; // Закрывает модальное окно
}