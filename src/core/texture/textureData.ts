export class TextureData {
  public width: number;
  public height: number;
  public maxX: number;
  public maxY: number;
  public data: Uint32Array;
  public rayTimestamp = null as null | number;
  public factX = 0;
  public factY = 0;
  public canvas: CanvasImageSource;

  constructor(
    width: number,
    height: number,
    data: Uint32Array,
    canvas: CanvasImageSource
  ) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.maxX = width - 1;
    this.maxY = height - 1;
    this.canvas = canvas;
  }
}
