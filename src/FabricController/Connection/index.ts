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

  public loadFromLocal = (option: fabric.ILineOptions) => {
    const { x1, x2, y1, y2 } = option;
    const line = new CurvedLine(
      { left: x1, top: y1 },
      { left: x2, top: y2 },
      option
    );
    this._canvas.add(line);
    this.connections.push(line);
  };

  public makeConnection(line: fabric.Line, toData: ToData, isLoaded: false) {
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
    } = line;

    if (!isLoaded) {
      eventEmitter.emit('ADD_NODE', {
        id,
        name: 'Line',
        position: { x1, y1, y2, x2, type: 'Line' },
        isDevice: false,
        subType: '',
        type: 'Line',
        data: { ...data, ...toData, type: 'Line' },
      });
    }

    this.connections.push(line);
    this._currentLine = null;
  }

  public clearAllConnections = () => {
    this.connections = [];
  };
}

export default Connection;
