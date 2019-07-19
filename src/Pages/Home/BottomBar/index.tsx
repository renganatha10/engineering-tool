import React from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'antd';
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

interface State {
  modalVisible: boolean;
  pageName: string;
  modelId: string;
}

class BottomBar extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props);
    const {
      pages: { pages },
    } = this.injected;
    this.state = {
      modalVisible: false,
      pageName: `Page ${pages.length + 1}`,
      modelId: '',
    };
  }

  public get injected() {
    return this.props as Props;
  }

  public toggleModal = () => {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  };

  public _addPage = () => {
    const {
      pages: { addPage },
    } = this.injected;
    const { pageName, modelId } = this.state;
    this.toggleModal();
    addPage({ id: uuid(), name: pageName, modelId: modelId });
  };

  public handleChangeName = (event: any) => {
    const { value } = event.target;
    if (value) {
      this.setState({ pageName: value });
    }
  };

  public handleChangeModelId = (event: any) => {
    const { value } = event.target;
    if (value) {
      this.setState({ modelId: value });
    }
  };

  public render() {
    const {
      pages: { pages, currentPageId, changeCurrentPage },
    } = this.injected;
    const { modalVisible } = this.state;

    return (
      <div>
        <Modal
          title="Page Details"
          visible={modalVisible}
          okText="Submit"
          width={800}
          onCancel={this.toggleModal}
          onOk={this._addPage}
        >
          <form>
            <label>
              Page Name:
              <input
                type="string"
                value={this.state.pageName}
                onChange={this.handleChangeName}
              />
            </label>
            <br />
            <br />
            <label>
              Model Id:
              <input
                type="string"
                value={this.state.modelId}
                onChange={this.handleChangeModelId}
              />
            </label>
          </form>
        </Modal>
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
              onClick={this.toggleModal}
              type="primary"
              shape="circle"
              icon="plus"
            />
          </ButtonContainer>
        </BottomBarWrapper>
      </div>
    );
  }
}

export default inject('pages')(observer(BottomBar));
