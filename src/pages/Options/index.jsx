import React, { Component } from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';

render(
  <Options title={'options'} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
