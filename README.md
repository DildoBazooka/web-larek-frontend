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

1) Класс MainPage - отображает главную страницу с каталогом товаров и управляет корзиной.

Свойства:

    gallery: HTMLElement — контейнер каталога (.gallery).

    basketButton: HTMLButtonElement — кнопка корзины (.header__basket).

    basketCounter: HTMLElement — счётчик товаров (.header__basket-counter).

Методы:

    render(products: Product[]): void — рендерит каталог.

    updateCounter(count: number): void — обновляет счётчик.


2) Класс Card - создаёт экземпляры карточек для трёх шаблонов (#card-catalog, #card-preview, #card-basket).

Свойства:

    element: HTMLElement — клонированный шаблон карточки.

Методы:

    render(data: Product | CartItem, index?: number): void — заполняет шаблон данными.

    setClickHandler(handler: () => void): void — устанавливает обработчик клика.


3) Класс Modal - управляет модальными окнами.

Свойства:

    container: HTMLElement — #modal-container.

    closeButton: HTMLButtonElement — .modal__close.

    content: HTMLElement — .modal__content.

Методы:

    open(content: HTMLElement): void — открывает окно.

    close(): void — закрывает окно.


4) Класс CartView - Рендерит корзину в модальном окне.

Свойства:

    list: HTMLUListElement — список товаров (.basket__list).

    total: HTMLElement — сумма (.basket__price).

    checkoutButton: HTMLButtonElement — кнопка оформления (.basket__button).

Методы:

    render(items: CartItem[], total: number): void — рендерит корзину.


5) Класс CheckoutView - управляет формами заказа (#order, #contacts).

Свойства:

    step1Form: HTMLFormElement — форма оплаты/адреса.

    step2Form: HTMLFormElement — форма контактов.

Методы:

    renderStep1(): void — рендерит первый шаг.

    renderStep2(): void — рендерит второй шаг.


6) Класс SuccessView - отображает успех заказа.

Свойства:

    description: HTMLElement — текст суммы (.order-success__description).

    closeButton: HTMLButtonElement — кнопка закрытия (.order-success__close).

Методы:

    render(total: number): void — рендерит окно.

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
