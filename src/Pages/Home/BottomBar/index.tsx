import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import uuid from 'uuid/v1';

import { PagesContext } from '../../../Contexts/PageContext';
import Pages from './Pages';

const BottomBarWrapper = styled.div`
  left: 150px;
  right: 150px;
  position: absolute;
  bottom: 0;
  height: 50px;
  background-color: white;
  box-shadow: 2px -4px 5px 0px rgba(0, 0, 0, 0.5);
  overflow-x: scroll;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonContainer = styled.div`
  margin: 0px 5px 0px 5px;
`;

const BottomBar = () => {
  const {
    pages,
    onAddingPage,
    onChangeCurrentPageId,
    currentPageId,
  } = useContext(PagesContext);

  const addPage = () => {
    const newPage = {
      id: uuid(),
      name: `Page ${pages.length + 1}`,
      context: [],
    };
    onAddingPage && onAddingPage(newPage);
  };

  return (
    <BottomBarWrapper>
      <PageContainer>
        {onChangeCurrentPageId &&
          pages.map(page => (
            <Pages
              key={page.id}
              page={page}
              currentPageId={currentPageId}
              onChangeCurrentPageId={onChangeCurrentPageId}
            />
          ))}
      </PageContainer>
      <ButtonContainer>
        <Button onClick={addPage} type="primary" shape="circle" icon="plus" />
      </ButtonContainer>
    </BottomBarWrapper>
  );
};

export default BottomBar;
