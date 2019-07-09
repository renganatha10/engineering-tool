import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import { DevicesContext } from '../../../Contexts/DevicesContext';

import DeviceCreation from './DeviceCreationModal';
import Devices from './Devices';

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
`;

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

const LeftBar = () => {
  const [modalVisible, toggleModalVisible] = useState<boolean>(false);
  const { devices, onAddingDevices } = useContext(DevicesContext);

  const showModal = () => {
    toggleModalVisible(true);
  };

  const hideModal = () => {
    toggleModalVisible(false);
  };

  const onDeviceCreate = (device: Device) => {
    onAddingDevices && onAddingDevices(device);
    toggleModalVisible(false);
  };

  return (
    <LeftBarWrapper>
      <ButtonContainer>
        <Button onClick={showModal} type="danger" shape="circle" icon="plus" />
      </ButtonContainer>
      <DeviceCreation
        onCreate={onDeviceCreate}
        onCancel={hideModal}
        visible={modalVisible}
      />
      <Devices data={devices} />
    </LeftBarWrapper>
  );
};

export default LeftBar;
