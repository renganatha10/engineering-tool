import React from 'react';
import styled from 'styled-components';

import LeftBar from './LeftBar';
import PlayGround from './PlayGround';
import RightBar from './RightBar';
import Header from './Header';

interface FunctionCreateProps {
  onCreateFuntion: (name: string) => void;
  onClose: () => void;
}

const Wrapper = styled.div`
  background-color: white;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
`;

const FunctionCreation = (props: FunctionCreateProps) => {
  const { onClose, onCreateFuntion } = props;

  return (
    <Wrapper>
      <Header onClose={onClose} onSave={onCreateFuntion} />
      <ContentWrapper>
        <LeftBar />
        <PlayGround />
        <RightBar />
      </ContentWrapper>
    </Wrapper>
  );
};

export default FunctionCreation;
