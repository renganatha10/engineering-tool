import React from 'react';
import { Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import uuid from 'uuid/v1';
import styled from 'styled-components';
import { RadioChangeEvent } from 'antd/lib/radio';

import DeviceStore from '../../../MobxStore/deviceStore';

import DeviceCreationForm from './DeviceCreationForm';
import Header from './Header';
import ComplexCreationForm from './ComplexDeviceCreationForm';
import PlantCreationForm from './PlantCreationForm';

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

interface Props {
  onCancel: () => void;
  onCreate: (device: Device) => void;
  devices: typeof DeviceStore.Type;
}

interface State {
  mode: 'Basic' | 'Complex' | 'Plant';
  createBasicTypeClicked: boolean;
  complexDevice: string[];
}

interface FormValues {
  username: string;
  keysInput: string[];
  keysOutput: string[];
  complexName: string;
  basicDevicesId: string[];
  plantName: string;
  areas: string[];
}

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0px 50px 0px;
`;

const Wrapper = styled.div`
  background-color: white;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
`;

class DeviceCreationModal extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      mode: 'Basic',
      createBasicTypeClicked: false,
      complexDevice: [],
    };
  }

  public formRef: null | { props: object } = null;

  public saveFormRef = (formRef: { props: FormComponentProps<FormValues> }) => {
    this.formRef = formRef;
  };

  public handleCreate = () => {
    const { onCreate, devices } = this.props;
    const { mode } = this.state;
    if (this.formRef) {
      const { form } = this.formRef.props as FormComponentProps<FormValues>;
      if (mode === 'Basic') {
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          const { keysInput: inputs, keysOutput: outputs, username } = values;
          const newDevice = {
            outputs: outputs,
            id: uuid(),
            inputs: inputs,
            name: username,
          };
          onCreate(newDevice);
          form.resetFields();
        });
      } else if (mode === 'Complex') {
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          const { complexName, basicDevicesId } = values;

          const newDevice = {
            name: complexName,
            id: uuid(),
            basicDevices: basicDevicesId,
          };
          //@ts-ignore
          devices.addComplexDevice(newDevice);
        });
      } else if (mode === 'Plant') {
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          const { plantName, areas, basicDevicesId } = values;

          const newPlant = {
            name: plantName,
            id: uuid(),
            plantArea: areas,
            basicDevices: basicDevicesId,
          };
          //@ts-ignore
          devices.addPlant(newPlant);
        });
      }
    }
  };

  public onChange = (event: RadioChangeEvent) => {
    this.setState({
      mode: event.target.value,
    });
  };

  public render() {
    const { mode } = this.state;
    const { onCancel, devices } = this.props;

    return (
      <Wrapper>
        <Header onClose={onCancel} onSave={this.handleCreate}></Header>
        <FlexWrapper>
          <Radio.Group onChange={this.onChange} value={mode}>
            <Radio value={1}>Basic Type</Radio>
            <Radio value={2}>Complex Type</Radio>
            <Radio value={3}>Plant</Radio>
          </Radio.Group>
        </FlexWrapper>
        {mode === 'Basic' ? (
          <DeviceCreationForm wrappedComponentRef={this.saveFormRef} />
        ) : mode === 'Complex' ? (
          <ComplexCreationForm
            devices={devices.basicDevices.toJSON()}
            wrappedComponentRef={this.saveFormRef}
          />
        ) : (
          mode === 'Plant' && (
            <PlantCreationForm
              wrappedComponentRef={this.saveFormRef}
              data={devices.basicDevices.toJSON()}
            />
          )
        )}
      </Wrapper>
    );
  }
}

export default DeviceCreationModal;
