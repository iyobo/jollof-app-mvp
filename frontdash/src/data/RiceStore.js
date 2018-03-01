import {observable} from 'mobx';

const axios = require('axios');

class RiceStore {

    app = null;
    @observable loadedRice = null;

    constructor(app) {
        this.app = app;
    }

    loadRice(id) {
        this.app.loadCount++;
        return axios.get(`/api/v1/rice/${id}`).then(({ data }) => {

            this.loadedRice = data;
            this.app.loadCount--;
            return data; //Be nice and return something for whatever would like to chain this promise.
        }).catch(this.app.handleLoadError);
    }

}

export default RiceStore;