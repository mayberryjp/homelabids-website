import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme: {
        dark: true,
        colors: {
          blush: "#f09fa6",
          orange: "#f86b40",
          rose: "#f63c61",
          burgundy: "#a0364d",
          "background-100": "#161b22",
          "background-200": "#161b22",
        },
      },
    },
  },
});

export default vuetify;
