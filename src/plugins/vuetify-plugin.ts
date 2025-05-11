import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css"; // Import MDI CSS

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
        dark: false,
        colors: {
          blush: "#f7e1e1",
          orange: "#e18a36",
          rose: "#c73e54",
          burgundy: "#3a0e18",
        },
      },
    },
  },
});

export default vuetify;
