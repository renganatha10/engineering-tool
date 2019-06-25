import React, { PureComponent } from 'react';
import { fabric } from 'fabric';
import uuid from 'uuid/v1';
import CurvedLink from './Links/CurvedLink';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

const RECT_SIZE = 120;

class TypesCreation extends PureComponent<{}> {
  //@ts-ignore
  public canvas: fabric.Canvas;
  //@ts-ignore
  public line: null | fabric.Line;

  public lines: fabric.Line[] = [];

  public componentDidMount() {
    // this.canvas = new fabric.Canvas('c', { selection: false });
    // this.canvas.on('mouse:up', this.onMouseUp);
    // this.canvas.on('mouse:down', this.onMouseDown);
    // this._addGrids();
  }

  public onMouseUp = (option: fabric.IEvent) => {
    document.removeEventListener('mousemove', this.onCircleMouseMove);
    if (option.target) {
      if (!(option.target.name === 'input')) {
        if (this.line) {
          this.removeLine(this.line);
        }
      } else {
        if (this.line) {
          const { groupId, nodeId, index } = option.target.data;
          const fromData = this.line.data;

          if (fromData.fromGroupId === groupId) {
            this.removeLine(this.line);
          } else {
            this.line.set({
              data: {
                ...fromData,
                toGroupId: groupId,
                toNodeId: nodeId,
                toIndex: index,
              },
            });

            this.lines.push(this.line);
          }
        }
      }
    } else {
      if (this.line) {
        this.removeLine(this.line);
      }
    }

    this.line = null;
  };

  public onMouseDown = (option: fabric.IEvent) => {
    if (option.target) {
      if (option.target.name === 'output') {
        const { left, top, width, height } = option.target;

        const { nodeId, groupId, index } = option.target.data;

        if (left && top && width && height) {
          const fromPort = { left, top };
          const toPort = { left, top };
          this.line = new CurvedLink(fromPort, toPort, {
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
            },
          });
          this.line && this.canvas.add(this.line);
          document.addEventListener('mousemove', this.onCircleMouseMove);
        }
      }
    }
  };

  public onCircleMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    if (this.line) {
      this.line.bringToFront();
      this.line.set({ x2: pageX, y2: pageY });
    }
  };

  public _addGrids = () => {
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
      this.canvas && this.canvas.add(fhorizontal);
      this.canvas && this.canvas.add(shorizontal);
      const fvertical = new fabric.Line(
        [-width, distance - width, width, distance - width],
        lineOptions
      );
      const svertical = new fabric.Line(
        [-width, distance, width, distance],
        lineOptions
      );
      this.canvas && this.canvas.add(fvertical);
      this.canvas && this.canvas.add(svertical);
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

  public onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    this.addFunctionNode({
      id,
      name: 'Random',
      numberOfInputs: 2,
      numberOfOutputs: 1,
    });
  };

  public addFunctionNode = (func: FunctionType) => {
    const { id, name, numberOfInputs, numberOfOutputs } = func;

    const inputVarient = 100 / func.numberOfInputs;
    const outPutVarient = 100 / func.numberOfOutputs;

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

    const inputCircles: fabric.Circle[] = [];
    const outputCircles: fabric.Circle[] = [];

    const groupId = uuid();

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

      inputCircles.push(circle);
    });

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
      outputCircles.push(circle);
    });

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

    group.on('moving', option => {
      if (option.target) {
        const { target } = option;
        const { inputCircles, outputCircles, nodeId } = option.target.data as {
          inputCircles: fabric.Circle[];
          outputCircles: fabric.Circle[];
          nodeId: string;
        };

        const fromLines = this.lines.filter(
          line => line.data.fromGroupId === nodeId
        );

        const toLines = this.lines.filter(
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
    });

    group.on('moved', () => {
      this.canvas.remove(...inputCircles, ...outputCircles);
      inputCircles.forEach(circle => this.canvas.add(circle));
      outputCircles.forEach(circle => this.canvas.add(circle));
    });

    this.canvas.add(group);
    inputCircles.forEach(circle => this.canvas.add(circle));
    outputCircles.forEach(circle => this.canvas.add(circle));
  };

  public onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  public _getInputOutPutXY = (
    rectX: number,
    rectY: number,
    y1Factor: number
  ) => {
    return {
      left: rectX,
      top: rectY + y1Factor,
    };
  };

  public removeLine = (line: fabric.Line) => {
    this.canvas.remove(line);
  };

  public render() {
    return (
      <div onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <canvas id="c" width="2000" height="1300" />
      </div>
    );
  }
}

export default TypesCreation;
