import React from 'react';
import { Layout, Collapse } from 'antd';
import styled from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import uuid from 'uuid/v1';

import FunctionModal from '../FunctionModal';
import ExpandIcon from './../ExpandIcon';
import CreateIcon from './../CreateIcon';
import Sources from './../Sources';
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
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
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
  const [sources, setSource] = React.useState<SourceType>(['S1']);
  const [functions, setFunctions] = React.useState<FunctionType[]>([
    { id: uuid(), name: '⅀', numberOfInputs: 3, numberOfOutputs: 1 },
  ]);
  const [isFunctionModalVisible, setFunctionModal] = React.useState<boolean>(
    false
  );
  const [connections, setConnections] = React.useState<ConnectionType[]>([]);

  const onFunctionCreate = (func: FunctionType) => {
    setFunctions(functions.concat(func));
    setFunctionModal(false);
  };

  const onSourceCreate = () => {
    const sourceLength = sources.length;
    setSource(sources.concat(`S${sourceLength + 1}`));
  };

  const onOpenFunctionModal = () => {
    setFunctionModal(true);
  };

  const onCloseFunctionModal = () => {
    setFunctionModal(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (destination) {
      const newConnection = {
        functionId: draggableId,
        sources: [],
        output: [],
      };
      setConnections(connections.concat(newConnection));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
              header="Sources"
              extra={<CreateIcon onIconClick={onSourceCreate} />}
              key="1"
            >
              <Sources sources={sources} />
            </Panel>
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
    </DragDropContext>
  );
};

export default AppLayout;
