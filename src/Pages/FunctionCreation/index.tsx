import React from 'react';
import styled from 'styled-components';

import FunctionProvoider from './StoreContext';
import LeftBar from './LeftBar';
import PlayGround from './PlayGround';
import RightBar from './RightBar';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
`;

const FunctionCreation = () => {
  return (
    <FunctionProvoider>
      <Wrapper>
        <LeftBar />
        <PlayGround />
        <RightBar />
      </Wrapper>
    </FunctionProvoider>
  );
};

export default FunctionCreation;
