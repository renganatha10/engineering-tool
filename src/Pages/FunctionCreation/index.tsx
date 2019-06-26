import React from 'react';
import styled from 'styled-components';

// import FunctionProvoider from './../../Context/FunctionStoreContext';
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
    <Wrapper>
      <LeftBar />
      <PlayGround />
      <RightBar />
    </Wrapper>
  );
};

export default FunctionCreation;
