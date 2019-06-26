import React, { useContext } from 'react';
import { Layout, Collapse } from 'antd';
import styled from 'styled-components';
import uuid from 'uuid/v4';

import { FunctionContext } from './../../Context/FunctionStoreContext';
import { FunctionsContext } from './../../Context/FunctionsStoreContext';

import FunctionModal from './../FunctionModal';
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
  const { inputs, outputs, conditions } = useContext(FunctionContext);
  const { functions, onAddingFunction } = useContext(FunctionsContext);

  const modifiedFunctions = functions.map(func => ({
    name: func.name,
    numberOfInputs: func.inputs.length,
    numberOfOutputs: func.outputs.length,
    id: func.id,
  }));

  const [isFunctionModalVisible, setFunctionModal] = React.useState<boolean>(
    false
  );

  const onFunctionCreate = (name: string) => {
    const newFunc = {
      inputs,
      outputs,
      conditions,
      id: uuid(),
      name,
    };

    onAddingFunction && onAddingFunction(newFunc);

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
            <Functions functions={modifiedFunctions} />
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
