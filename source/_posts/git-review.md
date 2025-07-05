---
title: git_review
date: 2025-07-05 20:43:19
tags:
---
### 初始化仓库
``` bash
# 初始化本地仓库
git init

# 克隆远程仓库到本地
git clone https://github.com/username/repo.git
```

### 查看状态和差异
``` bash
# 查看当前仓库状态（哪些文件被修改、未提交等）
git status

# 查看具体文件的改动内容
git diff

# 查看某个文件在暂存区和工作区的差异
git diff <filename>
```

### 添加和提交更改
```bash


# 添加指定文件到暂存区
git add <filename>

# 添加所有修改到暂存区
git add .

# 提交更改（带描述）
git commit -m "提交信息"

# 添加并提交所有修改（相当于 git add . + git commit）
git commit -am "提交信息"
```

### 分支操作
``` bash
# 查看所有本地分支
git branch

# 创建新分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>

# 创建并切换到新分支
git checkout -b <branch-name>

# 合并指定分支到当前分支
git merge <branch-name>

# 删除分支
git branch -d <branch-name>
```
### 远程仓库操作
``` bash 
# 查看远程仓库地址
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 上传本地分支到远程仓库
git push -u origin <branch-name>

# 推送本地提交到远程仓库
git push

# 拉取远程仓库最新代码（自动合并）
git pull

# 获取远程仓库更新但不合并
git fetch
```
### 查看提交历史
```bash 
# 查看提交历史
git log

# 查看简洁版提交历史
git log --oneline

# 查看某条提交的具体改动
git show <commit-id>
```
### 撤销更改
```bash
# 撤销工作区的文件修改（回到最近一次 git add 或 git commit 状态）
git checkout -- <filename>

# 将文件从暂存区移出（保留修改内容）
git reset HEAD <filename>

# 撤销最近一次提交（保留修改内容）
git reset --soft HEAD^

# 撤销最近一次提交（删除修改内容）
git reset --hard HEAD^
```

### 日常工作流程
1. 克隆仓库`git clone https://github.com/username/repo.git`
2. 创建并切换分支`git checkout -b feature-branch`
3. 修改代码并提交`git add .`  `git commit -m "新增功能"`
4. 推送到远程分支`git push -u origin feature-branch`
5. 切换回主分支并拉取最新的代码`git checkout main` `git pull`
