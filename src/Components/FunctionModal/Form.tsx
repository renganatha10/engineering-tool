import React from 'react';
import { Modal, Form, InputNumber, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface FunctionFormProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

class FunctionForm extends React.PureComponent<FunctionFormProps> {
  public render() {
    const { onCancel, onCreate, form, visible } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        onCancel={onCancel}
        onOk={onCreate}
        title="Create Function"
        visible={visible}
        okText="Create"
      >
        <Form {...formItemLayout}>
          <Form.Item label="Function Name">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please input your function name!' },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="No of input">
            {getFieldDecorator('input', {
              rules: [
                {
                  required: true,
                  message: 'Please input number of inputs',
                },
              ],
              initialValue: 1,
            })(<InputNumber min={1} max={5} />)}
            <span className="ant-form-text"> nodes</span>
          </Form.Item>
          <Form.Item label="No of output">
            {getFieldDecorator('output', {
              rules: [
                {
                  required: true,
                  message: 'Please input number of outputs',
                },
              ],
              initialValue: 1,
            })(<InputNumber min={1} max={5} />)}
            <span className="ant-form-text"> nodes</span>
          </Form.Item>
        </Form>{' '}
      </Modal>
    );
  }
}

const WrappedFunctionForm = Form.create<FunctionFormProps>({
  name: 'validate_other',
})(FunctionForm);

export default WrappedFunctionForm;
