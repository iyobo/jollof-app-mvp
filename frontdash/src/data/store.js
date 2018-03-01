import {observable} from 'mobx';
import RiceStore from './RiceStore';
import SpoonStore from './SpoonStore';

const axios = require('axios');


class Store {

    /**
     * The number of async loading actions currently being processed.
     * Use to communicate activity to your viewer.
     * @type {number}
     */
    @observable loadCount = 0;

    @observable isAuthenticated = false;
    /**
     * if authenticated, will have current user details. See app/models/User.js.
     * @type {{name, firstName, lastName, email, ...}}
     */
    @observable currentUser = {};

    constructor() {

        this._init()
    }

    /**
     * It is a good mobx practice to have a rootstore (this) that loads other child stores.
     * You can easily save/load a state tree this way in the future if you need it,
     * and it also serves as an easy way to share certain data/actions accross stores if you ever need to e.g UI loader state.
     *
     * @private
     */
    _init() {
        this.riceStore = new RiceStore(this);
        this.spoonStore = new SpoonStore(this);

        this.authenticate(); //attempt to check if the user is logged in
    }

    authenticate() {

        this.loadCount++;
        return axios.get('/api/v1/me').then(({ data }) => {
            this.loadCount--;
            this.currentUser = data;

            if (this.currentUser) {
                this.isAuthenticated = true;
            }else{
                //Because this means the user is not authenticated, redirect to login page!
                //window.location.href = "/login"
            }
        }).catch((e) => {
            this.handleLoadError(e);

            //Because this means the user cannot be authenticated, redirect to login page!
            //window.location.href = "/login"
        });
    }

    handleLoadError(e) {
        console.error(e)
        store.loadCount--;
        if (e.response && e.response.data && e.response.data.message)
            alert(e.response.data.message);
        throw e;
    }
}

const store = new Store();

export default store;