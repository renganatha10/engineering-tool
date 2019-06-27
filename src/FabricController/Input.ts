import { fabric } from 'fabric';

interface InputData {
  index: number;
  nodeId: string;
  groupId: string;
  y1Factor: number;
}

class Input {
  public inputs: fabric.Circle[];
  private _canvas: fabric.Canvas;
  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.inputs = [];
  }

  public add(options: fabric.ICircleOptions) {
    const circle = new fabric.Circle(options);
    this._canvas.add(circle);
    this.inputs.push(circle);
  }

  public remove(circle: fabric.Circle) {
    // TODO: Remove from Input List
    this._canvas.remove(circle);
  }
}

export default Input;
