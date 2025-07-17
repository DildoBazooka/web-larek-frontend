/* Product описывает структуру товара, получаемого от API.
Используется для отображения в каталоге, деталях и расчёта цен.*/
export type Product = {
    id: string; // Уникальный идентификатор товара
    name: string; // Название товара
    description: string; // Описание товара
    price: number; // Цена в синапсах
    image: string; // URL изображения (из CDN)
    category: string; // Категория (например, "софт-скил", "другое")
    title: string;
};

/* CartItem описывает товар в корзине, связывая его с Product через productId.*/
export type CartItem = {
    product: Product; // Объект товара
    quantity: number; // Количество единиц
};

/* Order описывает структуру заказа для отправки на сервер.*/
export type Order = {
    items: CartItem[]; // Список товаров
    payment: 'online' | 'cash'; // Способ оплаты
    address: string; // Адрес доставки
    email: string; // Email покупателя
    phone: string; // Телефон покупателя
    total: number; // Общая сумма заказа
};

/* ApiOrder — упрощённая версия заказа, отправляемая на сервер.
   Вместо объектов CartItem содержит только массив ID товаров. */
export type ApiOrder = Omit<Order, 'items'> & {
    items: string[]; // Массив ID товаров
};

/* FormErrors описывает возможные ошибки валидации полей формы заказа. */
export type FormErrors = {
    address?: string;
    payment?: string;
    email?: string;
    phone?: string;
};

/* TOrderInfo — структура данных, вводимых пользователем на форме оформления заказа. */
export type TOrderInfo = {
    address: string;
    email: string;
    phone: string;
    payment: string;
};

/* IApiClient определяет контракт для взаимодействия с сервером через HTTP-запросы.
Реализуется классом Api.*/
export interface IApiClient {
    getProducts(): Promise<Product[]>; // Получение списка товаров
    getProductById(id: string): Promise<Product>; // Получение товара по ID
    submitOrder(order: ApiOrder): Promise<void>; // Отправка заказа
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

// Элемент корзины, отображаемый в UI
export interface IBasketItem {
	id: string;
	index: number;
	title: string;
	price: number;
}

// Действия для элемента корзины
export interface IBasketItemActions {
	onClick?: (event: MouseEvent) => void;
}