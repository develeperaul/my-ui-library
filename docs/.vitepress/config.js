export default {
  title: 'My UI Library',
  description: 'UI компоненты на Vue 3',
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Calendar', link: '/components/calendar' }
    ],
    sidebar: [
      {
        text: 'Calendar',
        collapsed: true,
        items: [
          { text: 'Демо', link: '/components/Calendar/demo' },
          { text: 'Установка', link: '/components/Calendar/' }
        ]
      }
    ]
  }
}
