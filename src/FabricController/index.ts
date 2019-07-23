import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import {
  CanvasObject,
  CanvasNodeData,
  CanvasNodePosition,
  CanvasLinePosition,
} from '../MobxStore/pages';
import Node from './Node';
import Input from './Source/Input';
import Output from './Source/Output';
import Connection from './Connection';

export interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface PositionType {
  x: number;
  y: number;
  type: string;
  scale: number;
}

const RECT_SIZE = 120;

class FabricController {
  //@ts-ignore
  private _canvas: fabric.Canvas;
  //@ts-ignore
  private _nodeController: Node;
  //@ts-ignore
  private _inputController: Input;
  //@ts-ignore
  private _outputController: Output;
  //@ts-ignore
  private _connectionController: Connection;

  public init() {
    this._canvas = new fabric.Canvas('c', { selection: false });
    this._addGrids();
    this._canvas.on('mouse:up', this.onCanvasMouseUp);
    this._canvas.on('mouse:down', this.onCanvasMouseDown);
    this._inputController = new Input(this._canvas);
    this._outputController = new Output(this._canvas);
    this._connectionController = new Connection(this._canvas);
    this._nodeController = new Node(
      this._canvas,
      this._inputController,
      this._outputController,
      this._connectionController
    );
  }

  public loadFromSavedCanvasObjects = (
    canvasObjects: typeof CanvasObject.Type[]
  ) => {
    this._canvas.clear();
    this._nodeController.clearAllNodes();
    this._outputController.clearAllOutputs();
    this._inputController.clearAllInputs();
    this._connectionController.clearAllConnections();
    this._addGrids();
    canvasObjects.forEach(object => {
      if (object.type === 'Node') {
        const { name, data, position, isDevice, subType, isTimer } = object;
        const canvasNodeData = data as typeof CanvasNodeData.Type;
        const canvasPosition = position as typeof CanvasNodePosition.Type;
        this._nodeController.add({
          name,
          data: canvasNodeData,
          position: canvasPosition,
          isDevice,
          isTimer,
          timerValue: 0,
          isLoaded: true,
          subType,
        });
      } else if (object.type === 'Input') {
        const { name, data, position } = object;
        const canvasPosition = position as typeof CanvasNodePosition.Type;
        this._inputController.add(
          {
            radius: 5,
            fill: 'green',
            name,
            left: canvasPosition.x,
            top: canvasPosition.y,
            data,
            selectable: false,
          },
          true
        );
      } else if (object.type === 'Output') {
        const { name, data, position } = object;
        const canvasPosition = position as typeof CanvasNodePosition.Type;
        this._outputController.add(
          {
            radius: 5,
            fill: 'red',
            name,
            left: canvasPosition.x,
            top: canvasPosition.y,
            data,
            selectable: false,
          },
          true
        );
      } else if (object.type === 'Line') {
        const { name, data, position } = object;
        const { x1, x2, y1, y2 } = position as typeof CanvasLinePosition.Type;
        this._connectionController.loadFromLocal({
          fill: '#999999',
          stroke: '#999999',
          originX: 'center',
          originY: 'center',
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          x1,
          x2,
          y1,
          y2,
          data,
          name,
        });
      }
    });
  };

  public getCanvas = () => this._canvas;

  public addNodes = (
    func: FunctionType,
    position: PositionType,
    isDevice: boolean,
    isTimer: boolean,
    timerValue: number,
    subType: string
  ) => {
    const { id, name, numberOfInputs, numberOfOutputs } = func;
    const groupId = uuid();
    this.addInputs(numberOfInputs, groupId, position);
    this.addOutputs(numberOfOutputs, groupId, position);
    this._nodeController.add({
      name,
      data: {
        type: 'Node',
        id,
        nodeId: groupId,
        numberOfInputs,
        numberOfOutputs,
      },
      position,
      isDevice,
      subType,
      isTimer,
      timerValue,
      isLoaded: false,
    });
  };

  public addInputs = (
    numberOfInputs: number,
    groupId: string,
    position: PositionType
  ) => {
    const { x, y, scale } = position;
    const inputVarient = 100 / numberOfInputs;

    Array.from(Array(numberOfInputs)).forEach((_, index) => {
      const y1 = 100 - inputVarient * (index + 1) + 20;
      this._inputController.add(
        {
          radius: 5,
          top: y + y1 * scale,
          left: x - 5,
          fill: 'green',
          data: {
            index,
            nodeId: uuid(),
            groupId,
            y1Factor: y1,
            type: 'Input',
          },
          name: 'input',
          selectable: false,
        },
        false
      );
    });
  };

  public addOutputs = (
    numberOfOutputs: number,
    groupId: string,
    position: PositionType
  ) => {
    const { x, y, scale } = position;
    const outPutVarient = 100 / numberOfOutputs;
    Array.from(Array(numberOfOutputs)).forEach((_, index) => {
      const y1 = 100 - outPutVarient * (index + 1) + 20;
      this._outputController.add(
        {
          radius: 5,
          top: y + y1 * scale,
          left: x + RECT_SIZE * scale,
          originX: 'center',
          originY: 'center',
          fill: 'red',
          data: {
            index,
            nodeId: uuid(),
            groupId,
            y1Factor: y1,
            type: 'Output',
          },
          selectable: false,
          name: 'output',
        },
        false
      );
    });
  };

  public onCanvasMouseDown = (option: fabric.IEvent) => {
    if (option.target) {
      if (option.target.name === 'output') {
        const { left, top, width, height } = option.target;
        const { nodeId, groupId, index } = option.target.data;
        if (left && top && width && height) {
          const fromPort = { left, top };
          const toPort = { left, top };
          const lineId = uuid();
          this._connectionController.add(fromPort, toPort, {
            fill: '#999999',
            stroke: '#999999',
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            data: {
              fromNodeId: nodeId,
              fromGroupId: groupId,
              fromIndex: index,
              id: lineId,
            },
          });

          document.addEventListener('mousemove', this.onDocumentMouseMove);
        }
      }
    }
  };

  public onCanvasMouseUp = (option: fabric.IEvent) => {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);

    const line = this._connectionController.currentLine;
    if (option.target) {
      if (!(option.target.name === 'input')) {
        if (line) {
          this._connectionController.remove(line);
        }
      } else {
        if (line) {
          const { groupId, nodeId, index } = option.target.data;
          const fromData = line.data;

          if (fromData.fromGroupId === groupId) {
            this._connectionController.remove(line);
          } else {
            this._connectionController.makeConnection(
              line,
              {
                toGroupId: groupId,
                toNodeId: nodeId,
                toIndex: index,
              },
              false
            );
          }
        }
      }
    } else {
      if (line) {
        this._connectionController.remove(line);
      }
    }
  };

  public onDocumentMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const line = this._connectionController.currentLine;
    if (line) {
      line.bringToFront();
      line.set({ x2: pageX, y2: pageY });
    }
  };

  private _addGrids = () => {
    const width = 2000;
    const gridLength = width / 50;
    const lineOptions = {
      stroke: '#ebebeb',
      // strokeWidth: 1,
      selectable: false,
      evented: false,
      id: 'grid',
    };
    for (let i = 0; i < gridLength; i++) {
      const distance = i * 50;
      const fhorizontal = new fabric.Line(
        [distance, -width, distance, width],
        lineOptions
      );
      const shorizontal = new fabric.Line(
        [distance - width, -width, distance - width, width],
        lineOptions
      );
      this._canvas.add(fhorizontal);
      this._canvas.add(shorizontal);
      const fvertical = new fabric.Line(
        [-width, distance - width, width, distance - width],
        lineOptions
      );
      const svertical = new fabric.Line(
        [-width, distance, width, distance],
        lineOptions
      );
      this._canvas.add(fvertical);
      this._canvas.add(svertical);
      if (i % 5 === 0) {
        fhorizontal.set({ stroke: '#cccccc' });
        shorizontal.set({ stroke: '#cccccc' });
        fvertical.set({
          stroke: '#cccccc',
          top: fvertical ? fvertical.top : 0 + 10,
        });
        svertical.set({
          stroke: '#cccccc',
          top: svertical ? svertical.top : 0 + 10,
        });
      } else {
        fvertical.set({ top: fvertical ? fvertical.top : 0 + 10 });
        svertical.set({ top: svertical ? svertical.top : 0 + 10 });
      }
    }
  };
}

export default FabricController;
