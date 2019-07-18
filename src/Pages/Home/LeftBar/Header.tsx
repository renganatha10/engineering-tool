import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
`;

const HeaderTag = styled.h2`
  flex: 0.3;
  justify-content: flex-end;
  align-items: center;
  margin: 0 !important;
  display: flex;
`;

const ButtonGroup = styled.div`
  flex: 0.2;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  vertical-align: baseline;
`;

interface HeaderProps {
  onClose: () => void;
  onSave: () => void;
}

const Header = (props: HeaderProps) => {
  const { onClose, onSave } = props;

  return (
    <HeaderWrapper>
      <HeaderTag>Device Creation</HeaderTag>
      <ButtonGroup>
        <Button.Group size={'large'}>
          <Button onClick={onClose} type="link">
            Close
          </Button>
          <Button onClick={onSave} type="link">
            Create
          </Button>
        </Button.Group>
      </ButtonGroup>
    </HeaderWrapper>
  );
};

export default Header;
