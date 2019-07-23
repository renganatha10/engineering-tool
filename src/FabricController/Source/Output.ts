import { fabric } from 'fabric';

import eventEmitter from './../../utils/eventListener';

import { ISource } from './index';

class Output implements ISource {
  public outputs: fabric.Circle[];
  private _canvas: fabric.Canvas;
  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.outputs = [];
  }

  public add(options: fabric.ICircleOptions, isLoaded: boolean) {
    const circle = new fabric.Circle(options);
    circle.on('mouseover', this.onMouseOver);
    circle.on('mouseout', this.onMouseOut);
    this._canvas.add(circle);
    this.outputs.push(circle);

    if (!isLoaded) {
      eventEmitter.emit('ADD_NODE', {
        id: options.data.nodeId,
        name: options.name,
        data: options.data,
        position: { type: 'Output', x: options.left, y: options.top },
        isDevice: false,
        subType: '',
        type: 'Output',
      });
    }
  }

  public onMouseOver = (option: fabric.IEvent) => {
    if (option.target) {
      option.target.setColor('black');
      this._canvas.requestRenderAll();
    }
  };

  public onMouseOut = (option: fabric.IEvent) => {
    if (option.target) {
      option.target.setColor('red');
      this._canvas.requestRenderAll();
    }
  };

  public remove(circle: fabric.Circle) {
    circle.off('mouseover', this.onMouseOver);
    circle.off('mouseout', this.onMouseOut);
    this.outputs = this.outputs.filter(
      output => output.data.nodeId !== circle.data.nodeId
    );
    this._canvas.remove(circle);
  }

  public clearAllOutputs = () => {
    this.outputs = [];
  };
}

export default Output;
