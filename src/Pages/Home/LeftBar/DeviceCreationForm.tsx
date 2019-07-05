import React from 'react';
import { Form, InputNumber, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

class Demo extends React.Component<FormComponentProps> {
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Device Name">
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Enter Device Name',
              },
            ],
          })(<Input placeholder="Enter Device Name" />)}
        </Form.Item>

        <Form.Item label="Inputs">
          {getFieldDecorator('inputnumber', { initialValue: 1 })(
            <InputNumber min={1} max={10} />
          )}
          <span className="ant-form-text"> inputs</span>
        </Form.Item>

        <Form.Item label="Outputs">
          {getFieldDecorator('outputnumber', { initialValue: 1 })(
            <InputNumber min={1} max={10} />
          )}
          <span className="ant-form-text"> outputs</span>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDemo = Form.create<FormComponentProps>({ name: 'validate_other' })(
  Demo
);

export default WrappedDemo;
