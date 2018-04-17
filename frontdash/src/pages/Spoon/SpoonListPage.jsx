import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import MediaList from '../../components/MediaList/MediaList';
import MediaItem from '../../components/MediaList/MediaItem';

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
                <div>
                    Loading

                </div>
            );
        }
        const spoons = this.props.store.spoonStore.loadedSpoons;
        const user = this.props.store.currentUser;

        if (spoons.length === 0) {
            return <div>
                No spoons have been created yet.
                {user.isAdmin ? <span> Create some in the <a href='/admin' target='_blank'>Jollof Admin</a></span> : ""}
            </div>
        }

        const items = spoons.map((it) => {
            return {
                image: it.pic ? it.pic.url : null,
                title: it.name,
                info: it.isMetal ? 'Metalic' : ''
            }

        });

        return (
            <section>
                <h2>Spoons</h2>
                <MediaList items={items}/>
            </section>

        );
    }
}
