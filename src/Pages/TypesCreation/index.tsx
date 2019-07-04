import React, { Component } from 'react';
import styled from 'styled-components';

import FunctionProvoider from './../../Contexts/FunctionStoreContext';
import FunctionsProvoider from './../../Contexts/FunctionsStoreContext';

import Canvas from './Canvas';
import RightBar from './RightBar';

const HomeWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

class TypesCreation extends Component<{}> {
  public render() {
    return (
      <FunctionProvoider>
        <FunctionsProvoider>
          <HomeWrapper>
            <Canvas />
            <RightBar />
          </HomeWrapper>
        </FunctionsProvoider>
      </FunctionProvoider>
    );
  }
}

export default TypesCreation;
