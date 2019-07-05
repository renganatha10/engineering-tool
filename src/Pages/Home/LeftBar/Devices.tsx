import React from 'react';
import DraggbleItem from '../../../Components/DraggableItem';

interface DeviceType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface Props {
  data: DeviceType[];
}

const Devices = (props: Props) => {
  const { data } = props;
  return (
    <div>
      {data.map(item => (
        <DraggbleItem
          type={'device'}
          id={item.id}
          key={item.id}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default Devices;
