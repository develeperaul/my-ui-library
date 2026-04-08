import DefaultTheme from 'vitepress/theme'

import Calendar from '../../../src/components/Calendar.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Регистрация компонента
    app.component('Calendar', Calendar)
  }
}
