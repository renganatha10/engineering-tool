import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import uuid from 'uuid/v1';

import FunctionProvoider from '../../Contexts/FunctionStoreContext';
import FunctionsProvoider, {
  FunctionsContext,
  Function,
} from '../../Contexts/FunctionsStoreContext';
import DevicesProvoider, {
  DevicesContext,
  Device,
} from '../../Contexts/DevicesContext';
import PagesProvider, { PagesContext, Page } from '../../Contexts/PageContext';

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
  pages: Page[];
  currentPageId: string;
}

class TypesCreation extends PureComponent<{}, State> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      rehydrating: true,
      functions: [],
      devices: [],
      pages: [],
      currentPageId: '',
    };
  }

  public componentDidMount() {
    this._loadPeristedItems();
  }

  private _loadPeristedItems = () => {
    const stringfiedDevices = window.localStorage.getItem('devices');
    const stringfiedFunctions = window.localStorage.getItem('functions');
    const stringfiedPages = window.localStorage.getItem('pages');

    let functions = [];
    let devices = [];
    let pages: Page[] = [];

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

    if (stringfiedPages) {
      try {
        const parsedPages = JSON.parse(stringfiedPages);
        pages = parsedPages;
      } catch (err) {
        const newPage = {
          id: uuid(),
          name: 'Page 1',
          context: [],
        };
        pages = pages.concat(newPage);
      }
    } else {
      const newPage = {
        id: uuid(),
        name: 'Page 1',
        context: [],
      };
      pages = pages.concat(newPage);
    }

    this.setState({
      rehydrating: false,
      functions,
      devices,
      pages,
      currentPageId: pages[0] && pages[0].id,
    });
  };

  public render() {
    const {
      rehydrating,
      devices,
      functions,
      pages,
      currentPageId,
    } = this.state;
    if (rehydrating) {
      return <Skeleton active={rehydrating} />;
    }

    return (
      <FunctionProvoider>
        <FunctionsProvoider initFunctions={functions}>
          <DevicesProvoider initDevices={devices}>
            <PagesProvider initPages={pages} currentPageId={currentPageId}>
              <HomeWrapper>
                <FunctionsContext.Consumer>
                  {({ functions }) => {
                    return (
                      <DevicesContext.Consumer>
                        {({ devices }) => {
                          return (
                            <PagesContext.Consumer>
                              {({
                                updatePageObjects,
                                // pages,
                                currentPageId,
                              }) => {
                                // const currentPage = pages.find(
                                //   page => page.id === currentPageId
                                // );
                                // let canvasObjects: fabric.Object[] = [];
                                // if (currentPage) {
                                //   canvasObjects = currentPage.context;
                                // }

                                return (
                                  <Canvas
                                    devices={devices}
                                    functions={functions}
                                    // canvasObjects={canvasObjects}
                                    key={currentPageId}
                                    updatePageObjects={updatePageObjects}
                                    currentPageId={currentPageId}
                                  />
                                );
                              }}
                            </PagesContext.Consumer>
                          );
                        }}
                      </DevicesContext.Consumer>
                    );
                  }}
                </FunctionsContext.Consumer>
                <LeftBar />
                <RightBar />
                <BottomBar />
              </HomeWrapper>
            </PagesProvider>
          </DevicesProvoider>
        </FunctionsProvoider>
      </FunctionProvoider>
    );
  }
}

export default TypesCreation;
