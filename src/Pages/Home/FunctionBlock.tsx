import React from 'react';
import BlockInputOutput from './BlockInputOutput';

interface Props {
  name: string;
  inputVariant: number;
  outputVariant: number;
  numberOfInputs: number;
  numberOfOutputs: number;
  rectX: number;
  rectY: number;
  lineX: number;
  id: string;
  onCircleMouseDown: (x: number, y: number, functionId: string) => void;
  onCircleMouseUp: (functionId: string) => void;
}

const FunctionBlock = (props: Props) => {
  const {
    name,
    numberOfInputs,
    numberOfOutputs,
    outputVariant,
    inputVariant,
    rectX,
    lineX,
    rectY,
    onCircleMouseUp,
    onCircleMouseDown,
    id,
  } = props;

  const RECT_SIZE = 120;
  return (
    <React.Fragment>
      <rect
        x={rectX}
        y={rectY}
        height={RECT_SIZE}
        width={RECT_SIZE}
        fill={'transparent'}
        stroke={'black'}
        pointerEvents={'none'}
      />
      <text
        x={RECT_SIZE / 2 + rectX}
        y={RECT_SIZE / 2 + rectY}
        textAnchor={'middle'}
        stroke="green"
      >
        {name}
      </text>
      {Array.from(Array(numberOfInputs)).map((_, index) => {
        const y1 = rectY + inputVariant * (index + 1);
        return (
          <BlockInputOutput
            key={`input${index}`}
            x1={lineX}
            y1={y1}
            x2={rectX}
            y2={y1}
            isInputSource={true}
            uniqName={`input${index}`}
            onCircleMouseUp={onCircleMouseUp}
            onCircleMouseDown={onCircleMouseDown}
            functionId={id}
          />
        );
      })}
      {Array.from(Array(numberOfOutputs)).map((_, index) => {
        const y1 = rectY + outputVariant * (index + 1);
        return (
          <BlockInputOutput
            key={`output${index}`}
            y1={y1}
            x1={RECT_SIZE + rectX}
            x2={RECT_SIZE + rectX + (rectX - lineX)}
            y2={y1}
            isInputSource={false}
            uniqName={`output${index}`}
            onCircleMouseUp={onCircleMouseUp}
            onCircleMouseDown={onCircleMouseDown}
            functionId={id}
          />
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(FunctionBlock);