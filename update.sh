#!/bin/bash

# -----------------------------
# 参数解析
# $1 -> commit 信息
# $2 -> 模式 development/production，默认 production
# -----------------------------
info=$1
env=${2:-production}

if [ -z "$info" ]; then
    info=":pencil: update content"
fi

echo "📌 提交信息: $info"
echo "🌐 环境: $env"

# -----------------------------
# 文件变化检测函数
# -----------------------------
get_changed_files() {
    git diff --name-only HEAD
}

# -----------------------------
# Hexo 生成函数
# $1 -> 文件列表
# $2 -> 环境 development/production
# -----------------------------
generate_files() {
    local files="$1"
    local mode="$2"

    if [ -n "$files" ]; then
        for f in $files; do
            echo "⚡ 生成: $f"
            npx cross-env NODE_ENV=$mode hexo g $f
        done
    else
        echo "⚡ 没有检测到修改文件，生成全部资源"
        npx cross-env NODE_ENV=$mode hexo g
    fi
}

# -----------------------------
# 自动打开浏览器函数
# -----------------------------
open_browser() {
    local url="http://localhost:4000"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        command -v xdg-open &> /dev/null && xdg-open $url
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        command -v open &> /dev/null && open $url
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        cmd.exe /c start $url
    fi
}

# -----------------------------
# 开发模式
# -----------------------------
if [ "$env" == "development" ]; then
    echo "🚀 开发模式：增量生成 + 本地服务器 + 自动浏览器"

    # 初次生成修改文件
    CHANGED_FILES=$(get_changed_files)
    TO_GENERATE=""
    for f in $CHANGED_FILES; do
        if [[ $f == source/_posts/* || $f == source/assets/* || $f == source/favicon* ]]; then
            TO_GENERATE+="$f "
        fi
    done
    generate_files "$TO_GENERATE" development

    # 启动 Hexo 本地服务器
    npx cross-env NODE_ENV=development hexo s &

    # 打开浏览器
    open_browser

    # watch 文件变化并自动增量生成
    echo "👀 监听文件变化..."
    while true; do
        sleep 2
        CHANGED_FILES=$(get_changed_files)
        TO_GENERATE=""
        for f in $CHANGED_FILES; do
            if [[ $f == source/_posts/* || $f == source/assets/* || $f == source/favicon* ]]; then
                TO_GENERATE+="$f "
            fi
        done

        if [ -n "$TO_GENERATE" ]; then
            echo "⚡ 检测到修改，增量生成..."
            generate_files "$TO_GENERATE" development
        fi
    done

# -----------------------------
# 生产模式
# -----------------------------
else
    echo "⚡ 生产模式：增量生成 + CDN + 部署"

    CHANGED_FILES=$(get_changed_files)
    TO_GENERATE=""
    for f in $CHANGED_FILES; do
        if [[ $f == source/_posts/* || $f == source/assets/* || $f == source/favicon* ]]; then
            TO_GENERATE+="$f "
        fi
    done

    generate_files "$TO_GENERATE" production

    echo "🚀 部署到 GitHub Pages"
    npx cross-env NODE_ENV=production hexo d
fi

# -----------------------------
# Git 提交修改
# -----------------------------
if [ -n "$CHANGED_FILES" ]; then
    git add $CHANGED_FILES
    git commit -m "$info"
    git push origin hexo
    echo "📤 Git 提交完成"
else
    echo "ℹ️ 没有检测到修改，无需提交"
fi

echo "✅ 完成"
