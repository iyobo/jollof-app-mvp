import React, {Component} from 'react';
import MediaItem from './MediaItem';

export default class MediaList extends Component {

    render() {

        return (
            <div>
                {this.props.items.map((it, idx)=>{
                    return <MediaItem  key={idx} {...it} />
                })}
            </div>
        );
    }
}
