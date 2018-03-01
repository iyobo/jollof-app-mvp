import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'mobx-react'

import store from './data/store';
import FrontDashLayout from './layouts/FrontDashLayout';


ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/" name="Home" component={FrontDashLayout}/>
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('root'));