import React, { useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Collapse } from 'antd';

import { DevicesContext } from '../../../Contexts/DevicesContext';

import DeviceStore from '../../../store/deviceStore';
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

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

interface Props {
  deviceStore: typeof DeviceStore.Type;
}

const LeftBar = (props: Props) => {
  const [isCreateDeviceVisible, toggleCreateDeviceVisible] = useState<boolean>(
    false
  );
  const { devices, onAddingDevices } = useContext(DevicesContext);
  const { deviceStore } = props;

  const showDeviceCreation = useCallback(() => {
    toggleCreateDeviceVisible(true);
  }, []);

  const hideDeviceCreate = React.useCallback(() => {
    toggleCreateDeviceVisible(false);
  }, []);

  const onDeviceCreate = (device: Device) => {
    onAddingDevices && onAddingDevices(device);
    deviceStore.addBasicDevice(device);
    toggleCreateDeviceVisible(false);
  };

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
          <Devices data={deviceStore.basicDevices.toJSON()} />
        </Panel>
        <Panel header="Complex Devices" key="2">
          <Devices data={devices} />
        </Panel>
        <Panel header="Plant" key="3">
          <Devices data={devices} />
        </Panel>
      </Collapse>
    </LeftBarWrapper>
  );
};

export default LeftBar;
