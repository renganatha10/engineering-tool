import { fabric } from 'fabric';

export interface ISource {
  add: (options: fabric.ICircleOptions, isLoaded: boolean) => void;
  onMouseOver: (option: fabric.IEvent) => void;
  onMouseOut: (option: fabric.IEvent) => void;
  remove: (circle: fabric.Circle) => void;
}
