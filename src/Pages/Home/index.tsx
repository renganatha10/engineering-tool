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
import DevicesProvoider, { Device } from '../../Contexts/DevicesContext';

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
  devices: Device[];
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
      devices: [],
    };
  }

  public componentDidMount() {
    this._loadPeristedItems();
  }

  private _loadPeristedItems = async () => {
    const stringfiedDevices = window.localStorage.getItem('devices');
    const stringfiedFunctions = window.localStorage.getItem('functions');

    let functions = [];
    let devices = [];

    if (stringfiedFunctions) {
      try {
        const parsedFunctions = JSON.parse(stringfiedFunctions);
        functions = parsedFunctions;
      } catch (err) {
        functions = [];
      }
    }

    if (stringfiedDevices) {
      try {
        const parsedDevices = JSON.parse(stringfiedDevices);
        devices = parsedDevices;
      } catch (err) {
        devices = [];
      }
    }

    this.setState({
      rehydrating: false,
      functions,
      devices,
    });
  };

  public get injected() {
    return this.props as LeftBarProps;
  }

  public render() {
    const { rehydrating, devices, functions } = this.state;
    const { devices: storeDevices } = this.injected;
    if (rehydrating) {
      return <Skeleton active={rehydrating} />;
    }

    return (
      <FunctionProvoider>
        <FunctionsProvoider initFunctions={functions}>
          <DevicesProvoider initDevices={devices}>
            <HomeWrapper>
              <FunctionsContext.Consumer>
                {({ functions }) => {
                  return <Canvas functions={functions} />;
                }}
              </FunctionsContext.Consumer>
              <LeftBar devices={storeDevices} />
              <RightBar />
              <BottomBar />
            </HomeWrapper>
          </DevicesProvoider>
        </FunctionsProvoider>
      </FunctionProvoider>
    );
  }
}

export default inject('devices')(observer(TypesCreation));
