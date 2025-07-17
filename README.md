# Проектная работа "Веб-ларек"

"Веб-ларёк" — это интернет-магазин для веб-разработчиков, позволяющий просматривать каталог товаров, 
добавлять их в корзину, просматривать детали товаров в модальном окне и оформлять заказы в два шага. 
Проект реализован с использованием модульной архитектуры, разделяющей данные, интерфейс и коммуникацию. 
Основные функциональные требования включают отображение каталога, управление корзиной, 
валидацию форм и отправку заказов через API.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
 
## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
 ## Архитектура проекта

 Проект построен по MV-паттерну (Model-View), где модели управляют данными, а отображения — пользовательским интерфейсом. Коммуникация между компонентами осуществляется через брокер событий (EventEmitter). Архитектура следует принципам изолированности, единственной ответственности и масштабируемости.

 ## Имеющиеся классы

 1) Класс Api - обеспечивает взаимодействие с сервером через HTTP-запросы.

 Свойства:

    baseUrl: string — базовый URL API.

    options: RequestInit — настройки HTTP-запросов (заголовки, метод).

Методы:

    get(uri: string) — выполняет GET-запрос, возвращает данные в формате JSON.

    post(uri: string, data: object, method: ApiPostMethods) — выполняет POST, PUT или DELETE-запросы с данными.

    handleResponse(response: Response) — обрабатывает ответ сервера, возвращает JSON или ошибку.

Типы:

    ApiListResponse<Type> — структура ответа API с полями:

        total: number — общее количество элементов.

        items: Type[] — массив данных.

    ApiPostMethods — перечисление методов: 'POST', 'PUT', 'DELETE'.


2) Класс EventEmitter - управляет событиями для связи компонентов.

Свойства:

    _events: Map<EventName, Set<Subscriber>> — хранит события и их подписчиков.

Методы:

    on(eventName, callback) — Установить обработчик на событие.

    off(eventName, callback) — Снять обработчик с события.

    emit(eventName, data) — Инициировать событие с данными.

    onAll(callback) — Слушать все события.

    offAll() — Сбросить все обработчики.

    trigger(eventName, context) — Сделать коллбек триггер, генерирующий событие при вызове.

## Классы слоя Model

1) Класс ProductModel - управляет данными о товарах, запрашивая их через Api.

Свойства:

    api: IApiClient — клиент API для запросов.

Методы:

    getProducts(): Promise<Product[]> — получает все товары.

    getProductById(id: string): Promise<Product> — получает товар по ID.


2) Класс CartModel - управляет корзиной, храня товары и подсчитывая сумму.

Свойства:

    items: CartItem[] — массив товаров в корзине.

    productModel: IProductModel — модель для получения цен.

Методы:

    addItem(productId: string, quantity: number): void — добавляет товар.

    removeItem(productId: string): void — удаляет товар.

    getItems(): CartItem[] — возвращает товары.

    getTotal(): Promise<number> — подсчитывает сумму.

    clear(): void — очищает корзину.


3) Класс OrderModel - формирует и отправляет заказ.

Свойства:

    api: IApiClient — клиент API.

    cart: ICartModel — модель корзины.

    order: Partial<Order> — данные заказа.

Методы:

    setPaymentMethod(method: 'online' | 'cash'): void — задаёт оплату.

    setDeliveryAddress(address: string): void — задаёт адрес.

    setContactInfo(email: string, phone: string): void — задаёт контакты.

    submitOrder(): Promise<void> — отправляет заказ.


## Классы слоя View

1) Класс Card - создает экземпляры карточек для каталога, корзины и предпросмотра.

Свойства:

    cardElement: HTMLElement — клонированный шаблон карточки.
    category: HTMLElement — элемент категории.
    image: HTMLImageElement — изображение товара.
    product: Product — данные товара.
    events: EventEmitter — брокер событий.

Методы:

    render(product: Product): HTMLElement — заполняет шаблон данными товара.
    set cardCategory(value: string): void — устанавливает класс и текст категории.

2) Класс Modal - управляет модальными окнами.

Свойства:

    container: HTMLElement — контейнер модального окна (#modal-container).
    closeButton: HTMLButtonElement — кнопка закрытия (.modal__close).
    modalContent: HTMLElement — содержимое модального окна (.modal__content).

Методы:

    open(): void — открывает окно.
    close(): void — закрывает окно.

3) Класс Form/OrderContactsForm - управляет формами заказа (оплата/адрес и контакты).

Свойства:

    formNode: HTMLElement — DOM-узел формы.
    appState: AppState — глобальное состояние приложения.

Методы:

    render(): HTMLElement — возвращает DOM-узел формы.
    (Валидация и обновление состояния реализованы через appState.)

4) Класс Success - отображает окно успешного заказа.

Свойства:

    appState: AppState — глобальное состояние приложения.
    template: HTMLTemplateElement — шаблон окна успеха.

Методы:

    render(): HTMLElement — возвращает DOM-узел окна успеха с суммой заказа.

## Типы данных

1) Product - описывает структуру товара, получаемого от API.
Используется для отображения в каталоге, деталях и расчёта цен.

Свойства:

    id: string; // Уникальный идентификатор товара
    name: string; // Название товара
    description: string; // Описание товара
    price: number; // Цена в синапсах
    image: string; // URL изображения
    category: string; // Категория (например, "софт-скил", "другое")


2) CartItem - описывает товар в корзине, связывая его с Product через productId.

Своййства: 

    productId: string; // ID товара в корзине
    quantity: number; // Количество единиц


3) Order - описывает структуру заказа для отправки на сервер.

Свойства: 

    id: string; - ID заказа
    items: CartItem[]; - Список товаров
    paymentMethod: 'online' | 'cash'; - Способ оплаты
    deliveryAddress: string; - Адрес доставки
    contactEmail: string; - Email покупателя
    contactPhone: string; - Телефон покупателя

4) ApiOrder - упрощённая версия заказа, отправляемая на сервер.
   Вместо объектов CartItem содержит только массив ID товаров.

Свойства:

    items: string[]; // Массив ID товаров

5) FormErrors — структура ошибок формы.

Свойства:

    address?: string; // Ошибка в адресе
    payment?: string; // Ошибка в выборе оплаты
    email?: string;   // Ошибка в email
    phone?: string;   // Ошибка в телефоне

6) TOrderInfo — структура информации о заказе (используется для заполнения заказа).

Свойства:

    address: string; // Адрес доставки
    email: string;   // Email покупателя
    phone: string;   // Телефон покупателя
    payment: string; // Способ оплаты ('card' | 'cash')