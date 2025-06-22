import { AppState } from './AppState';

export class Success {
  private appState: AppState;
  private template: HTMLTemplateElement;

  constructor(appState: AppState) {
    this.appState = appState;
    this.template = document.getElementById('success') as HTMLTemplateElement;
  }

  render(): HTMLElement {
    const node = this.template.content.firstElementChild.cloneNode(true) as HTMLElement;
    let totalPrice = 0;
    if (this.appState.getOrder() && (this.appState.getOrder() as any).total) {
      totalPrice = (this.appState.getOrder() as any).total;
    } else {
      totalPrice = this.appState.getBasket().reduce((sum, product) => sum + (product.price || 0), 0);
    }
    const description = node.querySelector('.order-success__description');
    if (description) {
      description.textContent = `Списано ${totalPrice} синапсов`;
    }
    return node;
  }
}