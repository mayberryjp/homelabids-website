import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify-plugin";

const app = createApp(App);
app.use(router);
app.use(vuetify)
app.mount("#app");
