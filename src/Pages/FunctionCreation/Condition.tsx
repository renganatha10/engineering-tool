import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

const Source = styled(ButtonGroup)`
  margin: 10px !important;
  width: 60%;
  display: block !important;
`;

interface Props {
  id: string;
  name: string;
  onClick: (id: string, type: 'condition') => void;
  onDelClick: (id: string, type: 'condition') => void;
}

const InputOutSource = (props: Props) => {
  const { onDelClick, id, name, onClick } = props;

  const onBtnClick = () => {
    onClick(id, 'condition');
  };

  const onDelBtnClick = () => {
    onDelClick(id, 'condition');
  };

  return (
    <Source>
      <Button data-testid={'btn'} data- onClick={onBtnClick} type={'primary'}>
        {name}
      </Button>

      <Button data-testid={'delBtn'} onClick={onDelBtnClick} type={'danger'}>
        Del
      </Button>
    </Source>
  );
};

export default InputOutSource;
