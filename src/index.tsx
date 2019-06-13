import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import GlobalStyles from './Utils/globalStyles';

import App from './Pages/Home';

import NodeStore from './store/node';

const nodeStore = NodeStore.create({ nodes: {} });

ReactDOM.render(
  <Provider nodeStore={nodeStore}>
    <React.Fragment>
      <GlobalStyles />
      <App />
    </React.Fragment>
  </Provider>,
  document.getElementById('root')
);
