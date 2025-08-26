#!/bin/bash
info=$1
if [ "$info" == "" ]; then
    info=":pencil: update content"
fi

# 生成静态文件（生产模式，走 CDN）
npx cross-env NODE_ENV=production hexo g

# 部署到 GitHub Pages
npx cross-env NODE_ENV=production hexo d

# 提交源码改动到 hexo 分支
git add -A
git commit -m "$info"
git push origin hexo
