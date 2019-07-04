import React, { PureComponent } from 'react';
import styled from 'styled-components';

import FabricCanvas from './../../FabricController';

import { Device } from './../../Contexts/DevicesContext';
import { Function } from './../../Contexts/FunctionsStoreContext';

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  overflow: scroll;
  background-color: #8bc34a1c;
`;

type DraggbleItemType = 'func' | 'device';

interface Props {
  functions: Function[];
  devices: Device[];
}

class CanvasRenderer extends PureComponent<Props> {
  public fabricCanvas = new FabricCanvas();

  public componentDidMount() {
    this.fabricCanvas.init();
  }

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
          },
          isDevice
        );
      }
    }
  };

  public onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  public render() {
    return (
      <CanvasWrapper onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <canvas id="c" width="2000" height="1300" />
      </CanvasWrapper>
    );
  }
}

export default CanvasRenderer;
