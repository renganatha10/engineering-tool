import React from 'react';

import DraggbleItem from '../../../Components/DraggableItem';

interface Data {
  id: string;
  name: string;
}

interface Props {
  data: Data[];
  type: 'Basic' | 'Complex' | 'Plant';
}

const Devices = (props: Props) => {
  const { data, type } = props;
  return (
    <div>
      {data.map(item => (
        <DraggbleItem
          type={'device'}
          subType={type}
          id={item.id}
          key={item.id}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default Devices;
