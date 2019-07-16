import React from 'react';
import { Form, Input, Button, Icon, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import FormInput from './FormInput';

let idInput = 0;
let idOutput = 0;

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

  public addInput = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keysInput');
    const nextKeys = keys.concat(`input${idInput++}`);
    form.setFieldsValue({
      keysInput: nextKeys,
    });
  };

  public addOutput = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keysOutput');
    const nextKeys = keys.concat(`output${idOutput++}`);
    form.setFieldsValue({
      keysOutput: nextKeys,
    });
  };

  public removeInput = (k: string) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keysInput');
    if (keys.length === 0) {
      return;
    }

    form.setFieldsValue({
      keysInput: keys.filter((key: string) => key !== k),
    });
  };

  public removeOutput = (k: string) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keysOutput');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keysOutput: keys.filter((key: string) => key !== k),
    });
  };

  public render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    getFieldDecorator('keysInput', { initialValue: [] });
    const keysInput = getFieldValue('keysInput');
    const inputFormItems = keysInput.map((k: string, index: number) => (
      <FormInput
        id={k}
        key={index}
        form={form}
        onDelete={this.removeInput}
        mode={0}
      />
    ));

    getFieldDecorator('keysOutput', { initialValue: [''] });
    const keysOutput = getFieldValue('keysOutput');
    const outputFormItems = keysOutput.map((k: string, index: number) => (
      <FormInput
        id={k}
        key={index}
        form={form}
        onDelete={this.removeOutput}
        mode={1}
      />
    ));

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
        <div>
          <Row>
            <Col span={12}>
              <Form.Item label="Input">
                {inputFormItems}
                <Button
                  type="dashed"
                  onClick={this.addInput}
                  style={{ width: '80%' }}
                >
                  <Icon type="plus" /> Add field
                </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Output">
                {outputFormItems}
                <Button
                  type="dashed"
                  onClick={this.addOutput}
                  style={{ width: '80%' }}
                >
                  <Icon type="plus" /> Add field
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

const WrappedDemo = Form.create<FormComponentProps>({ name: 'validate_other' })(
  Demo
);

export default WrappedDemo;
