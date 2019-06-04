import React from 'react';

interface Props {
  name: string;
  inputVariant: number;
  outputVariant: number;
  numberOfInputs: number;
  numberOfOutputs: number;
  rectX: number;
  rectY: number;
  lineX: number;
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
          <line
            fill={'black'}
            stroke={'black'}
            key={`llll${index}`}
            x1={lineX}
            y1={y1}
            x2={rectX}
            y2={y1}
          />
        );
      })}

      {Array.from(Array(numberOfOutputs)).map((_, index) => {
        const y1 = rectY + outputVariant * (index + 1);
        return (
          <line
            fill={'black'}
            stroke={'black'}
            key={`llll${index}`}
            x1={RECT_SIZE + rectX}
            y1={y1}
            x2={RECT_SIZE + rectX + (rectX - lineX)}
            y2={y1}
          />
        );
      })}
    </React.Fragment>
  );
};

export default FunctionBlock;
