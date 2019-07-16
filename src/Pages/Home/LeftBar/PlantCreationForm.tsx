import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface DeviceType {
  name: string;
  inputs: string[];
  outputs: string[];
  id: string;
}

interface Props {
  data: DeviceType[];
}

interface State {
  basicDevices: string[];
}

const { Option } = Select;

class Plant extends React.PureComponent<FormComponentProps & Props, State> {
  public constructor(props: FormComponentProps & Props) {
    super(props);
    this.state = {
      basicDevices: [],
    };
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
  };

  public normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  public handleDeviceChange = (value: string[]) => {
    this.setState({ basicDevices: value });
  };

  public render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const location = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'];

    const deviceChildren = data.map(device => (
      <Option key={device.id}>{device.name}</Option>
    ));

    const locationChildren = location.map(area => (
      <Option key={area}>{area}</Option>
    ));

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item {...formItemLayout} label="Plant Name">
            {getFieldDecorator('plantname', {
              rules: [
                {
                  required: true,
                  message: 'Enter Plant Name',
                },
              ],
            })(<Input placeholder="Enter Plant Name" />)}
          </Form.Item>
          <Form.Item label="Select Area :">
            {getFieldDecorator('areas', {
              rules: [
                {
                  required: true,
                  message: 'Select area',
                  type: 'array',
                },
              ],
            })(
              <Select mode="multiple" placeholder="Select Area">
                {locationChildren}
              </Select>
            )}
          </Form.Item>
        </Form>
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
              {deviceChildren}
            </Select>
          )}
        </Form.Item>
      </div>
    );
  }
}

const WrappedPlant = Form.create<FormComponentProps & Props>({
  name: 'validate_plant',
})(Plant);

export default WrappedPlant;
