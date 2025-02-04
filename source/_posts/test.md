---
title: test
date: 2025-02-04 13:56:39
tags:
    - try
    - Hexo
    - growth
categories: 第一次博客尝试
---
> 你好，这是我的学习博客
```bash
hexo new post xxx # 默认显示目录
hexo new page xxx # 默认不显示目录
```

- 目录

  - author: 设置作者则会显示
  - email: 自动根据邮箱获取 Gravatar 头像
  - toc: 是否显示目录（文章 post 默认显示，页面 post 默认不显示）
  - readmore: 将会首页卡片摘要末尾强制显示一个 阅读更多 按钮
  - hideTime: 强制隐藏时间显示
  - description: 描述（只出现在预览卡片上，不出现在正文中）（默认使用 400 字重以表强调，略细于加粗字体）
  - excerpt: 摘要（不需要在 Front-matter 中设置，通过 <!-- more --> 截断实现，预览卡片与正文中均出现）

- 页面

  - title: 设置页面标题（可以对默认标题进行覆盖）
  - icon: 页面标题前的图标

cdn 里找到 css 替换掉主题默认的 yun-markdown-css。