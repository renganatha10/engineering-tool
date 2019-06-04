import React from 'react';
import { Icon } from 'antd';

interface Props {
  isActive: boolean;
}

const ExpandIcon = ({ isActive }: Props) => (
  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
);

export default ExpandIcon;
