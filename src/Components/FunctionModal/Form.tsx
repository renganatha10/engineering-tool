import React, { useContext, useState } from 'react';
import { message, Modal, Input } from 'antd';
import FunctionCreation from './../../Pages/FunctionCreation';

import { FunctionContext } from './../../Context/FunctionStoreContext';

interface FunctionFormProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (name: string) => void;
}

const FunctionForm = (props: FunctionFormProps) => {
  const { inputs, outputs, conditions } = useContext(FunctionContext);
  const { visible, onCreate } = props;
  const [functionName, setFunctionName] = useState<string>('');

  const onOk = () => {
    // console.log(inputs, outputs, conditions, 'inputs, outputs, conditions ');
    if (inputs.length === 0) {
      message.error('Add Inputs');
    }
    if (outputs.length === 0) {
      message.error('Add Outputs');
    }
    if (conditions.length === 0) {
      message.error('Add Conditions');
    }
    if (functionName === '') {
      message.error('Enter Valid Function Name');
    }

    if (
      inputs.length !== 0 &&
      outputs.length !== 0 &&
      conditions.length !== 0 &&
      functionName !== ''
    ) {
      onCreate(functionName);
    }
  };
  const onCancel = () => {};
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFunctionName(e.target.value);
  };

  return (
    <Modal
      onCancel={onCancel}
      onOk={onOk}
      title="Create Function"
      visible={visible}
      okText="Create"
      width={800}
    >
      <Input
        onChange={onChange}
        style={{ marginBottom: 20 }}
        value={functionName}
        placeholder="Function Name"
      />
      <FunctionCreation />
    </Modal>
  );
};

export default FunctionForm;
