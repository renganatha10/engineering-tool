import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import { Page } from '../../../Contexts/PageContext';

interface Props {
  page: Page;
  onChangeCurrentPageId: (id: string) => void;
  currentPageId: string;
}

const Margin = styled.div`
  margin: 0px 5px 0px 5px;
`;

const Pages = (props: Props) => {
  const { page, onChangeCurrentPageId, currentPageId } = props;

  const onChangePageId = () => {
    onChangeCurrentPageId(page.id);
  };

  return (
    <Margin key={page.id}>
      <Button
        onClick={onChangePageId}
        type={page.id === currentPageId ? 'primary' : undefined}
      >
        {page.name}
      </Button>
    </Margin>
  );
};

export default Pages;
