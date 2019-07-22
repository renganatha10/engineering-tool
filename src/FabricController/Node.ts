import { fabric } from 'fabric';

import eventEmitter from '../utils/eventListener';

import { CanvasNodeData } from '../MobxStore/pages';

import Input from './Source/Input';
import Output from './Source/Output';
import Connection from './Connection';

const RECT_SIZE = 120;

interface AddArgs {
  name: string;
  data: typeof CanvasNodeData.Type;
  position: PositionType;
  isDevice: boolean;
  subType?: string;
  isTimer: boolean;
  timerValue: number;
  isLoaded: boolean;
}

interface PositionType {
  x: number;
  y: number;
  scale: number;
}

interface AddToGroupArgs {
  nodes: fabric.Object[];
  x: number;
  y: number;
  scale: number;
  data: any;
  isTimer: boolean;
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
  public add({
    name,
    data,
    position,
    isDevice,
    isTimer,
    timerValue,
    isLoaded,
    subType,
  }: AddArgs) {
    const rect = new fabric.Rect({
      stroke: isDevice ? 'transparent' : 'black',
      fill: 'transparent',
      height: RECT_SIZE,
      width: RECT_SIZE,
      originX: 'center',
      originY: 'center',
    });

    const rectTimer = new fabric.Rect({
      fill: 'lightgreen',
      height: 20,
      width: 50,
      top: 25,
      originX: 'center',
      originY: 'top',
    });

    const text = new fabric.Text(name, {
      fontSize: 20,
      top: isDevice ? -(RECT_SIZE / 2) + 10 : 0,
      left: 0,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    const { x, y, scale } = position;

    if (!isLoaded) {
      eventEmitter.emit('ADD_NODE', {
        id: data.nodeId,
        name,
        position,
        data,
        isDevice,
        isTimer,
        timerValue,
        type: 'Node',
      });
    }

    if (isDevice) {
      let type =
        subType === 'Basic'
          ? 'motor'
          : subType === 'Complex'
          ? 'complex'
          : 'plant';
      fabric.Image.fromURL(
        `assets/${type}.png`,
        image => {
          const nodes = [rect, image, text];
          this._addToGroup({ nodes, x, scale, y, data, isTimer });
        },
        {
          top: 20,
          originX: 'center',
          originY: 'center',
          scaleX: (RECT_SIZE - 20) / 512,
          scaleY: (RECT_SIZE - 20) / 512,
        }
      );
    } else if (isTimer) {
      const nodes = [rect, text, rectTimer];
      this._addToGroup({ nodes, x, y, scale, data, isTimer });
    } else {
      const nodes = [rect, text];
      this._addToGroup({ nodes, x, y, scale, data, isTimer });
    }
  }

  private _addToGroup = ({
    nodes,
    x,
    y,
    scale,
    data,
    isTimer,
  }: AddToGroupArgs) => {
    const group = new fabric.Group(nodes, {
      left: x,
      top: y,
      data,
      name: 'functionBlock',
      hasControls: true,
      hasRotatingPoint: false,
      lockUniScaling: true,
      hasBorders: false,
      subTargetCheck: true,
      cornerColor: `#081000`,
      selectable: true,
      scaleX: scale,
      scaleY: scale,
    });

    this._nodes.push(group);
    this._canvas.add(group);

    group.on('moving', this.onNodeMoving);
    group.on('mousedblclick', this.onNodeDoubleClick);
    group.on('moved', this.onMoved);
    group.on('scaling', this.onNodeMoving);
    group.on('scaled', this.onMoved);
    if (isTimer) {
      group.on('mousedown', this.onTimerClick);
    }
  };

  public onTimerClick = (option: fabric.IEvent) => {
    if (option.subTargets && option.target) {
      const subTarget = option.subTargets[0];
      //@ts-ignore
      const targets = option.target.getObjects();
      if (subTarget === targets[2]) {
        eventEmitter.emit(
          'TIMER_CLICK',
          option.target.data.nodeId,
          targets[1],
          this._canvas
        );
      }
    }
  };

  public onMoved = (option: fabric.IEvent) => {
    if (option.target) {
      const canvasObjects = [];

      const {
        data: { nodeId },
        left,
        top,
        scaleX,
      } = option.target;

      canvasObjects.push({
        id: nodeId,
        position: {
          x: left,
          y: top,
          scale: scaleX ? scaleX : 1,
          type: 'Node',
        },
      });

      const { fromLines, toLines } = this.getLines(nodeId);
      const { inputCircles, outputCircles } = this.getInputOutputCircles(
        nodeId
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
    group.on('scaling', this.onNodeMoving);
    group.on('scaled', this.onMoved);
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
      const { fromLines, toLines } = this.getLines(nodeId);
      const { inputCircles, outputCircles } = this.getInputOutputCircles(
        nodeId
      );

      inputCircles.forEach(circle => {
        const { y1Factor, nodeId } = circle.data;
        const y1 = target.scaleY ? y1Factor * target.scaleY : y1Factor;
        const { left, top } = this._getInputOutPutXY(
          target.left ? target.left : 0,
          target.top ? target.top : 0,
          y1
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
        const width = target.scaleX ? RECT_SIZE * target.scaleX : RECT_SIZE;
        const y1 = target.scaleY ? y1Factor * target.scaleY : y1Factor;

        const { left, top } = this._getInputOutPutXY(
          target.left ? target.left + width : width,
          target.top ? target.top : 0,
          y1
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
      const canvasObjectIds = [];
      const selectedNode = this._nodes.find(
        node => node.data.nodeId === this.selectedNodeId
      );

      if (selectedNode) {
        canvasObjectIds.push(this.selectedNodeId);
        this.remove(selectedNode);
      }

      const { fromLines, toLines } = this.getLines(this.selectedNodeId);
      const { inputCircles, outputCircles } = this.getInputOutputCircles(
        this.selectedNodeId
      );

      fromLines.forEach(line => {
        canvasObjectIds.push(line.data.id);
        this._connection.remove(line);
      });

      toLines.forEach(line => {
        canvasObjectIds.push(line.data.id);
        this._connection.remove(line);
      });

      inputCircles.forEach(line => {
        canvasObjectIds.push(line.data.nodeId);
        this._input.remove(line);
      });

      outputCircles.forEach(line => {
        canvasObjectIds.push(line.data.nodeId);
        this._output.remove(line);
      });
      this.selectedNodeId = '';

      eventEmitter.emit('NODE_DELETED', canvasObjectIds);
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

  private getLines = (nodeId: string) => {
    const fromLines = this._connection.connections.filter(
      line => line.data.fromGroupId === nodeId
    );

    const toLines = this._connection.connections.filter(
      line => line.data.toGroupId === nodeId
    );

    return { fromLines, toLines };
  };

  private getInputOutputCircles = (nodeId: string) => {
    const inputCircles = this._input.inputs.filter(
      input => input.data.groupId === nodeId
    );

    const outputCircles = this._output.outputs.filter(
      output => output.data.groupId === nodeId
    );

    return { inputCircles, outputCircles };
  };
}

export default Node;
