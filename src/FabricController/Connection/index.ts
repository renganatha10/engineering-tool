import { fabric } from 'fabric';

import eventEmitter from '../../utils/eventListener';

import CurvedLine from './CurvedLink';

interface Port {
  left: number;
  top: number;
}

interface ToData {
  toGroupId: string;
  toNodeId: string;
  toIndex: number;
}

class Connection {
  public connections: fabric.Line[];
  private _canvas: fabric.Canvas;
  private _currentLine: fabric.Line | null;

  public constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.connections = [];
    this._currentLine = null;
  }

  public get currentLine() {
    return this._currentLine;
  }

  public add(fromPort: Port, toPort: Port, options: fabric.ILineOptions) {
    const line = new CurvedLine(fromPort, toPort, options);
    this._currentLine = line;
    this._canvas.add(line);
  }

  public remove(line: fabric.Line) {
    this._canvas.remove(line);
    this.connections = this.connections.filter(
      connection => connection.data.id !== line.data.id
    );

    this._currentLine = null;
  }

  public makeConnection(line: fabric.Line, toData: ToData) {
    const { data } = line;
    line.set({
      data: {
        ...data,
        ...toData,
      },
    });

    const {
      data: { id },
      x1,
      x2,
      y1,
      y2,
      name,
    } = line;

    eventEmitter.emit('LINE_CREATED', {
      id,
      name,
      position: { x1, y1, y2, x2 },
      isDevice: false,
      type: 'Line',
      data,
    });

    this.connections.push(line);
    this._currentLine = null;
  }
}

export default Connection;
