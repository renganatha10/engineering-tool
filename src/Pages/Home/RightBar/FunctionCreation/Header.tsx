import React, { useContext, useState } from 'react';
import { message, Input, Button } from 'antd';
import styled from 'styled-components';

import { FunctionContext } from '../../../../Contexts/FunctionStoreContext';

const HeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
`;

const HeaderTag = styled.h2`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  margin: 0 !important;
  display: flex;
`;

const InputWrapper = styled.div`
  flex: 0.6;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 10px;
  vertical-align: baseline;
`;

const ButtonGroup = styled.div`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  display: flex;
  vertical-align: baseline;
`;

interface HeaderProps {
  onClose: () => void;
  onSave: (name: string, modelId: string) => void;
}

const Header = (props: HeaderProps) => {
  const { inputs, outputs } = useContext(FunctionContext);
  const [functionName, setFunctionName] = useState<string>('');
  const [modelId, setModelId] = useState<string>('');
  const { onClose, onSave } = props;

  const onOk = () => {
    if (inputs.length === 0) {
      message.error('Add Inputs');
    }
    if (outputs.length === 0) {
      message.error('Add Outputs');
    }
    if (functionName === '') {
      message.error('Enter Valid Function Name');
    }

    if (inputs.length !== 0 && outputs.length !== 0 && functionName !== '') {
      onSave(functionName, modelId);
    }
  };

  const onChangeName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setFunctionName(e.target.value);
    },
    []
  );

  const onChangeModelId = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setModelId(e.target.value);
    },
    []
  );

  return (
    <HeaderWrapper>
      <HeaderTag>Function Creation</HeaderTag>
      <InputWrapper>
        <Input onChange={onChangeName} placeholder={'Enter Function Name'} />
        <Input onChange={onChangeModelId} placeholder={'Enter Model Id'} />
      </InputWrapper>
      <ButtonGroup>
        <Button.Group size={'large'}>
          <Button onClick={onClose} type="link">
            Close
          </Button>
          <Button onClick={onOk} type="link">
            Save
          </Button>
        </Button.Group>
      </ButtonGroup>
    </HeaderWrapper>
  );
};

export default Header;
