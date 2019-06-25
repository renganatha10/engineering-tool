import ReactReconciler from 'react-reconciler';
import { fabric } from 'fabric';
import hostConfig from './hostConfig';

//@ts-ignore
const CanvasRenderer = ReactReconciler(hostConfig);

const containers = new WeakMap();

export default {
  render: (
    element: React.ReactNode,
    canvas: HTMLElement | null,
    callback: any
  ) => {
    if (canvas) {
      let container;

      if (containers.has(canvas)) {
        container = containers.get(canvas);
      } else {
        container = CanvasRenderer.createContainer(canvas, false);
        containers.set(canvas, container);
        //@ts-ignore
        window.fabricElement = new fabric.Canvas('c', {
          selection: false,
        });
      }

      CanvasRenderer.updateContainer(element, container, null, callback);
    }
  },
};
