import React from 'react';
import { Provider } from 'mobx-react';
import uuid from 'uuid/v4';
import { onSnapshot } from 'mobx-state-tree';

import Home from './Home';
import PagesStore from './../MobxStore/pages';
import GlobalStyles from './../utils/globalStyles';

interface State {
  pageStore: typeof PagesStore.Type;
  loading: boolean;
}

class App extends React.PureComponent<{}, State> {
  public initialPageId = uuid();
  public pagesInitialState = {
    pages: [{ id: this.initialPageId, name: 'Page 1', canvasObjects: [] }],
    currentPageId: this.initialPageId,
  };

  public constructor(props: {}) {
    super(props);

    const pageStore = PagesStore.create(this.pagesInitialState);
    this.state = {
      pageStore,
      loading: true,
    };
  }

  public componentDidMount() {
    let { pageStore } = this.state;
    const pagesRestored = window.localStorage.getItem('pagesStore');
    if (pagesRestored) {
      this.pagesInitialState = JSON.parse(pagesRestored);
      pageStore = PagesStore.create(this.pagesInitialState);
    }
    onSnapshot(pageStore, snapShot => {
      window.localStorage.setItem('pagesStore', JSON.stringify(snapShot));
    });
    this.setState({
      pageStore,
      loading: false,
    });
  }

  public render() {
    const { pageStore, loading } = this.state;
    return (
      <React.Fragment>
        <GlobalStyles />
        {loading ? (
          <div>Loading</div>
        ) : (
          <Provider pages={pageStore}>
            <Home />
          </Provider>
        )}
      </React.Fragment>
    );
  }
}

export default App;
