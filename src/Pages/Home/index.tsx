import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import DeviceStore from '../../MobxStore/deviceStore';

import FunctionProvoider from '../../Contexts/FunctionStoreContext';
import FunctionsProvoider, {
  FunctionsContext,
  Function,
} from '../../Contexts/FunctionsStoreContext';

import Canvas from './Canvas';
import RightBar from './RightBar';
import LeftBar from './LeftBar';
import BottomBar from './BottomBar';

const HomeWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

interface State {
  rehydrating: boolean;
  functions: Function[];
}

interface LeftBarProps {
  devices: typeof DeviceStore.Type;
}

class TypesCreation extends PureComponent<{}, State> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      rehydrating: true,
      functions: [],
    };
  }

  public componentDidMount() {
    this._loadPeristedItems();
  }

  private _loadPeristedItems = async () => {
    const stringfiedFunctions = window.localStorage.getItem('functions');

    let functions = [];

    if (stringfiedFunctions) {
      try {
        const parsedFunctions = JSON.parse(stringfiedFunctions);
        functions = parsedFunctions;
      } catch (err) {
        functions = [];
      }
    }

    this.setState({
      rehydrating: false,
      functions,
    });
  };

  public get injected() {
    return this.props as LeftBarProps;
  }

  public render() {
    const { rehydrating, functions } = this.state;
    const { devices } = this.injected;
    if (rehydrating) {
      return <Skeleton active={rehydrating} />;
    }

    return (
      <FunctionProvoider>
        <FunctionsProvoider initFunctions={functions}>
          <HomeWrapper>
            <FunctionsContext.Consumer>
              {({ functions }) => {
                return <Canvas functions={functions} />;
              }}
            </FunctionsContext.Consumer>
            <LeftBar devices={devices} />
            <RightBar />
            <BottomBar />
          </HomeWrapper>
        </FunctionsProvoider>
      </FunctionProvoider>
    );
  }
}

export default inject('devices')(observer(TypesCreation));
