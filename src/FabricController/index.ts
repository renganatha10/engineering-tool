import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import Node from './Node';
import Input from './Input';
import Output from './Output';
import Connection from './Connection';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
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
    this._canvas.on('mouse:up', this.onCanvasMouseUp);
    this._canvas.on('mouse:down', this.onCanvasMouseDown);
    this._addGrids();
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

  public addNodes = (func: FunctionType) => {
    const { id, name, numberOfInputs, numberOfOutputs } = func;
    const groupId = uuid();
    this.addInputs(numberOfInputs, groupId);
    this.addOutputs(numberOfOutputs, groupId);
    this._nodeController.add({
      name,
      data: { id, nodeId: groupId },
    });
  };

  public addInputs = (numberOfInputs: number, groupId: string) => {
    const inputVarient = 100 / numberOfInputs;

    Array.from(Array(numberOfInputs)).forEach((_, index) => {
      const y1 = 100 - inputVarient * (index + 1) + 20;
      this._inputController.add({
        radius: 5,
        top: 100 + y1,
        left: 530 - 5,
        data: {
          index,
          nodeId: uuid(),
          groupId,
          y1Factor: y1,
        },
        name: 'input',
        selectable: false,
      });
    });
  };

  public addOutputs = (numberOfOutputs: number, groupId: string) => {
    const outPutVarient = 100 / numberOfOutputs;
    Array.from(Array(numberOfOutputs)).forEach((_, index) => {
      const y1 = 100 - outPutVarient * (index + 1) + 20;
      this._outputController.add({
        radius: 5,
        top: 100 + y1,
        left: 530 + RECT_SIZE,
        originX: 'center',
        originY: 'center',
        data: {
          index,
          nodeId: uuid(),
          groupId,
          y1Factor: y1,
        },
        selectable: false,
        name: 'output',
      });
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
            this._connectionController.makeConnection(line, {
              toGroupId: groupId,
              toNodeId: nodeId,
              toIndex: index,
            });
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
