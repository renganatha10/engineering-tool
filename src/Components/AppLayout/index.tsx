import * as React from 'react';
import { Layout, Collapse } from 'antd';
import styled from 'styled-components';

import ExpandIcon from './ExpandIcon';

const { Content, Sider } = Layout;
const { Panel } = Collapse;

const Container = styled(Layout)`
  height: 100%;
`;

const sourceText = `
  ListDown the Source
`;

const functionText = `ListDown Funciton`;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
};

const collpaseStyle = {
  borderRadius: 0,
};

const AppLayout: React.FC = props => {
  const { children } = props;
  return (
    <Container>
      <Sider width={250} collapsible={false}>
        <Collapse
          style={collpaseStyle}
          bordered={true}
          defaultActiveKey={['1']}
          expandIcon={ExpandIcon}
        >
          <Panel style={customPanelStyle} header="Sources" key="1">
            <p>{sourceText}</p>
          </Panel>
          <Panel style={customPanelStyle} header="Functions" key="2">
            <p>{functionText}</p>
          </Panel>
        </Collapse>
      </Sider>
      <Container>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default AppLayout;
