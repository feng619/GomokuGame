import React from 'react';
import Header from './header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default (props) => {
  return (
    <MuiThemeProvider>
      <div>
        <Header />
        {props.children}
      </div>
    </MuiThemeProvider>
  );
}
