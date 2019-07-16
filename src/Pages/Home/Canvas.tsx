import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import FabricCanvas from '../../FabricController';

import { Device } from '../../Contexts/DevicesContext';
import { Function } from '../../Contexts/FunctionsStoreContext';
import PagesStore, { CanvasObject } from './../../MobxStore/pages';

import eventEmitter from './../../utils/eventListener';

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  overflow: scroll;
  background-color: #8bc34a1c;
`;

const InvisibleDiv = styled.div`
  display: none;
`;

type DraggbleItemType = 'func' | 'device';

interface Props {
  functions: Function[];
  devices: Device[];
}

interface CanvasRendererProps extends Props {
  pages: typeof PagesStore.Type;
}

interface State {
  prevPageId: string;
}

interface NodeMovedObject {
  id: string;
  position: {
    x: number;
    y: number;
    type: 'Input' | 'Output' | 'Node';
  };
}

class CanvasRenderer extends Component<Props, State> {
  public fabricCanvas = new FabricCanvas();
  public previousPageId = '';

  public get injected() {
    return this.props as CanvasRendererProps;
  }

  public componentDidMount() {
    const {
      pages: { currentPageId },
    } = this.injected;
    this.fabricCanvas.init();

    if (currentPageId) {
      this.previousPageId = currentPageId.id;
      const loadedCanvasObjects = currentPageId.canvasObjects.toJS();
      this.fabricCanvas.loadFromSavedCanvasObjects(loadedCanvasObjects);
    }
    eventEmitter.on('ADD_NODE', this.onAddNode);
    eventEmitter.on('NODE_MOVED', this.onNodeMoved);
    eventEmitter.on('NODE_DELETED', this.onNodeDeleted);
  }

  public componentDidUpdate() {
    const { pages } = this.props as CanvasRendererProps;
    const { currentPageId } = pages;

    if (currentPageId) {
      if (currentPageId.id !== this.previousPageId) {
        this.previousPageId = currentPageId.id;
        const loadedCanvasObjects = currentPageId.canvasObjects.toJS();
        this.fabricCanvas.loadFromSavedCanvasObjects(loadedCanvasObjects);
      }
    }
  }

  public onNodeDeleted = (nodeIds: string[]) => {
    const { pages } = this.props as CanvasRendererProps;
    const { currentPageId } = pages;

    if (currentPageId) {
      nodeIds.forEach(nodeId => {
        currentPageId.deleteCanvasObject(nodeId);
      });
    }
  };

  public onNodeMoved = (nodes: NodeMovedObject[]) => {
    const { pages } = this.injected;
    const { currentPageId } = pages;

    if (currentPageId) {
      const currentPageCanvasObjects = currentPageId.canvasObjects;

      nodes.forEach(node => {
        const canvasObject = currentPageCanvasObjects.find(
          item => item.id === node.id
        );
        if (canvasObject) {
          canvasObject.updateCanvasPosition(node.position);
        }
      });
    }
  };

  public onAddNode = (node: typeof CanvasObject.Type) => {
    const { pages } = this.injected;
    const { currentPageId } = pages;
    currentPageId && currentPageId.addCanvasObject(node);
  };

  public onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { functions, devices } = this.props;
    const id = e.dataTransfer.getData('id');
    const type = e.dataTransfer.getData('type') as DraggbleItemType;

    const isDevice = type === 'device';

    if (type === 'func') {
      const droppedFunction = functions.find(func => func.id === id);
      if (droppedFunction) {
        const modifiedFunctions = {
          name: droppedFunction.name,
          numberOfInputs: droppedFunction.inputs.length,
          numberOfOutputs: droppedFunction.outputs.length,
          id: droppedFunction.id,
        };
        this.fabricCanvas.addNodes(
          modifiedFunctions,
          {
            x: e.pageX,
            y: e.pageY,
            type: 'Node',
          },
          isDevice
        );
      }
    } else {
      const droppedDevice = devices.find(func => func.id === id);
      if (droppedDevice) {
        const modifiedResponse = {
          id: droppedDevice.id,
          name: droppedDevice.name,
          numberOfInputs: droppedDevice.inputs.length,
          numberOfOutputs: droppedDevice.outputs.length,
        };

        this.fabricCanvas.addNodes(
          modifiedResponse,
          {
            x: e.pageX,
            y: e.pageY,
            type: 'Node',
          },
          isDevice
        );
      }
    }
  };

  public onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  public componentWillUnmount() {
    eventEmitter.off('ADD_NODE', this.onAddNode);
    eventEmitter.off('NODE_MOVED', this.onNodeMoved);
    eventEmitter.off('NODE_DELETED', this.onNodeDeleted);
  }

  public render() {
    const { pages } = this.injected;
    const { currentPageId } = pages;
    return (
      <CanvasWrapper onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <InvisibleDiv>{currentPageId ? currentPageId.id : ''}</InvisibleDiv>
        <canvas id="c" width="2000" height="1300" />
      </CanvasWrapper>
    );
  }
}

export default inject('pages')(observer(CanvasRenderer));
