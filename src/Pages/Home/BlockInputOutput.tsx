import React, { useCallback, useState } from 'react';
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
}

const BlockInputOutput = (props: Props) => {
  const { y1, x1, x2, y2, isInputSource } = props;

  const initXPosition = isInputSource ? x1 : x2;

  const [pathX, setPathX] = useState(initXPosition);
  const [pathY, setPathY] = useState(y1);

  const onCircleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    setPathX(clientX);
    setPathY(clientY);
  }, []);

  const onCircleMouseUp = () => {
    document.removeEventListener('mousemove', onCircleMouseMove);
  };

  const onCircleMouseDown = () => {
    document.addEventListener('mousemove', onCircleMouseMove);
  };

  const onCircleMouseEnter = () => {
    //eslint-disable-next-line
    console.log('On Circle Mouse Enter');
  };
  const onCircleMouseLeave = () => {
    //eslint-disable-next-line
    console.log('On Circle Mouse Leave');
  };
  const onCircleMouseOut = () => {
    //eslint-disable-next-line
    console.log('On Circle Mouse Out');
  };
  const onMouseMove = () => {
    //eslint-disable-next-line
    console.log('On Circle Mouse Move');
  };
  const onCircleMouseOver = () => {
    //eslint-disable-next-line
    console.log('On Circle Mouse Over');
  };

  const dragStart = () => {
    return false;
  };

  return (
    <React.Fragment>
      <line fill={'black'} stroke={'black'} x1={x1} y1={y1} x2={x2} y2={y2} />
      <StyledCircle cx={initXPosition} cy={y1} fill={'green'} r={5} />
      <circle
        onMouseUp={onCircleMouseUp}
        onMouseDown={onCircleMouseDown}
        onMouseEnter={onCircleMouseEnter}
        onMouseLeave={onCircleMouseLeave}
        onMouseOut={onCircleMouseOut}
        onMouseMove={onMouseMove}
        onMouseOver={onCircleMouseOver}
        onDragStart={dragStart}
        cx={pathX}
        cy={pathY}
        fill={'green'}
        r={5}
      />
      <path d={`M${initXPosition} ${y1} L${pathX} ${pathY}`} stroke={'cyan'} />
    </React.Fragment>
  );
};

export default BlockInputOutput;
