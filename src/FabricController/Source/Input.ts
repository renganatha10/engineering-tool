import { fabric } from 'fabric';
import { ISource } from './index';

interface InputData {
  index: number;
  nodeId: string;
  groupId: string;
  y1Factor: number;
}

class Input implements ISource {
  public inputs: fabric.Circle[];
  private _canvas: fabric.Canvas;
  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.inputs = [];
  }

  public add(options: fabric.ICircleOptions) {
    const circle = new fabric.Circle(options);
    circle.on('mouseover', this.onMouseOver);
    circle.on('mouseout', this.onMouseOut);
    this._canvas.add(circle);
    this.inputs.push(circle);
  }

  public onMouseOver = (option: fabric.IEvent) => {
    if (option.target) {
      option.target.setColor('black');
      this._canvas.requestRenderAll();
    }
  };

  public onMouseOut = (option: fabric.IEvent) => {
    if (option.target) {
      option.target.setColor('green');
      this._canvas.requestRenderAll();
    }
  };

  public remove(circle: fabric.Circle) {
    circle.off('mouseover', this.onMouseOver);
    circle.off('mouseout', this.onMouseOut);

    this.inputs = this.inputs.filter(
      input => input.data.nodeId !== circle.data.nodeId
    );
    this._canvas.remove(circle);
  }
}

export default Input;
