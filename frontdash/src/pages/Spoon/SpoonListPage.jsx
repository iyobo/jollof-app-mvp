import React, {Component} from 'react';
import {Container, Dimmer, Item, Loader, Segment} from 'semantic-ui-react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class SpoonListPage extends Component {
    constructor(props) {
        super(props);
        props.store.spoonStore.loadSpoons();
    }

    render() {
        if (this.props.store.loadCount > 0) {
            return (
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>

                </Segment>
            );
        }
        const spoons = this.props.store.spoonStore.loadedSpoons;
        const user = this.props.store.currentUser;

        if (spoons.length === 0) {
            return <div>
                No spoons have been created yet.
                {user.isAdmin ? <span> Create some in the <a href='/admin' target='_blank'>BackAdmin</a></span> : ""}
            </div>
        }

        const items = spoons.map((it) => {
            return {
                childKey: null,
                image: it.pic ? it.pic.url : '/static/images/null.png',
                header: it.name,
            }
        });

        return (
            <Container className="animated fadeIn page">
                <h2>Spoons</h2>
                <Item.Group items={items}/>
            </Container>
        );
    }
}
