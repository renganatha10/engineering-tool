import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { observer, inject } from 'mobx-react';
import uuid from 'uuid/v4';

import Pages from './Pages';

import PagesStore from './../../../MobxStore/pages';

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

interface Props {
  pages: typeof PagesStore.Type;
}

class BottomBar extends React.Component<{}> {
  public get injected() {
    return this.props as Props;
  }

  public _addPage = () => {
    const {
      pages: { addPage, pages },
    } = this.injected;
    addPage({ id: uuid(), name: `Page ${pages.length + 1}` });
  };

  public render() {
    const {
      pages: { pages, currentPageId, changeCurrentPage },
    } = this.injected;

    return (
      <BottomBarWrapper>
        <PageContainer>
          {pages.map(page => (
            <Pages
              key={page.id}
              page={page}
              currentPageId={currentPageId ? currentPageId.id : ''}
              onChangeCurrentPageId={changeCurrentPage}
            />
          ))}
        </PageContainer>
        <ButtonContainer>
          <Button
            onClick={this._addPage}
            type="primary"
            shape="circle"
            icon="plus"
          />
        </ButtonContainer>
      </BottomBarWrapper>
    );
  }
}

export default inject('pages')(observer(BottomBar));
