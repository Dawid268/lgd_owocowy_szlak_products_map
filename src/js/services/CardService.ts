import { Card } from '../components/Card';
import { IPoint } from '../types/Point';

export class CardService {
  private cards: Card[] = [];
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.querySelector(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = container as HTMLElement;
  }

  public addCard(point: IPoint): Card {
    const card = new Card(point);
    this.cards.push(card);
    this.container.appendChild(card.getElement());
    return card;
  }

  public addCards(points: IPoint[]): void {
    points.forEach(point => {
      this.addCard(point);
    });
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public clearCards(): void {
    this.cards.forEach(card => {
      card.getElement().remove();
    });
    this.cards = [];
  }

  public getCardByPoint(point: IPoint): Card | undefined {
    return this.cards.find(card => card.getPoint() === point);
  }
}
