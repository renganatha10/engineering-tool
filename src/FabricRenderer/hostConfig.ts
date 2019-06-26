import { fabric } from 'fabric';
import uuid from 'uuid/v1';
//@ts-ignore
import shallowEqual from 'shallow-equal/objects';

declare global {
  interface Window {
    fabricElement: fabric.Canvas;
  }
}

const groups: any = [];

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type: any, props: any) => {
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  },
  createInstance: (type: any, newProps: any) => {
    if (type === 'rect') {
      const rect = new fabric.Rect({
        stroke: 'black',
        fill: 'transparent',
        ...newProps,
        originX: 'center',
        originY: 'center',
      });
      return rect;
    } else if (type === 'circle') {
      const circle = new fabric.Circle({
        radius: 100,
        name: 'input',
        originX: 'center',
        originY: 'center',
      });
      return circle;
    } else if (type === 'g') {
      return {
        type: 'group',
        options: {
          top: 100,
          left: 530,
          onMoving: newProps.onMoving ? newProps.onMoving : null,
        },
        id: uuid(),
      };
    } else if (type === 'text') {
      return new fabric.Text('name', {
        fontSize: 20,
        originX: 'center',
        originY: 'center',
        fill: '#fff',
      });
    }

    return type;
  },
  appendInitialChild(parent: any, child: any) {
    if (parent && parent.type === 'group') {
      groups.push({ id: parent.id, ...parent.options, child });
    } else {
      if (child && child.type === 'group') {
        const groupChildren = groups
          .filter((group: any) => group.id === child.id)
          .map((item: any) => item.child);
        const newGroup = new fabric.Group(groupChildren, {
          ...child.options,
        });
        window.fabricElement.add(newGroup);
        if (child.options && child.options.onMoving) {
          newGroup.on('moving', child.options.onMoving);
        }
      } else {
        window.fabricElement.add(child);
      }
    }
  },
  appendChild() {},
  createTextInstance: (text: string) => {
    return document.createTextNode(text);
  },
  finalizeInitialChildren: () => {
    return false;
  },
  supportsMutation: true,
  prepareUpdate() {
    return true;
  },
  appendChildToContainer: () => {},
  commitUpdate(
    instance: any,
    updatePayload: any,
    type: any,
    oldProps: any,
    newProps: any
  ) {
    if (!shallowEqual(oldProps, newProps)) {
      Object.keys(newProps).forEach(propName => {
        if (propName !== 'children') {
          if (oldProps[propName] !== newProps[propName]) {
            const propValue = newProps[propName];
            instance && instance.set && instance.set(propName, propValue);
            window.fabricElement.requestRenderAll();
          }
        }
      });
    }
  },
  commitTextUpdate() {},
  removeChild() {},
};

export default hostConfig;
