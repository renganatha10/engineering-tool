import React from 'react';
import { Provider } from 'mobx-react';
import uuid from 'uuid/v4';
import { onSnapshot } from 'mobx-state-tree';

import Home from './Home';
import PagesStore from './../MobxStore/pages';
import DeviceStore from './../MobxStore/deviceStore';
import GlobalStyles from './../utils/globalStyles';

interface State {
  pageStore: typeof PagesStore.Type;
  loading: boolean;
  deviceStore: typeof DeviceStore.Type;
}

class App extends React.PureComponent<{}, State> {
  public initialPageId = uuid();
  public pagesInitialState = {
    pages: [
      {
        id: this.initialPageId,
        name: 'Page 1',
        modelId: '',
        canvasObjects: [],
      },
    ],
    currentPageId: this.initialPageId,
  };

  public deviceInitialState = {};

  public constructor(props: {}) {
    super(props);

    const pageStore = PagesStore.create(this.pagesInitialState);
    this.state = {
      pageStore,
      loading: true,
      deviceStore: DeviceStore.create(this.deviceInitialState),
    };
  }

  public componentDidMount() {
    let { pageStore, deviceStore } = this.state;

    const pagesRestored = window.localStorage.getItem('pagesStore');
    const deviceStoreRehydrated = window.localStorage.getItem('deviceStore');

    if (pagesRestored) {
      this.pagesInitialState = JSON.parse(pagesRestored);
      pageStore = PagesStore.create(this.pagesInitialState);
    }

    if (deviceStoreRehydrated) {
      this.deviceInitialState = JSON.parse(deviceStoreRehydrated);
      deviceStore = DeviceStore.create(this.deviceInitialState);
    }

    onSnapshot(pageStore, snapShot => {
      window.localStorage.setItem('pagesStore', JSON.stringify(snapShot));
    });

    onSnapshot(deviceStore, snapShot =>
      window.localStorage.setItem('deviceStore', JSON.stringify(snapShot))
    );

    this.setState({
      pageStore,
      loading: false,
      deviceStore,
    });
  }

  public render() {
    const { pageStore, loading, deviceStore } = this.state;
    return (
      <React.Fragment>
        <GlobalStyles />
        {loading ? (
          <div>Loading</div>
        ) : (
          <Provider pages={pageStore} devices={deviceStore}>
            <Home />
          </Provider>
        )}
      </React.Fragment>
    );
  }
}

export default App;
