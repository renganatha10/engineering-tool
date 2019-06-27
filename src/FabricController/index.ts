import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import CurvedLink from './Links/CurvedLink';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface NodeData {
  inputCircles: fabric.Circle[];
  outputCircles: fabric.Circle[];
  nodeId: string;
}

const RECT_SIZE = 120;

class FabricController {
  //@ts-ignore
  private _canvas: fabric.Canvas;
  private _nodes: fabric.Group[];
  private _lines: fabric.Line[];
  private _currentLine: null | fabric.Line;

  public constructor() {
    this._nodes = [];
    this._lines = [];
    this._currentLine = null;
  }

  public init() {
    this._canvas = new fabric.Canvas('c', { selection: false });
    this._canvas.on('mouse:up', this.onCanvasMouseUp);
    this._canvas.on('mouse:down', this.onCanvasMouseDown);
    this._addGrids();
  }

  public addNodes = (func: FunctionType) => {
    const { id, name, numberOfInputs, numberOfOutputs } = func;

    const groupId = uuid();

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

    const inputCircles = this.addInputs(numberOfInputs, groupId);
    const outputCircles = this.addOutputs(numberOfOutputs, groupId);

    const group = new fabric.Group([rect, text], {
      left: 530,
      top: 100,
      data: {
        id,
        nodeId: groupId,
        outputCircles,
        inputCircles,
      },
      name: 'functionBlock',
      hasControls: false,
      hasBorders: false,
    });

    group.on('moving', this.onNodeMoving);
    group.on('moved', this.onNodeMoved);

    this._nodes.push(group);
    this._canvas.add(group);
  };
  public removeNode = () => {};
  public addInputs = (numberOfInputs: number, groupId: string) => {
    const inputVarient = 100 / numberOfInputs;
    const inputCircles: fabric.Circle[] = [];
    Array.from(Array(numberOfInputs)).forEach((_, index) => {
      const y1 = 100 - inputVarient * (index + 1) + 20;

      const circle = new fabric.Circle({
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
      this._canvas.add(circle);
      inputCircles.push(circle);
    });

    return inputCircles;
  };
  public addOutputs = (numberOfOutputs: number, groupId: string) => {
    const outPutVarient = 100 / numberOfOutputs;
    const outputCircles: fabric.Circle[] = [];
    Array.from(Array(numberOfOutputs)).forEach((_, index) => {
      const y1 = 100 - outPutVarient * (index + 1) + 20;

      const circle = new fabric.Circle({
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
      this._canvas.add(circle);
      outputCircles.push(circle);
    });

    return outputCircles;
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

          const line = new CurvedLink(fromPort, toPort, {
            fill: '#999999',
            stroke: '#999999',
            class: 'line',
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
          this._currentLine = line;
          this._canvas.add(line);

          document.addEventListener('mousemove', this.onDocumentMouseMove);
        }
      }
    }
  };

  public onCanvasMouseUp = (option: fabric.IEvent) => {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);

    //eslint-disable-next-line

    const line = this._currentLine;
    if (option.target) {
      if (!(option.target.name === 'input')) {
        if (line) {
          this._removeLine(line);
        }
      } else {
        if (line) {
          const { groupId, nodeId, index } = option.target.data;
          const fromData = line.data;

          if (fromData.fromGroupId === groupId) {
            this._removeLine(line);
          } else {
            line.set({
              data: {
                ...fromData,
                toGroupId: groupId,
                toNodeId: nodeId,
                toIndex: index,
              },
            });
            this._lines.push(line);
          }
        }
      }
    } else {
      if (line) {
        this._removeLine(line);
      }
    }

    this._currentLine = null;
  };
  public onNodeMoving = (option: fabric.IEvent) => {
    if (option.target) {
      const { target } = option;
      const { inputCircles, outputCircles, nodeId } = option.target
        .data as NodeData;

      const fromLines = this._lines.filter(
        line => line.data.fromGroupId === nodeId
      );

      const toLines = this._lines.filter(
        line => line.data.toGroupId === nodeId
      );

      inputCircles.forEach(circle => {
        const { y1Factor, nodeId } = circle.data;
        const { left, top } = this._getInputOutPutXY(
          target.left ? target.left : 0,
          target.top ? target.top : 0,
          y1Factor
        );

        const toline = toLines.find(item => item.data.toNodeId === nodeId);

        toline && toline.set({ x2: left, y2: top });
        circle.set({ left: left - 5, top });
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
        fromLine && fromLine.set({ x1: left, y1: top });
        circle.set({ left, top });
      });
    }
  };

  public onNodeMoved = (option: fabric.IEvent) => {
    if (option.target) {
      const { inputCircles, outputCircles } = option.target.data as NodeData;
      this._canvas.remove(...inputCircles, ...outputCircles);
      inputCircles.forEach(circle => this._canvas.add(circle));
      outputCircles.forEach(circle => this._canvas.add(circle));
    }
  };

  public onDocumentMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    if (this._currentLine) {
      const line = this._currentLine;
      if (line) {
        line.bringToFront();
        line.set({ x2: pageX, y2: pageY });
      }
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

  private _removeLine = (line: fabric.Line) => {
    this._canvas.remove(line);
  };
}

export default FabricController;
