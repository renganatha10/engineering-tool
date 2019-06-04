import React from 'react';

interface Props {
  name: string;
  inputVariant: number;
  outputVariant: number;
  numberOfInputs: number;
  numberOfOutputs: number;
}

const SVG_SIZE = 200;
const PADDING_SIZE = 40;
const RECT_SIZE = SVG_SIZE - 2 * PADDING_SIZE;
const LEFT_PADDING_SIZE = 10;

const FunctionBlock = (props: Props) => {
  const {
    name,
    numberOfInputs,
    numberOfOutputs,
    outputVariant,
    inputVariant,
  } = props;
  return (
    <React.Fragment>
      <rect
        x={PADDING_SIZE}
        y={PADDING_SIZE}
        height={RECT_SIZE}
        width={RECT_SIZE}
        fill={'transparent'}
        stroke={'black'}
      />
      <text x="50%" y="50%" textAnchor={'middle'} stroke="green">
        {name}
      </text>

      {Array.from(Array(numberOfInputs)).map((_, index) => {
        const y1 = PADDING_SIZE + inputVariant * (index + 1);
        return (
          <line
            fill={'black'}
            stroke={'black'}
            key={`llll${index}`}
            x1={LEFT_PADDING_SIZE}
            y1={y1}
            x2={PADDING_SIZE}
            y2={y1}
          />
        );
      })}

      {Array.from(Array(numberOfOutputs)).map((_, index) => {
        const y1 = PADDING_SIZE + outputVariant * (index + 1);
        return (
          <line
            fill={'black'}
            stroke={'black'}
            key={`llll${index}`}
            x1={RECT_SIZE + PADDING_SIZE}
            y1={y1}
            x2={RECT_SIZE + PADDING_SIZE + (PADDING_SIZE - LEFT_PADDING_SIZE)}
            y2={y1}
          />
        );
      })}
    </React.Fragment>
  );
};

export default FunctionBlock;
