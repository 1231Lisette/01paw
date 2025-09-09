import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://1231Lisette.github.io/01paw/',
  lang: 'zh-CN',
  title: '01paw',
  author: {
    name: 'Lisette',
    avatar: 'https://www.yunyoujun.cn/images/avatar.jpg',
  },
  /**
   * 站点图标
   */
  favicon: 'https://www.yunyoujun.cn/favicon.svg',
  /**
   * 副标题
   */
  subtitle: 'check out my blog',
  description: '有很多话想说......',
  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/1231Lisette',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '微博',
      link: 'https://weibo.com/巷尾的贻猫',
      icon: 'i-ri-weibo-line',
      color: '#E6162D',
    },
    {
      name: 'E-Mail',
      link: 'mailto:me@2405848522qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'https://cdn.yunyoujun.cn/img/donate/qqpay-qrcode.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'https://cdn.yunyoujun.cn/img/donate/wechatpay-qrcode.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
    /**
   * 开启阅读统计
   */
  statistics: {
    enable: true,
    readTime: {
      /**
       * 阅读速度
       */
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },
  //代码高亮
  codeHeightLimit: 300,
  ///foo, /bar, /v1/about 这些路由会被重定向到 /about。
  redirects: {
    useVueRouter: false,
    rules: [
      {
        from: ['/foo', '/bar'],
        to: '/about',
      },
      {
        from: '/v1/about',
        to: '/about',
      },
    ]
  },
  mediumZoom: { enable: true },
  
})
