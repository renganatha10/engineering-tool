import React from 'react';
import ReactDOM from 'react-dom';

import GlobalStyles from './utils/globalStyles';

import App from './Pages/Home';

ReactDOM.render(
  <React.Fragment>
    <GlobalStyles />
    <App />
  </React.Fragment>,
  document.getElementById('root')
);
