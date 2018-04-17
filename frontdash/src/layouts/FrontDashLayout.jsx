import React, {Component} from 'react';
import {Redirect, Route, Switch, Link} from 'react-router-dom';
import SpoonListPage from '../pages/Spoon/SpoonListPage';
import RiceListPage from '../pages/Rice/RiceListPage';

class FrontDashLayout extends Component {
    render() {
        return (
            <section>
                <div class="uk-container uk-padding">

                    <ul class="uk-subnav" >
                        <li class={this.props.location.pathname.startsWith('/spoon') ? 'uk-active' : ''}>
                            {/*<a href={dashboardBasePath+"/spoon}>Spoon</a>*/}
                            <Link to='spoon'>Spoon</Link>
                        </li>

                        <li class={this.props.location.pathname.startsWith('/rice') ? 'uk-active' : ''}>
                            {/*<a href={dashboardBasePath+"/rice}>Rice</a>*/}
                            <Link to='rice'>Rice</Link>
                        </li>
                    </ul>

                    <div class="uk-padding ">
                        <Switch>
                            <Route path="/spoon" name="Spoon" component={SpoonListPage}/>
                            <Route path="/rice" name="Rice" component={RiceListPage}/>

                            <Redirect from="/" to="/spoon"/>
                        </Switch>
                    </div>
                </div>
            </section>
        );
    }
}

export default FrontDashLayout;