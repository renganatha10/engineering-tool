import React from 'react';
import styled from 'styled-components';

const StyledCircle = styled.circle`
  cursor: move;
`;

interface Props {
  y1: number;
  x2: number;
  x1: number;
  y2: number;
  isInputSource: boolean;
  uniqName: string;
  onCircleMouseDown: (x: number, y: number, functionId: string) => void;
  onCircleMouseUp: (functionId: string) => void;
  functionId: string;
}

const BlockInputOutput = (props: Props) => {
  const {
    y1,
    x1,
    x2,
    y2,
    isInputSource,
    onCircleMouseUp,
    onCircleMouseDown,
    functionId,
  } = props;

  const initXPosition = isInputSource ? x1 : x2;

  const dragStart = () => {
    return false;
  };

  const onCircleMouseDownCB = () => {
    onCircleMouseDown(initXPosition, y1, functionId);
  };

  const onCircleMouseUpCB = () => {
    onCircleMouseUp(functionId);
  };

  return (
    <React.Fragment>
      <line fill={'black'} stroke={'black'} x1={x1} y1={y1} x2={x2} y2={y2} />
      <StyledCircle
        onMouseUp={onCircleMouseUpCB}
        onMouseDown={onCircleMouseDownCB}
        onDragStart={dragStart}
        cx={initXPosition}
        cy={y1}
        fill={'green'}
        r={5}
      />
    </React.Fragment>
  );
};

export default BlockInputOutput;
