import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        props.store.userStore.loadCurrentUser().then((user) => {
            this.setState({ data: user })
        });
    }

    handleEventInput = (evt) => {
        const t = evt.target;
        const st = { ...this.state, data: { ...this.state.data, [t.name]: t.value } }

        this.setState(st);
    }

    submitForm = (evt) => {
        evt.preventDefault();
        console.log(this.state.data)

        if (this.state.data.password && this.state.data.password !== '' && this.state.data.password !== this.state.data.repeatPassword) {

            UIkit.notification({
                message: `'Password' and 'Repeat Password' must match`,
                status: 'danger',
                pos: 'top-right',
                timeout: 3000
            });

            return;
        }

        this.props.store.userStore.saveCurrentUser(this.state.data).then((user) => {

            UIkit.notification({
                message: "<span uk-icon='icon: check'></span> Profle saved",
                status: 'success',
                pos: 'top-right',
                timeout: 3000
            });

            const st = { ...this.state, data: { ...this.state.data, password: null, repeatPassword: null } }

            this.setState(st);
        })

    }

    render() {
        const user = this.state.data;

        if (!user) return <div>Loading User...</div>

        return (
            <section className="uk-animation-slide-right-small">

                <form onSubmit={this.submitForm}>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <div class="row" uk-grid="">
                        <div className="uk-width-1-2@s">
                            <img src={user.picUrl} width="100%"/>
                            <i>Change how you look, based on your email, at <a target="_blank"
                                                                               href="http://gravatar.com">gravatar.com</a>.</i>
                            <br/>
                            <br/>
                        </div>
                        <div className="uk-width-1-2@s">
                            <fieldset class="uk-fieldset uk-form-stacked">

                                <div class="uk-margin">
                                    <label class="uk-form-label" for="firstName">First Name</label>
                                    <div class="uk-form-controls">
                                        <input class="uk-input" id="firstName" type="text" placeholder="eg: Iyobo"
                                               name="firstName"
                                               required={true}
                                               value={user.firstName}
                                               onChange={this.handleEventInput}
                                        />
                                    </div>
                                </div>

                                <div class="uk-margin">
                                    <label class="uk-form-label" for="lastName">Last Name</label>
                                    <div class="uk-form-controls">
                                        <input class="uk-input" id="lastName" type="text" placeholder="eg: Iyobo"
                                               name="lastName"
                                               required={true}
                                               value={user.lastName}
                                               onChange={this.handleEventInput}
                                        />
                                    </div>
                                </div>

                                <div class="uk-margin">
                                    <label class="uk-form-label" for="email">Email</label>
                                    <div class="uk-form-controls">
                                        <input class="uk-input" id="email" type="email" placeholder="eg: Iyobo"
                                               name="email"
                                               required={true}
                                               value={user.email}
                                               onChange={this.handleEventInput}
                                        />
                                    </div>
                                </div>


                            </fieldset>

                            <h5>Change Password</h5>

                            <fieldset class="uk-fieldset uk-form-stacked">

                                <div class="uk-margin">
                                    <label class="uk-form-label" for="password">Password</label>
                                    <div class="uk-form-controls">
                                        <input class="uk-input" id="password" type="password"
                                               placeholder=""
                                               name="password"
                                               value={user.password}
                                               onChange={this.handleEventInput}
                                        />
                                    </div>
                                </div>

                                <div class="uk-margin">
                                    <label class="uk-form-label" for="repeatPassword">Repeat Password</label>
                                    <div class="uk-form-controls">
                                        <input class="uk-input" id="repeatPassword" type="password"
                                               placeholder=""
                                               name="repeatPassword"
                                               value={user.repeatPassword}
                                               onChange={this.handleEventInput}
                                        />
                                    </div>
                                </div>

                            </fieldset>

                        </div>
                    </div>

                    <input className="uk-button uk-button-primary" type="submit" value="Save"/>


                </form>


            </section>
        )
    }
}
