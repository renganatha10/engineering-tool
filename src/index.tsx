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

// //@ts-ignore
// Array.prototype.remove = function(element: any) {
//   if (!element) {
//     throw Error('Elment not found');
//   }
//   if (typeof element === 'string' || typeof element === 'number') {
//     return this.filter(item => item !== element);
//   } else if (typeof element === 'function') {
//     return this.filter(element);
//   } else if (typeof element === 'object') {
//     const indexOfElement = this.indexOf(element);
//     return [
//       ...this.slice(0, indexOfElement),
//       ...this.slice(indexOfElement + 1),
//     ];
//   } else {
//     return this;
//   }
// };
