---
title: Python 与 VS Code 和 Conda 的使用笔记
date: 2025-05-10
tags:
    - Python
categories: 我的笔记
---
# 工作流程
- Python解释器（c++叫编译器，本质是一个东西）
- conda可以下多个Python版本，不同包版本
- vscode文本编辑器

# 常用指令
## 常用的conda指令
- 创建新的Python环境`conda create -n env_name python=3.x`
- 查看已有的Python环境`conda env list`
- 进入已有的conda环境`conda activate env_name`
- 退出当前的Python环境`conda deactivate`

## 常用的pip指令
- 根据requirements.text的内容安装所需要的包`pip install -r requirements.txt`
- 安装包`pip install package_name`
-`pip install package_name --timeout 6000`
- pip 换清华源后缀:`-i https://mirrors.tuna.tsinghua.edu,cn/pypi/web /simple -trusted-host=https://mirrors.tunatsinghua.edu.cn/pypi/web/simple`

> 2025.5.10 20:17 刚配了conda的环境变量哈哈哈，第一次用cmd直接输入conda env list就成功

