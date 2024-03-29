import React, { useCallback } from 'react';
import styled from 'styled-components';

const ItemWrapper = styled.div`
  padding: 10px;
  background-color: lightgreen;
  text-align: center;
  margin: 10px;
`;

type DraggbleItemType = 'func' | 'device' | 'timer';

interface Props {
  name: string;
  id: string;
  subType?: string;
  type: DraggbleItemType;
}

const DraggableItem = ({ name, id, type, subType }: Props) => {
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const currentId = e.currentTarget.dataset.id;
      if (currentId) {
        e.dataTransfer.setData('id', currentId);
        e.dataTransfer.setData('type', type);
        if (subType) {
          e.dataTransfer.setData('subType', subType);
        }
      }
    },
    [type, subType]
  );

  return (
    <ItemWrapper onDragStart={onDragStart} data-id={id} draggable={true}>
      <span>{name} </span>
    </ItemWrapper>
  );
};

export default DraggableItem;
