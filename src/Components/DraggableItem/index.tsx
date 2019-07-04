import React, { useCallback } from 'react';
import styled from 'styled-components';

const ItemWrapper = styled.div`
  padding: 10px;
  background-color: lightgreen;
  text-align: center;
  margin: 10px;
`;

type DraggbleItemType = 'func' | 'device';

interface Props {
  name: string;
  id: string;
  type: DraggbleItemType;
}

const DraggableItem = ({ name, id, type }: Props) => {
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const currentId = e.currentTarget.dataset.id;
      if (currentId) {
        e.dataTransfer.setData('id', currentId);
        e.dataTransfer.setData('type', type);
      }
    },
    [type]
  );

  return (
    <ItemWrapper onDragStart={onDragStart} data-id={id} draggable={true}>
      <span>{name} </span>
    </ItemWrapper>
  );
};

export default DraggableItem;
