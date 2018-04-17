import React, {Component} from 'react';

export default class MediaItem extends Component {

    render() {

        return (
            <div>
                <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid="">
                    <div class="uk-card-media-left uk-cover-container">
                        <a href={this.props.href || '#'}>
                            <img src={this.props.image || '/static/images/null.png'} alt="" uk-cover=""/>
                            <canvas width="400" height="300"/>
                        </a>
                    </div>
                    <div>
                        <div class="uk-card-body">
                            <h3 class="uk-card-title">{this.props.title}</h3>
                            <p>{this.props.info}</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
