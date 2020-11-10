import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";
import http from "./http";

import "./assets/css/common.css";

Vue.config.productionTip = false;

Vue.prototype.$http = http;

Vue.mixin({
    computed: {
        uploadUrl() {
            return this.$http.defaults.baseURL + "/upload";
        },
    },
    methods: {
        handleUploadError(err) {
            let msg = "上传错误";
            if (err.status === 422) {
                msg = JSON.parse(err.message).msg;
            }
            this.$message({ type: "error", message: msg });
        },
        getAuthHeaders() {
            return {
                Authorization: `Bearer ${sessionStorage.token || ""}`,
            };
        },
    },
});

// 按钮权限自定义指令
Vue.directive("permission", {
    inserted(el, binding) {
        let rights = router.currentRoute.meta.rights;
        const { action, effect } = binding.value;
        if (rights) {
            if (rights.indexOf(action.toUpperCase()) === -1) {
                if (effect == "disabled") {
                    el.disabled = true;
                    el.title = "无操作权限";
                    el.classList.add("is-disabled");
                } else {
                    el.parentNode.removeChild(el);
                }
            }
        }
    },
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
