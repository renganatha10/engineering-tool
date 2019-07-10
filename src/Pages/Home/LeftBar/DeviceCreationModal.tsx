import React from 'react';
import { Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import uuid from 'uuid/v1';

import DeviceCreationForm from './DeviceCreationForm';

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

interface Props {
  visible: boolean;
  onCancel: () => void;
  onCreate: (device: Device) => void;
}

interface FormValues {
  username: string;
  keysInput: string[];
  keysOutput: string[];
}

class DeviceCreationModal extends React.PureComponent<Props> {
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

  public render() {
    const { visible, onCancel } = this.props;

    return (
      <Modal
        title="Device Creation"
        visible={visible}
        okText="Create"
        width={800}
        onCancel={onCancel}
        onOk={this.handleCreate}
      >
        <DeviceCreationForm wrappedComponentRef={this.saveFormRef} />
      </Modal>
    );
  }
}

export default DeviceCreationModal;
