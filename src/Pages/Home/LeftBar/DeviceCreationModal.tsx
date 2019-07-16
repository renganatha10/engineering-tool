import React from 'react';
import { Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import uuid from 'uuid/v1';
import styled from 'styled-components';
import { RadioChangeEvent } from 'antd/lib/radio';

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
  devices: Device[];
}

interface State {
  mode: number;
  createBasicTypeClicked: boolean;
  complexDevice: string[];
}

interface FormValues {
  username: string;
  keysInput: string[];
  keysOutput: string[];
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
      mode: 0,
      createBasicTypeClicked: false,
      complexDevice: [],
    };
  }

  public formRef: null | { props: object } = null;

  public saveFormRef = (formRef: { props: FormComponentProps<FormValues> }) => {
    this.formRef = formRef;
  };

  public handleCreate = () => {
    const { onCreate } = this.props;
    if (this.formRef) {
      const { form } = this.formRef.props as FormComponentProps<FormValues>;
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
    }
  };

  public onChange = (event: RadioChangeEvent) => {
    this.setState({
      mode: event.target.value,
    });
  };

  public render() {
    const { mode } = this.state;
    const { onCancel } = this.props;
    const { devices } = this.props;

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
        {mode === 1 ? (
          <DeviceCreationForm wrappedComponentRef={this.saveFormRef} />
        ) : mode === 2 ? (
          <ComplexCreationForm
            devices={devices}
            saveFormRef={this.saveFormRef}
          ></ComplexCreationForm>
        ) : (
          mode === 3 && (
            <PlantCreationForm
              wrappedComponentRef={this.saveFormRef}
              data={devices}
            />
          )
        )}
      </Wrapper>
    );
  }
}

export default DeviceCreationModal;
