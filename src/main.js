import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Router from "vue-router";
// import VueSocketIO from "vue-socket.io";
// import SocketIO from "socket.io-client";
// const options = { transports: ["websocket"], namespace: ["/chats"] };
// Vue.use(
//   new VueSocketIO({
//     debug: true, // debug调试，生产建议关闭
//     connection: SocketIO(process.env.VUE_APP_BASE_API, options),
//   })
// );

// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: process.env.VUE_APP_BASE_API,
//     options,
//     vuex: {
//       store,
//       actionPrefix: "SOCKET_",
//       mutationPrefix: "SOCKET_",
//     },
//   })
// );

Vue.use(ElementUI);
Vue.config.productionTip = false;
document.title = process.env.VUE_APP_PAGETITLE;
//阻止路由重复提示
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
