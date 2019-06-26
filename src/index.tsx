import React from 'react';
import ReactDOM from 'react-dom';

import GlobalStyles from './Utils/globalStyles';

import App from './Pages/TypesCreation';
// import canvasRender from './FabricRenderer';

// import FabricComp from './Pages/TypesCreation/Fabric';

ReactDOM.render(
  <React.Fragment>
    <GlobalStyles />
    <App />
  </React.Fragment>,
  document.getElementById('root')
);
