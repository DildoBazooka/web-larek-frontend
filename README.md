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

## Добавленные классы

1) Класс Modal - управляет модальными окнами для отображения контента (детали товара, корзина, формы заказа).

Свойства:

    container: HTMLElement — контейнер модального окна (#modal-container).

    closeButton: HTMLButtonElement — кнопка закрытия (.modal__close).

    content: HTMLElement — контейнер для содержимого (.modal__content).

Методы:

    open(content: HTMLElement) — открывает модальное окно с заданным содержимым.

    close() — закрывает модальное окно.

## Типы данных

1) Product - описывает товар, получаемый от API. Используется для отображения в каталоге, деталях и расчёта цен.

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


3) Order - Описывает заказ для отправки на сервер.

Свойства: 

    id: string; - ID заказа
    items: CartItem[]; - Список товаров
    paymentMethod: 'online' | 'cash'; - Способ оплаты
    deliveryAddress: string; - Адрес доставки
    contactEmail: string; - Email покупателя
    contactPhone: string; - Телефон покупателя


## Интерфейсы API

IApiClient - определяет методы взаимодействия с сервером, реализованные в классе Api

Методы:

    getProducts(): Promise<Product[]>; - Получение списка товаров
    getProductById(id: string): Promise<Product>; - Получение товара по ID
    submitOrder(order: Order): Promise<void>; - Отправка заказа


## Интерфейсы моделей

1) IProductModel - управляет данными о товарах, запрашивая их через IApiClient.

Методы:

    getProducts(): Promise<Product[]>; - Получение всех товаров
    getProductById(id: string): Promise<Product>; - Получение товара по ID


2) ICartModel - управляет состоянием корзины, храня CartItem[] и подсчитывая сумму.

Методы:

    addItem(productId: string, quantity: number): void; - Добавление товара
    removeItem(productId: string): void; - Удаление товара
    getItems(): CartItem[]; - Получение списка товаров
    getTotal(): number; - Подсчёт общей суммы
    clear(): void; - Очистка корзины


3) IOrderModel - Формирует заказ и отправляет его на сервер.

Методы:

    setPaymentMethod(method: 'online' | 'cash'): void; - Установка способа оплаты
    setDeliveryAddress(address: string): void; - Установка адреса
    setContactInfo(email: string, phone: string): void; - Установка контактов
    submitOrder(): Promise<void>; - Отправка заказа


## Интерфейсы отображений

1) IProductCatalogView - генерирует каталог товаров в <main class="gallery">

Методы:

    render(products: Product[]): void; - Рендер каталога
    onProductSelect(callback: (productId: string) => void): void; - Обработчик выбора товара


2) IProductDetailView - генерирует детали товара в модальном окне с шаблоном #card-preview

Методы: 

    render(product: Product): void; - Рендер деталей товара
    onAddToCart(callback: (productId: string, quantity: number) => void): void; - Обработчик добавления в корзину
    onRemoveFromCart(callback: (productId: string) => void): void; - Обработчик удаления из корзины


3) ICartView - генерирует корзину в модальном окне с шаблоном #basket

Методы:

    render(items: CartItem[], total: number): void; - Рендер корзины
    onCheckout(callback: () => void): void; - Обработчик перехода к оформлению


4) ICheckoutView - управляет оформлением заказа с формами #order и #contacts.

Методы: 

    renderStep1(): void; - Рендер первого шага (оплата и адрес)
    renderStep2(): void; - Рендер второго шага (контакты)
    onProceed(callback: () => void): void; - Обработчик перехода к шагу 2
    onSubmit(callback: () => void): void; - Обработчик отправки заказа


5) ISuccessView - генерирует сообщение об успешном заказе с шаблоном #success

Методы: 

    render(total: number): void; - Рендер успешного заказа