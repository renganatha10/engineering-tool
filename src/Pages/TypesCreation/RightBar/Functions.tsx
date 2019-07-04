import React from 'react';
import FunctionBlock from './Function';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface Props {
  data: FunctionType[];
}

const Functions = (props: Props) => {
  const { data } = props;
  return (
    <div>
      {data.map(item => (
        <FunctionBlock id={item.id} key={item.id} name={item.name} />
      ))}
    </div>
  );
};

export default Functions;
