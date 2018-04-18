import React, {Component} from 'react';

export default class MediaItem extends Component {

    render() {

        return (
            <div>
                <div class="uk-card uk-card-default uk-grid-collapse uk-margin" uk-grid="">
                    <a class="uk-card-media-left uk-cover-container uk-width-1-4@m" href={this.props.href}>
                            <img src={this.props.image || '/static/images/null.png'} alt="" uk-cover=""/>
                            <canvas width="300" height="250"/>
                    </a>
                    <div className="uk-width-expand@m">
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
