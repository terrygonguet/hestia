import App from "./app.js";
import store from "./store.js";
Vue.config.productionTip = false;
const app = new Vue({
    el: "#app",
    template: `<App/>`,
    components: { App },
    store,
});
store.dispatch("restore").then(_ => store.commit("newtab"));
window.addEventListener("beforeunload", async (e) => {
    await store.dispatch("persist");
});
