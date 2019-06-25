import React from 'react';

import FunctionBlock from './../FunctionBlock';

const SVG_SIZE = 200;

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

const Function = (props: FunctionType) => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const currentId = e.currentTarget.dataset.id;
    if (currentId) {
      e.dataTransfer.setData('id', currentId);
    }
  };

  const { numberOfInputs, numberOfOutputs, id, name } = props;
  const inputVarient = 100 / numberOfInputs;
  const outPutVarient = 100 / numberOfOutputs;
  return (
    <div onDragStart={onDragStart} data-id={id} draggable={true} key={id}>
      <svg height={SVG_SIZE} width={SVG_SIZE} strokeWidth={1}>
        <FunctionBlock
          name={name}
          numberOfInputs={numberOfInputs}
          numberOfOutputs={numberOfOutputs}
          inputVariant={inputVarient}
          outputVariant={outPutVarient}
        />
      </svg>
    </div>
  );
};

export default Function;
