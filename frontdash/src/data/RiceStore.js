import {observable, action} from 'mobx';

const axios = require('axios');

class RiceStore {

    app = null;
    @observable loadedRice = [];

    constructor(app) {
        this.app = app;

    }
    
    loadRice() {
        this.app.loadCount++;
        return axios.get(`/api/v1/Rice`).then(({ data }) => {

            this.loadedRice = data;
            this.app.loadCount--;
            return data; //Be nice and return something for whatever would like to chain this promise.
        }).catch(this.app.handleLoadError);
    }

}

export default RiceStore;