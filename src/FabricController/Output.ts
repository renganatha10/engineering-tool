import { fabric } from 'fabric';

interface OutputData {
  index: number;
  nodeId: string;
  groupId: string;
  y1Factor: number;
}

class Output {
  public outputs: fabric.Circle[];
  private _canvas: fabric.Canvas;
  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.outputs = [];
  }

  public add(options: fabric.ICircleOptions) {
    const circle = new fabric.Circle(options);
    this._canvas.add(circle);
    this.outputs.push(circle);
  }

  public remove(circle: fabric.Circle) {
    // TODO: Remove from Output List
    this._canvas.remove(circle);
  }
}

export default Output;
