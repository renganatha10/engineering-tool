import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

const Source = styled(ButtonGroup)`
  margin: 10px 10px 10px 40px !important;
  width: 60%;
  display: block !important;
`;

interface Props {
  id: string;
  name: string;
  onClick: (id: string, type: 'state', conditionId: string) => void;
  onDelClick: (id: string, type: 'state', conditionId: string) => void;
  conditionId: string;
}

const InputOutSource = (props: Props) => {
  const { onDelClick, id, name, conditionId, onClick } = props;

  const onBtnClick = () => {
    onClick(id, 'state', conditionId);
  };

  const onDelBtnClick = () => {
    onDelClick(id, 'state', conditionId);
  };

  return (
    <Source>
      <Button onClick={onBtnClick} type={'primary'}>
        {name}
      </Button>
      <Button onClick={onDelBtnClick} type={'danger'}>
        Del
      </Button>
    </Source>
  );
};

export default InputOutSource;
