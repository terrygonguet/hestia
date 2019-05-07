export default new Vuex.Store({
    state: {
        config: {
            cols: 6,
            rows: 4,
            colorMain: "#000000",
            colorAccent: "#35acce",
            colorBg: "#ffffff",
            colorBgBlock: "#ffffff",
            colorBorder: "#454545",
        },
        widgets: [],
        titleWidget: {
            type: "Message",
            message: "Double click me!",
            messages: ["Enter to add"],
        },
    },
    mutations: {
        addWidget(state) {
            state.widgets.push({
                type: "Category",
                icon: "aperture",
                id: Date.now()
                    .toString(36)
                    .substr(2),
                links: [],
                title: "Untitled",
                height: 1,
                width: 1,
            });
        },
        deleteWidget(state, id) {
            state.widgets.splice(state.widgets.findIndex(w => w.id == id), 1);
        },
        reorderWidget(state, { id, delta }) {
            let l = state.widgets.length;
            let i = state.widgets.findIndex(w => w.id == id);
            let [widget] = state.widgets.splice(i, 1);
            i += delta;
            i = i < 0 ? 0 : i >= l ? l - 1 : i;
            state.widgets.splice(i, 0, widget);
        },
    },
    actions: {
        async restore({ state }) {
            let data = await browser.storage.local.get(undefined);
            Object.assign(state.config, data.config);
            Object.assign(state.titleWidget, data.titleWidget);
            state.widgets = data.widgets || [];
        },
        async persist({ state }) {
            await browser.storage.local.set(clone(state));
        },
    },
});
