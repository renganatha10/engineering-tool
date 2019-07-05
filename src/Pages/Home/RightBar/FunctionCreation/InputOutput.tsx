import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

const Source = styled(ButtonGroup)`
  margin: 10px !important;
  width: 60%;
  display: block !important;
`;

type SelectionMode = 'function' | 'input' | 'output' | 'condition';

interface Props {
  id: string;
  name: string;
  onClick: (id: string, type: SelectionMode) => void;
  isInput: boolean;
  onDelClick: (id: string, type: SelectionMode) => void;
}

const InputOutSource = (props: Props) => {
  const { onDelClick, isInput, id, name, onClick } = props;

  const onBtnClick = () => {
    onClick(id, isInput ? 'input' : 'output');
  };

  const onDelBtnClick = () => {
    onDelClick(id, isInput ? 'input' : 'output');
  };

  return (
    <Source>
      <Button type={'primary'} onClick={onBtnClick}>
        {name}
      </Button>
      <Button onClick={onDelBtnClick} type={'danger'}>
        Del
      </Button>
    </Source>
  );
};

export default InputOutSource;
