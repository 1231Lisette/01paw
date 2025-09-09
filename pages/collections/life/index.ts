import { defineCollection } from 'valaxy'

export default defineCollection({
  key: 'life',
  title: '日常碎碎念',
  cover: 'https://cover.sli.dev',
  description: '记录',
  items: [
    {
      title: '数模遗憾',
      // 文章唯一索引，对应路径为 `pages/collections/hamster/1.md`
      key: '1',
    },
  ]
})