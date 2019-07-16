import { fabric } from 'fabric';

import eventEmitter from '../utils/eventListener';

import Input from './Source/Input';
import Output from './Source/Output';
import Connection from './Connection';

const RECT_SIZE = 120;

interface Nodedata {
  id: string;
  nodeId: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  type: string;
}

interface AddArgs {
  name: string;
  data: Nodedata;
  position: PositionType;
  isDevice: boolean;
  isLoaded: boolean;
}
interface PositionType {
  x: number;
  y: number;
}

interface AddToGroupArgs {
  nodes: fabric.Object[];
  x: number;
  y: number;
  data: any;
}

class Node {
  private _canvas: fabric.Canvas;
  private _input: Input;
  private _output: Output;
  public _connection: Connection;
  public selectedNodeId: string;
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
    this.selectedNodeId = '';
    document.addEventListener('keydown', this.onKeyPress);
  }
  public add({ name, data, position, isDevice, isLoaded }: AddArgs) {
    const rect = new fabric.Rect({
      stroke: isDevice ? 'transparent' : 'black',
      fill: 'transparent',
      height: RECT_SIZE,
      width: RECT_SIZE,
      originX: 'center',
      originY: 'center',
    });

    const text = new fabric.Text(name, {
      fontSize: 20,
      top: isDevice ? -(RECT_SIZE / 2) + 10 : 0,
      left: 0,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    const { x, y } = position;

    if (!isLoaded) {
      eventEmitter.emit('ADD_NODE', {
        id: data.nodeId,
        name,
        position,
        data,
        isDevice,
        type: 'Node',
      });
    }

    if (isDevice) {
      fabric.Image.fromURL(
        'assets/motor.png',
        image => {
          const nodes = [rect, image, text];
          this._addToGroup({ nodes, x, y, data });
        },
        {
          top: 20,
          originX: 'center',
          originY: 'center',
          scaleX: (RECT_SIZE - 20) / 512,
          scaleY: (RECT_SIZE - 20) / 512,
        }
      );
    } else {
      const nodes = [rect, text];
      this._addToGroup({ nodes, x, y, data });
    }
  }

  private _addToGroup = ({ nodes, x, y, data }: AddToGroupArgs) => {
    const group = new fabric.Group(nodes, {
      left: x,
      top: y,
      data,
      name: 'functionBlock',
      hasControls: false,
      hasBorders: false,
      selectable: true,
    });

    this._nodes.push(group);
    this._canvas.add(group);

    group.on('moving', this.onNodeMoving);
    group.on('mousedblclick', this.onNodeDoubleClick);
    group.on('moved', this.onMoved);
  };

  public onMoved = (option: fabric.IEvent) => {
    if (option.target) {
      const canvasObjects = [];

      const {
        data: { nodeId },
        left,
        top,
      } = option.target;

      canvasObjects.push({
        id: nodeId,
        position: { x: left, y: top, type: 'Node' },
      });

      const inputCircles = this._input.inputs.filter(
        input => input.data.groupId === nodeId
      );

      inputCircles.forEach(circle => {
        const {
          data: { nodeId },
          left,
          top,
        } = circle;

        canvasObjects.push({
          id: nodeId,
          position: { x: left, y: top, type: 'Input' },
        });
      });

      const outputCircles = this._output.outputs.filter(
        output => output.data.groupId === nodeId
      );

      outputCircles.forEach(circle => {
        const {
          data: { nodeId },
          left,
          top,
        } = circle;

        canvasObjects.push({
          id: nodeId,
          position: { x: left, y: top, type: 'Input' },
        });
      });

      const fromLines = this._connection.connections.filter(
        line => line.data.fromGroupId === nodeId
      );
      const toLines = this._connection.connections.filter(
        line => line.data.toGroupId === nodeId
      );

      toLines.forEach(item => {
        const {
          data: { id },
          x1,
          x2,
          y1,
          y2,
        } = item;

        canvasObjects.push({
          id,
          position: { x1, x2, y1, y2, type: 'Line' },
        });
      });

      fromLines.forEach(item => {
        const {
          data: { id },
          x1,
          x2,
          y1,
          y2,
        } = item;

        canvasObjects.push({
          id,
          position: { x1, x2, y1, y2, type: 'Line' },
        });
      });

      eventEmitter.emit('NODE_MOVED', canvasObjects);
    }
  };

  public onNodeDoubleClick = (option: fabric.IEvent) => {
    if (option && option.target) {
      const { data } = option.target;
      this.selectedNodeId = data.nodeId;
      option.target.hasBorders = true;
      this._canvas.requestRenderAll();
    }
  };

  public remove(group: fabric.Group) {
    group.off('moving', this.onNodeMoving);
    group.off('mousedblclick', this.onNodeDoubleClick);
    group.off('moved', this.onMoved);
    this._nodes = this._nodes.filter(
      node => node.data.nodeId !== group.data.nodeId
    );
    this._canvas.remove(group);
  }

  public onNodeMoving = (option: fabric.IEvent) => {
    if (option.target) {
      const { target } = option;
      const { nodeId } = option.target.data as { nodeId: string };
      this._removeBorders();
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
        output => output.data.groupId === nodeId
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

  public onKeyPress = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === 'Backspace') {
      const selectedNode = this._nodes.find(
        node => node.data.nodeId === this.selectedNodeId
      );

      if (selectedNode) {
        this.remove(selectedNode);
      }

      const fromLines = this._connection.connections.filter(
        line => line.data.fromGroupId === this.selectedNodeId
      );

      fromLines.forEach(line => this._connection.remove(line));

      const toLines = this._connection.connections.filter(
        line => line.data.toGroupId === this.selectedNodeId
      );

      toLines.forEach(line => this._connection.remove(line));

      const inputCircles = this._input.inputs.filter(
        input => input.data.groupId === this.selectedNodeId
      );

      inputCircles.forEach(line => this._input.remove(line));

      const outputCircles = this._output.outputs.filter(
        output => output.data.groupId === this.selectedNodeId
      );

      outputCircles.forEach(line => this._output.remove(line));
      this.selectedNodeId = '';
    } else if (key === 'Escape') {
      this._removeBorders();
    }
  };

  public clearAllNodes = () => {
    this._nodes = [];
  };

  private _removeBorders = () => {
    const selectedNode = this._nodes.find(
      node => node.data.nodeId === this.selectedNodeId
    );

    if (selectedNode) {
      if (selectedNode.hasBorders) {
        selectedNode.hasBorders = false;
        this._canvas.requestRenderAll();
      }
    }

    this.selectedNodeId = '';
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
