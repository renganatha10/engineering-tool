import React, { useCallback } from 'react';
import styled from 'styled-components';

const FunctionWrapper = styled.div`
  padding: 10px;
  background-color: lightgreen;
  text-align: center;
  margin: 10px;
`;

interface Props {
  name: string;
  id: string;
}

const FunctionBlock = ({ name, id }: Props) => {
  const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const currentId = e.currentTarget.dataset.id;
    if (currentId) {
      e.dataTransfer.setData('id', currentId);
    }
  }, []);

  return (
    <FunctionWrapper onDragStart={onDragStart} data-id={id} draggable={true}>
      <span>{name} </span>
    </FunctionWrapper>
  );
};

export default FunctionBlock;
