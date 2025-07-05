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

# 调教记录：）

> 2025.5.10 20:17 刚配了conda的环境变量哈哈哈，第一次用cmd直接输入conda env list就成功
> 2025.7.4晚 帮lyx做人工智能作业时重新温习了一下如何新创建一个环境等等操作
1. 生成配置文件`conda config --set show_channel_urls yes`
2. 改镜像源之配置`.condarc`文件
```txt
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```
1. 清除索引缓存`conda clean -i`
2. 验证是否成功`conda config --show-sources`
> 上面的已经做完以后就可以直接根据上面的常用conda指令来创建
> pip先升级后换源
``` python
python -m pip install --upgrade pip
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```


