import React from 'react';
import styled from 'styled-components';

import Function from './Function';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface Props {
  functions: FunctionType[];
}

const Wrapper = styled.div`
  overflow: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Functions = (props: Props) => {
  const { functions } = props;

  return (
    <Wrapper>
      {functions.map(func => {
        return <Function key={func.id} {...func} />;
      })}
    </Wrapper>
  );
};

export default Functions;
