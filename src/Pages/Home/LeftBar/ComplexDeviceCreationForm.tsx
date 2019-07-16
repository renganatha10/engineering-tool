import React from 'react';
import { Select, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface Device {
  inputs: string[];
  outputs: string[];
  id: string;
  name: string;
}

interface Props {
  devices: Device[];
}

interface State {
  name: string;
  createBasicTypeClicked: boolean;
  basicDevices: string[];
}

const { Option } = Select;

class ComplexDeviceCreationForm extends React.PureComponent<
  FormComponentProps & Props,
  State
> {
  public handleSubmit = (e: any) => {
    e.preventDefault();
  };

  public normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  public render() {
    const { devices, form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const children = devices.map(device => (
      <Option key={device.id}>{device.name}</Option>
    ));

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Complex Device Name">
          {getFieldDecorator('complexName', {
            rules: [
              {
                required: true,
                message: 'Enter Complex Device Name',
              },
            ],
          })(<Input placeholder="Enter Complex Device Name" />)}
        </Form.Item>
        <Form.Item label="Select Devices">
          {getFieldDecorator('basicDevicesId', {
            rules: [
              {
                required: true,
                message: 'Select basic devices',
                type: 'array',
              },
            ],
          })(
            <Select mode="multiple" placeholder="Select Devices">
              {children}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedComplexCreationForm = Form.create<FormComponentProps & Props>({
  name: 'validate_complex_form',
})(ComplexDeviceCreationForm);

export default WrappedComplexCreationForm;
