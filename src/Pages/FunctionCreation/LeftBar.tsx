import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex: 0.2;
  border-left: 1px solid #1890ff;
  border-right: 1px solid #1890ff;
  padding: 10px;
  justify-content: center;
`;

const InnerWrapper = styled.div`
  width: 100%;
`;

const Source = styled.div`
  background-color: #1890ff;
  margin: 10px;
  padding: 10px;
  text-align: center;

  & > span {
    color: white;
  }
`;

const FunctionLeftBar = () => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const currentId = e.currentTarget.dataset.id;
    if (currentId) {
      e.dataTransfer.setData('id', currentId);
    }
  };

  return (
    <Wrapper>
      <InnerWrapper>
        <Source draggable={true} data-id={'input'} onDragStart={onDragStart}>
          <span> Input </span>
        </Source>
        <Source
          draggable={true}
          data-id={'condition'}
          onDragStart={onDragStart}
        >
          <span> Condition </span>
        </Source>
        <Source draggable={true} data-id={'output'} onDragStart={onDragStart}>
          <span> Output </span>
        </Source>
      </InnerWrapper>
    </Wrapper>
  );
};

export default FunctionLeftBar;
