import React, { PureComponent } from 'react';

import AppLayout from './../../Components/AppLayout';

import GlobalStyles from './../../utils/globalStyles';

class Home extends PureComponent {
  public render() {
    return (
      <React.Fragment>
        <GlobalStyles />
        <AppLayout>I am COnente</AppLayout>
      </React.Fragment>
    );
  }
}

export default Home;
