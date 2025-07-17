export class Success {
  private total: number;
  private template: HTMLTemplateElement;

  constructor(total: number) {
    this.total = total;
    this.template = document.getElementById('success') as HTMLTemplateElement;
  }

  render(): HTMLElement {
    const node = this.template.content.firstElementChild.cloneNode(true) as HTMLElement;
    const description = node.querySelector('.order-success__description');
    if (description) {
      description.textContent = `Списано ${this.total} синапсов`;
    }
    return node;
  }
}