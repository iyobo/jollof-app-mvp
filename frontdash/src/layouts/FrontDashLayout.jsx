import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container, Header, Menu} from 'semantic-ui-react'
import SpoonListPage from '../pages/Spoon/SpoonListPage';
import RiceListPage from '../pages/Rice/RiceListPage';

class FrontDashLayout extends Component {
    render() {
        return (
            <Container className="frontdash">

                <Menu secondary>
                    <Menu.Item
                        name='spoon'
                        active={this.props.location.pathname.startsWith('/spoon')}
                        href='#/spoon'
                    >
                        Spoon
                    </Menu.Item>

                    <Menu.Item
                        name='rice'
                        active={this.props.location.pathname.startsWith('/rice')}
                        href='#/rice'
                    >
                        Rice
                    </Menu.Item>

                </Menu>
                <Container >
                    <div class="ui vertical pad20 ">
                        {/*<div class="ui middle aligned stackable grid container">*/}
                            {/*<div class="row">*/}
                                <Switch>
                                    <Route path="/spoon" name="Spoon" component={SpoonListPage}/>
                                    <Route path="/rice" name="Rice" component={RiceListPage}/>

                                    <Redirect from="/" to="/spoon"/>
                                </Switch>
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                </Container>

            </Container>
        );
    }
}

export default FrontDashLayout;