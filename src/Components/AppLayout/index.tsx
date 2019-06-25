import React from 'react';
import { Layout, Collapse } from 'antd';
import styled from 'styled-components';
import uuid from 'uuid/v1';

import FunctionModal from '../FunctionModal';
import ExpandIcon from './../ExpandIcon';
import CreateIcon from './../CreateIcon';
import Functions from './../Functions';

type SourceType = string[];
interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface ConnectionType {
  functionId: string;
  sources: string[];
  output: string[];
}

const { Sider } = Layout;
const { Panel } = Collapse;

const LeftBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: white;
`;

const StyledSideBar = styled(Sider)`
  overflow: scroll;
`;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
};

const collpaseStyle = {
  borderRadius: 0,
};

const AppLayout: React.FC = () => {
  const [functions, setFunctions] = React.useState<FunctionType[]>([
    { id: uuid(), name: '⅀', numberOfInputs: 3, numberOfOutputs: 1 },
  ]);
  const [isFunctionModalVisible, setFunctionModal] = React.useState<boolean>(
    false
  );

  const onFunctionCreate = (func: FunctionType) => {
    setFunctions(functions.concat(func));
    setFunctionModal(false);
  };

  const onOpenFunctionModal = () => {
    setFunctionModal(true);
  };

  const onCloseFunctionModal = () => {
    setFunctionModal(false);
  };

  return (
    <LeftBar>
      <StyledSideBar width={250} collapsible={false}>
        <Collapse
          style={collpaseStyle}
          bordered={true}
          defaultActiveKey={['2']}
          accordion={true}
          expandIcon={ExpandIcon}
        >
          <Panel
            style={customPanelStyle}
            header="Functions"
            extra={<CreateIcon onIconClick={onOpenFunctionModal} />}
            key="2"
          >
            <Functions functions={functions} />
          </Panel>
        </Collapse>
      </StyledSideBar>
      <FunctionModal
        onCreate={onFunctionCreate}
        onCancel={onCloseFunctionModal}
        isFunctionModalVisible={isFunctionModalVisible}
      />
    </LeftBar>
  );
};

export default AppLayout;
