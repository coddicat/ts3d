export class TextHandler {
  private context: CanvasRenderingContext2D;
  private sizeFactor: number;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.sizeFactor = this.context.canvas.height * 0.03;
  }

  public print(
    text: string,
    x: number,
    y: number,
    color: string,
    align: CanvasTextAlign = 'left',
    baseline: CanvasTextBaseline = 'top',
    size: number = 1
  ): void {
    const context = this.context;
    context.textAlign = align;
    context.fillStyle = color;
    const fontSize = this.sizeFactor * size;
    context.font = `${fontSize}px Arial`;
    context.textBaseline = baseline;
    context.fillText(text, x, y);
  }
}
