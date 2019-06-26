import React, { Component } from 'react';
import Canvas from './Canvas';
import AppLayout from './../../Components/AppLayout';
import FunctionProvoider from './../../Context/FunctionStoreContext';
import FunctionsProvoider from './../../Context/FunctionsStoreContext';

class TypesCreation extends Component<{}> {
  public render() {
    return (
      <FunctionProvoider>
        <FunctionsProvoider>
          <Canvas />
          <AppLayout />
        </FunctionsProvoider>
      </FunctionProvoider>
    );
  }
}

export default TypesCreation;
