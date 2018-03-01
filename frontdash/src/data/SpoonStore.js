import {observable} from 'mobx';

const axios = require('axios');

class SpoonStore {

    app = null;
    @observable loadedSpoons = [];

    constructor(app) {
        this.app = app;
    }

    loadSpoons() {
        this.app.loadCount++;
        return axios.get(`/api/v1/Spoon`).then(({ data }) => {

            this.loadedSpoons = data;
            this.app.loadCount--;
            return data; //Be nice and return something for whatever would like to chain this promise.
        }).catch(this.app.handleLoadError);
    }

}

export default SpoonStore;