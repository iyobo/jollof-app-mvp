import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container, Header} from 'semantic-ui-react'
import SpoonListPage from '../pages/Spoon/SpoonListPage';
import SpoonItemPage from '../pages/Spoon/SpoonItemPage';
import RiceListPage from '../pages/Rice/RiceListPage';
import RiceItemPage from '../pages/Rice/RiceItemPage';

class FrontDashLayout extends Component {
    render() {
        return (
            <div className="frontdash">
                <Header as='h1'>Dashboard Header</Header>

                <Container fluid>
                    <Switch>
                        <Route path="/spoon" name="Spoon" component={SpoonListPage}/>
                        <Route path="/spoon/:id" name="Spoon" component={SpoonItemPage}/>

                        <Route path="/rice" name="Rice" component={RiceListPage}/>
                        <Route path="/rice/:id" name="Rice" component={RiceItemPage}/>

                        <Redirect from="/" to="/spoon"/>
                    </Switch>
                </Container>

            </div>
        );
    }
}

export default FrontDashLayout;