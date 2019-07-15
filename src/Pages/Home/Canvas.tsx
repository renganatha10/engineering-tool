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
        this.fabricCanvas.addNodes(
          droppedDevice,
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
