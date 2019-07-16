import React from 'react';
import { Button, Select, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
// import uuid from 'uuid/v1';
import styled from 'styled-components';

import DeviceCreationForm from './DeviceCreationForm';

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

interface FormValues {
  username: string;
  keysInput: string[];
  keysOutput: string[];
}

interface Props {
  devices: Device[];
  saveFormRef: (formRef: { props: FormComponentProps<FormValues> }) => void;
}

interface State {
  name: string;
  createBasicTypeClicked: boolean;
  basicDevices: string[];
}

const { Option } = Select;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0px 50px 0px;
  width: 100%;
`;

const HeaderTag = styled.h2`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  margin: 0;
  display: flex;
  font-size: 15px;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0px 50px 0px;
  width: 50%;
`;

class ComplexDeviceCreationModal extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      createBasicTypeClicked: false,
      basicDevices: [],
    };
  }

  public toggleCreateBasicButton = () => {
    const { createBasicTypeClicked } = this.state;

    this.setState({ createBasicTypeClicked: !createBasicTypeClicked });
  };

  public handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  public handleChange = (value: string[]) => {
    this.setState({ basicDevices: value });
  };

  public render() {
    const { createBasicTypeClicked, name } = this.state;
    //@ts-ignore
    const { devices, saveFormRef } = this.props;

    const children = devices.map(device => (
      <Option key={device.id}>{device.name}</Option>
    ));
    return (
      <div>
        <FlexWrapper>
          <HeaderTag>Device name :</HeaderTag>
          <Input
            placeholder="Device name"
            value={name}
            onChange={this.handleNameChange}
          ></Input>
        </FlexWrapper>
        <SelectWrapper>
          <HeaderTag>Select Basic Devices :</HeaderTag>
          <Select
            mode="multiple"
            style={{ width: '30%' }}
            placeholder="Select Devices"
            onChange={this.handleChange}
          >
            {children}
          </Select>
        </SelectWrapper>
        <FlexWrapper>
          <Button
            type={createBasicTypeClicked ? 'primary' : undefined}
            onClick={this.toggleCreateBasicButton}
          >
            Create Basic Device
          </Button>
        </FlexWrapper>
        {createBasicTypeClicked ? (
          <DeviceCreationForm wrappedComponentRef={saveFormRef} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default ComplexDeviceCreationModal;
