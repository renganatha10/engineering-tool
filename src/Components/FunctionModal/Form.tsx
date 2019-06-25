import React from 'react';
import { Modal, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FunctionCreation from './../../Pages/FunctionCreation';

interface FunctionFormProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

class FunctionForm extends React.PureComponent<FunctionFormProps> {
  public render() {
    const { onCancel, onCreate, visible } = this.props;
    return (
      <Modal
        onCancel={onCancel}
        onOk={onCreate}
        title="Create Function"
        visible={visible}
        okText="Create"
        width={800}
      >
        <FunctionCreation />
      </Modal>
    );
  }
}

const WrappedFunctionForm = Form.create<FunctionFormProps>({
  name: 'validate_other',
})(FunctionForm);

export default WrappedFunctionForm;
