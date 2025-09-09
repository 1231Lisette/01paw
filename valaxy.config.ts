//siteConfig: 站点信息配置，这部分内容面向站点展示，且在不同主题中也是通用的格式
//themeConfig: 主题配置，这部分内容仅在特定主题生效
//runtimeConfig: 运行时的配置（由 Valaxy 自动生成），用户无需配置
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonComponents } from 'valaxy-addon-components'
// import { addonWaline } from 'valaxy-addon-waline'
import { addonAlgolia } from 'valaxy-addon-algolia'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  siteConfig: {
    url: 'https://1231Lisette.github.io/01paw/',
    comment: {
      enable: true,
    },
  },

  theme: 'yun',

  vite: {
    base: '/01paw/', // 必须加在这，注意仓库名
  },

  themeConfig: {
    banner: {
      enable: true,
      title: '二进制代码',
    },
  },

  addons: [
    addonComponents(),
    // addonWaline({
    //   serverURL: 'https://your-waline-url',
    // }),
    addonAlgolia({
      appId: '',
      apiKey: '',
      indexName: '',
    }),
  ],

  markdown: {
    /**
     * KaTeX options
     * @see https://katex.org/docs/options.html
     */
    katex: {
      strict: false,
    },
  },
})
