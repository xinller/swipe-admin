import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app from './modules/app'
import user from './modules/user'
import task from './modules/task'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {},
    modules: {
        app,
        user,
        task
    },
    plugins: [createPersistedState({ storage: window.sessionStorage })],
})
export default store