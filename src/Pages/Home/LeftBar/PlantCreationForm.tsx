import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styled from 'styled-components';

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

const HeaderTag = styled.h2`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  margin: 0;
  display: flex;
  font-size: 15px;
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0px 50px 0px;
  width: 100%;
`;

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
    const location = ['Bangalore', 'Chennai', 'Delhi', 'Kolkata'];

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
        </Form>
        <SelectWrapper>
          <HeaderTag>Select Plant Location :</HeaderTag>
          <Select
            mode="tags"
            style={{ width: '30%' }}
            placeholder="Select Areas"
            onChange={this.handleDeviceChange}
            tokenSeparators={[',']}
          >
            {locationChildren}
          </Select>
        </SelectWrapper>
        <SelectWrapper>
          <HeaderTag>Select Basic Devices :</HeaderTag>
          <Select
            mode="multiple"
            style={{ width: '30%' }}
            placeholder="Select Devices"
            onChange={this.handleDeviceChange}
          >
            {deviceChildren}
          </Select>
        </SelectWrapper>
      </div>
    );
  }
}

const WrappedPlant = Form.create<FormComponentProps & Props>({
  name: 'validate_plant',
})(Plant);

export default WrappedPlant;
