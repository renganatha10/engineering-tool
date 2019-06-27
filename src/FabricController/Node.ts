import { fabric } from 'fabric';
import Input from './Input';
import Output from './Output';
import Connection from './Connection';

const RECT_SIZE = 120;

interface Nodedata {
  id: string;
  nodeId: string;
}

interface AddArgs {
  name: string;
  data: Nodedata;
}

class Node {
  private _canvas: fabric.Canvas;
  private _input: Input;
  private _output: Output;
  public _connection: Connection;
  private _nodes: fabric.Group[];
  public constructor(
    canvas: fabric.Canvas,
    input: Input,
    output: Output,
    connection: Connection
  ) {
    this._canvas = canvas;
    this._input = input;
    this._output = output;
    this._connection = connection;
    this._nodes = [];
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

    this._nodes.push(group);
    this._canvas.add(group);

    group.on('moving', this.onNodeMoving);
  }

  public remove(group: fabric.Group) {
    group.off('moving', this.onNodeMoving);

    // TODO: Remove from Node List
    this._canvas.remove(group);
  }

  public onNodeMoving = (option: fabric.IEvent) => {
    if (option.target) {
      const { target } = option;
      const { nodeId } = option.target.data as { nodeId: string };

      const fromLines = this._connection.connections.filter(
        line => line.data.fromGroupId === nodeId
      );

      const toLines = this._connection.connections.filter(
        line => line.data.toGroupId === nodeId
      );

      const inputCircles = this._input.inputs.filter(
        input => input.data.groupId === nodeId
      );

      const outputCircles = this._output.outputs.filter(
        input => input.data.groupId === nodeId
      );

      inputCircles.forEach(circle => {
        const { y1Factor, nodeId } = circle.data;
        const { left, top } = this._getInputOutPutXY(
          target.left ? target.left : 0,
          target.top ? target.top : 0,
          y1Factor
        );

        const toline = toLines.find(item => item.data.toNodeId === nodeId);
        if (toline) {
          toline.set({ x2: left, y2: top });
        }

        circle.set({ left: left - 5, top });
        circle.setCoords();
      });

      outputCircles.forEach(circle => {
        const { y1Factor, nodeId } = circle.data;

        const { left, top } = this._getInputOutPutXY(
          target.left ? target.left + RECT_SIZE : RECT_SIZE,
          target.top ? target.top : 0,
          y1Factor
        );

        const fromLine = fromLines.find(
          item => item.data.fromNodeId === nodeId
        );

        if (fromLine) {
          fromLine.set({ x1: left, y1: top });
        }

        circle.set({ left, top });
        circle.setCoords();
      });
    }
  };

  private _getInputOutPutXY = (
    rectX: number,
    rectY: number,
    y1Factor: number
  ) => {
    return {
      left: rectX,
      top: rectY + y1Factor,
    };
  };
}

export default Node;
