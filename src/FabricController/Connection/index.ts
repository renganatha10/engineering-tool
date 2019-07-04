import { fabric } from 'fabric';
import CurvedLine from './CurvedLink';

interface Port {
  left: number;
  top: number;
}

interface FromData {
  fromNodeId: string;
  fromGroupId: string;
  fromIndex: number;
  id: string;
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
    // TODO: Remove from Connection List
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
    this.connections.push(line);
    this._currentLine = null;
  }
}

export default Connection;
