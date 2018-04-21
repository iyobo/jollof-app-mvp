import React, {Component} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import SpoonListPage from '../pages/Spoon/SpoonListPage';
import RiceListPage from '../pages/Rice/RiceListPage';
import ProfilePage from '../pages/profile/ProfilePage';

class FrontDashLayout extends Component {
    render() {
        return (
            <section>
                <div class="uk-container">
                    <div class="uk-grid-divider" uk-grid="">

                        <div class="uk-card uk-width-1-5@s">

                            <ul class="uk-nav-primary uk-nav-pill uk-nav-parent-icon " uk-nav="">
                                <li class={this.props.location.pathname.startsWith('/profile') ? 'uk-active' : ''}>
                                    <Link to='profile'>Profile</Link></li>
                                <li class={this.props.location.pathname.startsWith('/spoon') ? 'uk-active' : ''}>
                                    <Link to='spoon'>Spoon</Link></li>
                                <li class={this.props.location.pathname.startsWith('/rice') ? 'uk-active' : ''}>
                                    <Link to='rice'>Rice</Link></li>
                            </ul>

                        </div>

                        <div class="uk-width-4-5@s">

                            <div class="uk-padding">
                                <Switch>
                                    <Route path="/profile" name="Profile" component={ProfilePage}/>
                                    <Route path="/spoon" name="Spoon" component={SpoonListPage}/>
                                    <Route path="/rice" name="Rice" component={RiceListPage}/>

                                    <Redirect from="/" to="/profile"/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default FrontDashLayout;