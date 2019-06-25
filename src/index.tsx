import React from 'react';
import ReactDOM from 'react-dom';

import GlobalStyles from './Utils/globalStyles';

import App from './Pages/TypesCreation';

ReactDOM.render(
  <React.Fragment>
    <GlobalStyles />
    <App />
  </React.Fragment>,
  document.getElementById('root')
);
