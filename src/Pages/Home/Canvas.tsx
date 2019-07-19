import React, { Component } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import FabricCanvas from '../../FabricController';

import { Function } from '../../Contexts/FunctionsStoreContext';
import PagesStore, { CanvasObject } from './../../MobxStore/pages';
import DeviceStore from './../../MobxStore/deviceStore';

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

type DraggbleItemType = 'func' | 'device' | 'timer';

interface Props {
  functions: Function[];
  // devices: Device[];
}

interface CanvasRendererProps extends Props {
  pages: typeof PagesStore.Type;
  devices: typeof DeviceStore.Type;
}

interface State {
  prevPageId: string;
  modalVisible: boolean;
  timerValue: number;
  timerCanvasObject: any;
  timerTarget: any;
  canvas: any;
}

interface Position {
  x: number;
  y: number;
}

interface SourcePosition extends Position {
  type: 'Input' | 'Output';
}

interface NodePosition extends Position {
  scale: number;
  type: 'Node';
}

interface NodeMovedObject {
  id: string;
  position: NodePosition | SourcePosition;
}

class CanvasRenderer extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      prevPageId: '',
      modalVisible: false,
      timerValue: 0,
      timerCanvasObject: '',
      timerTarget: '',
      canvas: '',
    };
  }
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
    eventEmitter.on('TIMER_CLICK', this.onTimerClicked);
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

  public toggleModal = () => {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  };

  public onTimerClicked = (
    nodeId: string,
    target: any,
    canvas: fabric.Canvas
  ) => {
    const { pages } = this.injected;
    const { currentPageId } = pages;

    if (currentPageId) {
      const currentPageCanvasObjects = currentPageId.canvasObjects;

      const canvasObject = currentPageCanvasObjects.find(
        item => item.id === nodeId
      );
      if (canvasObject) {
        this.toggleModal();
        this.setState({
          timerCanvasObject: canvasObject,
          timerTarget: target,
          canvas: canvas,
          timerValue: canvasObject.timerValue,
        });
      }
    }
  };

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
    const { functions } = this.props;
    const { devices } = this.injected;
    const id = e.dataTransfer.getData('id');
    const type = e.dataTransfer.getData('type') as DraggbleItemType;

    const isDevice = type === 'device';
    const isTimer = type === 'timer';
    const timerValue = 0;

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
            scale: 1,
            type: 'Node',
          },
          isDevice,
          isTimer,
          timerValue
        );
      }
    } else if (type === 'timer') {
      const modifiedFunctions = {
        name: 'Timer' + ' ' + timerValue.toString() + 's',
        numberOfInputs: 1,
        numberOfOutputs: 1,
        id: id,
      };
      this.fabricCanvas.addNodes(
        modifiedFunctions,
        {
          x: e.pageX,
          y: e.pageY,
          scale: 1,
          type: 'Node',
        },
        isDevice,
        isTimer,
        timerValue
      );
    } else {
      const subType = e.dataTransfer.getData('subType');
      if (subType === 'Basic') {
        const droppedDevice = devices.basicDevices
          .toJSON()
          .find(func => func.id === id);
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
              scale: 1,
              type: 'Node',
            },
            isDevice,
            isTimer,
            timerValue
          );
        }
      } else if (subType === 'Complex') {
        const droppedDevice = devices.complexDevices
          .toJSON()
          .find(func => func.id === id);
        if (droppedDevice) {
          let xPos = e.pageX;
          let yPos = e.pageY;
          droppedDevice.basicDevices.forEach(device => {
            if (device) {
              const modifiedResponse = {
                id: device.id,
                name: device.name,
                numberOfInputs: device.inputs.length,
                numberOfOutputs: device.outputs.length,
              };

              this.fabricCanvas.addNodes(
                modifiedResponse,
                {
                  x: xPos,
                  y: yPos,
                  scale: 1,
                  type: 'Node',
                },
                isDevice,
                isTimer,
                timerValue
              );
              xPos = xPos + 200;
            }
          });
        }
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

  public handleChange = (event: any) => {
    const { value } = event.target;
    if (value) {
      this.setState({ timerValue: parseInt(value) });
    }
  };

  public handleSubmit = (event: any) => {
    const { timerValue, timerCanvasObject, timerTarget, canvas } = this.state;

    this.toggleModal();
    event.preventDefault();

    timerCanvasObject.updateTimerValue(timerValue);
    timerTarget.set('text', 'Timer ' + timerValue.toString() + 's');
    canvas.renderAll();
  };

  public render() {
    const { pages } = this.injected;
    const { currentPageId } = pages;
    const { modalVisible } = this.state;

    return (
      <div>
        <Modal
          title="Change Timer Value"
          visible={modalVisible}
          okText="Change"
          width={800}
          onCancel={this.toggleModal}
          onOk={this.handleSubmit}
        >
          <form>
            <label>
              Timer Value:
              <input
                type="number"
                value={this.state.timerValue}
                onChange={this.handleChange}
              />
            </label>
          </form>
        </Modal>
        <CanvasWrapper onDragOver={this.onDragOver} onDrop={this.onDrop}>
          <InvisibleDiv>{currentPageId ? currentPageId.id : ''}</InvisibleDiv>
          <canvas id="c" width="2000" height="1300" />
        </CanvasWrapper>
      </div>
    );
  }
}

export default inject('pages', 'devices')(observer(CanvasRenderer));
