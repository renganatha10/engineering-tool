import React, { Component } from 'react';
import Canvas from './Canvas';
import AppLayout from './../../Components/AppLayout';

class TypesCreation extends Component<{}> {
  public render() {
    return (
      <React.Fragment>
        <Canvas />
        <AppLayout />
      </React.Fragment>
    );
  }
}

export default TypesCreation;
