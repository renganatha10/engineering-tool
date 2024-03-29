import React from 'react';

import FunctionBlock from '../../../Components/DraggableItem';
import { FunctionType } from '../../../FabricController';

interface Props {
  data: FunctionType[];
}

const Functions = (props: Props) => {
  const { data } = props;
  return (
    <div>
      <FunctionBlock type={'timer'} id={'0'} name={'Timer'} />
      {data.map(item => (
        <FunctionBlock
          type={'func'}
          id={item.id}
          key={item.id}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default Functions;
