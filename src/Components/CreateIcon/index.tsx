import React from 'react';
import { Icon } from 'antd';

interface Props {
  onIconClick: () => void;
}

const CreateIcon = ({ onIconClick }: Props) => {
  const onItemClick = (event: React.MouseEvent<HTMLElement>) => {
    onIconClick();
    event.stopPropagation();
  };
  return <Icon type={'plus'} onClick={onItemClick} />;
};

export default CreateIcon;
