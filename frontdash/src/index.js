import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'mobx-react'

import store from './data/store';
import FrontDashLayout from './layouts/FrontDashLayout';


ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter basename={dashboardBasePath}>
            <Switch>
                <Route path="/" name="Home" component={FrontDashLayout}/>
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));