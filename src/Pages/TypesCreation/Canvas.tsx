import React, { PureComponent } from 'react';
import styled from 'styled-components';

import {
  FunctionsContext,
  FunctionContextType,
} from '../../Contexts/FunctionsStoreContext';

import FabricCanvas from './../../FabricController';

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  overflow: scroll;
  background-color: #8bc34a1c;
`;

class TypesCreation extends PureComponent<{}> {
  public fabricCanvas = new FabricCanvas();

  public componentDidMount() {
    this.fabricCanvas.init();
  }

  public onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');

    const { functions } = this.context as FunctionContextType;
    const droppedFunction = functions.find(func => func.id === id);
    if (droppedFunction) {
      const modifiedFunctions = {
        name: droppedFunction.name,
        numberOfInputs: droppedFunction.inputs.length,
        numberOfOutputs: droppedFunction.outputs.length,
        id: droppedFunction.id,
      };
      this.fabricCanvas.addNodes(modifiedFunctions, { x: e.pageX, y: e.pageY });
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

export default TypesCreation;

TypesCreation.contextType = FunctionsContext;
