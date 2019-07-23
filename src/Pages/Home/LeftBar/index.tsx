import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Collapse } from 'antd';
import { observer } from 'mobx-react';

import DeviceStore, {
  BasicDevice,
  ComplexDevice,
  Plants,
} from '../../../MobxStore/deviceStore';

import DeviceCreation from './DeviceCreationModal';
import Devices from './Devices';

const { Panel } = Collapse;

const LeftBarWrapper = styled.div`
  left: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 150px;
  background-color: white;
  box-shadow: 2px -6px 7px 0px rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
  margin: 0px 0px 10px 0px;
`;

interface LeftBarProps {
  devices: typeof DeviceStore.Type;
}

const LeftBar = (props: LeftBarProps) => {
  const [isCreateDeviceVisible, toggleCreateDeviceVisible] = useState<boolean>(
    false
  );

  const { devices } = props;

  const showDeviceCreation = useCallback(() => {
    toggleCreateDeviceVisible(true);
  }, []);

  const hideDeviceCreate = React.useCallback(() => {
    toggleCreateDeviceVisible(false);
  }, []);

  const onDeviceCreate = (
    device: typeof BasicDevice.Type | typeof ComplexDevice.Type,
    type: string
  ) => {
    if (type === 'Basic') {
      devices.addBasicDevice(device as typeof BasicDevice.Type);
    } else if (type === 'Complex') {
      devices.addComplexDevice(device as typeof ComplexDevice.Type);
    } else if (type === 'Plant') {
      devices.addPlant(device as typeof Plants.Type);
    }

    toggleCreateDeviceVisible(false);
  };

  const basicDevices = devices.basicDevices.toJSON().map(device => {
    return {
      id: device.id,
      name: device.name,
    };
  });

  const complexDevices = devices.complexDevices.toJSON().map(device => {
    return {
      id: device.id,
      name: device.name,
    };
  });

  const plants = devices.plants.toJSON().map(plant => {
    return {
      id: plant.id,
      name: plant.name,
    };
  });

  if (isCreateDeviceVisible) {
    return (
      <DeviceCreation
        onCreate={onDeviceCreate}
        onCancel={hideDeviceCreate}
        devices={devices}
      />
    );
  }

  return (
    <LeftBarWrapper>
      <ButtonContainer>
        <Button
          onClick={showDeviceCreation}
          type="danger"
          shape="circle"
          icon="plus"
        />
      </ButtonContainer>
      <Collapse accordion>
        <Panel header="Basic Devices" key="1">
          <Devices data={basicDevices} type={'Basic'} />
        </Panel>
        <Panel header="Complex Devices" key="2">
          <Devices data={complexDevices} type={'Complex'} />
        </Panel>
        <Panel header="Plant" key="3">
          <Devices data={plants} type={'Plant'} />
        </Panel>
      </Collapse>
    </LeftBarWrapper>
  );
};

export default observer(LeftBar);
