import React, {Component} from 'react';
import {Container, Dimmer, Item, Loader, Segment} from 'semantic-ui-react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class RiceListPage extends Component {
    constructor(props) {
        super(props);
        props.store.riceStore.loadRice();
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
        const rices = this.props.store.riceStore.loadedRice;
        const user = this.props.store.currentUser;

        if (rices.length === 0) {
            return <div>
                No Rice has been created yet.
                {user.isAdmin ? <span> Create some in the <a href='/admin' target='_blank'>BackAdmin</a></span> : ""}
            </div>
        }

        const items = rices.map((it) => {
            return {
                childKey: null,
                image: it.pic ? it.pic.url : '/static/images/null.png',
                header: it.name,
                description: it.notes,
            }
        });

        return (
            <Container className="animated fadeIn page">
                <h2>Rice Dishes</h2>
                <Item.Group items={items}/>
            </Container>
        );
    }
}
