import React, { Component } from 'react';
import {
  FunctionsContext,
  FunctionContextType,
} from './../../Context/FunctionsStoreContext';

import FabricCanvas from './../../FabricController';

class TypesCreation extends Component<{}> {
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
      this.fabricCanvas.addNodes(modifiedFunctions);
    }
  };

  public onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  public render() {
    return (
      <div onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <canvas id="c" width="2000" height="1300" />
      </div>
    );
  }
}

export default TypesCreation;

TypesCreation.contextType = FunctionsContext;
