import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import { Provider } from 'mobx-react';
import { onSnapshot } from 'mobx-state-tree';

import DeviceStore from '../../store/deviceStore';

import FunctionProvoider from '../../Contexts/FunctionStoreContext';
import FunctionsProvoider, {
  FunctionsContext,
  Function,
} from '../../Contexts/FunctionsStoreContext';
import DevicesProvoider, {
  DevicesContext,
  Device,
} from '../../Contexts/DevicesContext';

import Canvas from './Canvas';
import RightBar from './RightBar';
import LeftBar from './LeftBar';

const HomeWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

interface State {
  rehydrating: boolean;
  functions: Function[];
  devices: Device[];
  deviceStore: typeof DeviceStore.Type;
}

class TypesCreation extends PureComponent<{}, State> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      rehydrating: true,
      functions: [],
      devices: [],
      deviceStore: DeviceStore.create(this.deviceInitialState),
    };
  }

  public deviceInitialState = {};

  public componentDidMount() {
    this._loadPeristedItems();
  }

  private _loadPeristedItems = async () => {
    const stringfiedDevices = window.localStorage.getItem('devices');
    const stringfiedFunctions = window.localStorage.getItem('functions');

    const deviceStoreRehydrated = window.localStorage.getItem('deviceStore');

    let functions = [];
    let devices = [];

    let { deviceStore } = this.state;

    if (deviceStoreRehydrated) {
      this.deviceInitialState = JSON.parse(deviceStoreRehydrated);
      deviceStore = DeviceStore.create(this.deviceInitialState);
    }

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

    onSnapshot(deviceStore, snapShot =>
      window.localStorage.setItem('deviceStore', JSON.stringify(snapShot))
    );

    this.setState({
      rehydrating: false,
      functions,
      devices,
      deviceStore,
    });
  };

  public render() {
    const { rehydrating, devices, functions, deviceStore } = this.state;
    if (rehydrating) {
      return <Skeleton active={rehydrating} />;
    }

    return (
      <Provider deviceStore={deviceStore}>
        <FunctionProvoider>
          <FunctionsProvoider initFunctions={functions}>
            <DevicesProvoider initDevices={devices}>
              <HomeWrapper>
                <FunctionsContext.Consumer>
                  {({ functions }) => {
                    return (
                      <DevicesContext.Consumer>
                        {({ devices }) => {
                          return (
                            <Canvas devices={devices} functions={functions} />
                          );
                        }}
                      </DevicesContext.Consumer>
                    );
                  }}
                </FunctionsContext.Consumer>
                <LeftBar deviceStore={deviceStore} />
                <RightBar />
              </HomeWrapper>
            </DevicesProvoider>
          </FunctionsProvoider>
        </FunctionProvoider>
      </Provider>
    );
  }
}

export default TypesCreation;
