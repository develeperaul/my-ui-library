import DefaultTheme from 'vitepress/theme'
import MyGlobalComponent from './components/MyGlobalComponent.vue'
import Calendar from '../../../src/components/Calendar.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Регистрация компонента
    app.component('Calendar', Calendar)
  }
}
