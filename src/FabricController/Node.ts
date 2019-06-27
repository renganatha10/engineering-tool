import { fabric } from 'fabric';

const RECT_SIZE = 120;

interface Nodedata {
  id: string;
  nodeId: string;
  outputCircles: fabric.Circle[];
  inputCircles: fabric.Circle[];
}

interface AddArgs {
  name: string;
  data: Nodedata;
}

class Node {
  private _canvas: fabric.Canvas;
  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
  }
  public add({ name, data }: AddArgs) {
    const rect = new fabric.Rect({
      stroke: 'black',
      fill: 'transparent',
      height: RECT_SIZE,
      width: RECT_SIZE,
      originX: 'center',
      originY: 'center',
    });

    const text = new fabric.Text(name, {
      fontSize: 20,
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([rect, text], {
      left: 530,
      top: 100,
      data,
      name: 'functionBlock',
      hasControls: false,
      hasBorders: false,
    });

    this._canvas.add(group);

    group.on('moving', this.onNodeMoving);
    group.on('moved', this.onNodeMoved);
  }

  public remove(group: fabric.Group) {
    group.off('moving', this.onNodeMoving);
    group.off('moved', this.onNodeMoved);
    this._canvas.remove(group);
  }

  public onNodeMoving() {}

  public onNodeMoved() {}
}

export default Node;
