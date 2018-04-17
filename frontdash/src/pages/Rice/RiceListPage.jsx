import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import MediaList from '../../components/MediaList/MediaList';

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
                <div>
                    loading
                </div>
            );
        }
        const rices = this.props.store.riceStore.loadedRice;
        const user = this.props.store.currentUser;

        if (rices.length === 0) {
            return <div>
                No Rice has been created yet.
                {user.isAdmin ? <span> Create some in the <a href='/admin' target='_blank'>Jollof Admin</a></span> : ""}
            </div>
        }

        const items = rices.map((it) => {
            return {
                image: it.pic ? it.pic.url : null,
                title: it.name,
                info: it.notes,
            }
        });

        return (
            <section>
                <h2>Rice Dishes</h2>

                <MediaList items={items}/>
            </section>
        );
    }
}
