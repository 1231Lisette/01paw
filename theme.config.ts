import { defineThemeConfig } from 'valaxy-theme-yun'

export default defineThemeConfig({
  // type: 'strato',
  type: 'nimbo',
  // colors: {
  //   primary: 'red',
  // },
  // bg_image: {},
  nav: [
    { text: 'menu.posts', link: '/posts/', icon: 'i-ri-article-line' },
    { text: '项目列表', link: '/projects', icon: 'i-ri-gallery-view' },
    { text: '大佬们', link: '/links/', icon: 'i-ri-link' },
  ],

  pages: [
    {
      name: '项目列表',
      url: '/projects',
      icon: 'i-ri-gallery-view',
      color: 'hotpink',
    },
    {
      name: '大佬们',
      url: '/links/',
      icon: 'i-ri-link',
    color: 'dodgerblue',
    },
  ],

  footer: {
    since: 2025,
    beian: {
      enable: false,
      icp: '苏ICP备17038157号',
    },
    icon: {
      animated: true,
    },
  },
})
