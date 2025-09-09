//siteConfig: 站点信息配置，这部分内容面向站点展示，且在不同主题中也是通用的格式
//mthemeConfig: 主题配置，这部分内容仅在特定主题生效
//runtimeConfig: 运行时的配置（由 Valaxy 自动生成），用户无需配置
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  // 🔑 新增 base 和 url
  base: '/01paw/',
  url: 'https://1231Lisette.github.io/01paw/',
  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '云游君的小站',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备17038157号',
      },
    },
  },

  unocss: { safelist },
})
