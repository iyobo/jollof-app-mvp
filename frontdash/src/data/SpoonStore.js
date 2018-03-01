import {observable} from 'mobx';

const axios = require('axios');

class SpoonStore {

    app = null;
    @observable loadedSpoon = null;

    constructor(app) {
        this.app = app;
    }

    loadSpoon(id) {
        this.app.loadCount++;
        return axios.get(`/api/v1/spoon/${id}`).then(({ data }) => {

            this.loadedSpoon = data;
            this.app.loadCount--;
            return data; //Be nice and return something for whatever would like to chain this promise.
        }).catch(this.app.handleLoadError);
    }

}

export default SpoonStore;