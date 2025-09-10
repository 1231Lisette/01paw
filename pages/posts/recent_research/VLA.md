---
title: VLA方向论文笔记
date: 2025-09-10
updated: 2025-09-10
categories: notes
tags:
  - VLA
  - 笔记
---
# Embodied AI Agents: Modeling the World
meta ai research
## Paper structure
```mermaid
mindmap
  root((具身AI代理))
    引言
      起源
        图灵测试
        通用AI
      形态
        机器人
        家电
        穿戴
        驾驶
    理论基础
      具身假说
        身体互动
        认知视角
      形态计算
        结构简化
        被动动态
      三大原则
        非预定义
        动态交互
        多模态
    核心架构
      世界模型
        感知
          多模态
        建模
          物理
          心理
        记忆
          动作
          逻辑
          表象
        控制
          执行
          调整
      大模型
        视觉
        语言
        模拟
    AI代理类型
      虚拟代理
        场景
          治疗
          元宇宙
          NPC
        要求
    评估与未来
    伦理挑战
    未来展望

%% 设置样式
%% 节点背景白色，文本黑色
%% 适合深色主题
%% 可以单独给 root 节点或全部节点设置
classDef default fill:#fff,stroke:#000,color:#000;
class root,引言,起源,形态,理论基础,核心架构,AI代理类型,评估与未来,伦理挑战,未来展望 default;

```

## Some Definitions
![Overview of the Embodied AI Agent architecture, with the interaction loop between user, world and agent.
The world model is the core component responsible for planning and reasoning](./world_model.png)

## Conclusions
## Notes
- **生成式模型**存在一个根本性缺陷，即**模型规律效率低下**。其虽然擅长预测下一个标记或像素，但容易过度关注文本或视觉细节而忽视了推理与规划任务所需的很细信息。
- VLM > LLM and Diffusion model > GPT 但是VLM任存在动作规划幻觉问题
- 用触觉补偿视觉
- 世界模型的构建受两大设计要素影响：
  - 时间维度和动作语义颗粒度的差异
    - 涉及机器人动作所需的低级动态参数——例如每隔几毫秒就会变化的关节扭矩
    - 另一方面则包含需要持续数秒甚至数分钟的人类尺度操作（如“插入电池”
  - 建模方法的选择
    - generative model：表达力强但成本高昂，因为它们试图捕捉场景中的每一个底层细节。
    - LLM：由于训练数据中存在虚假关联，容易产生幻觉现象。
    - joint-embedding world models：高效且稳定但实用性取决于该抽象如何捕捉任务的因果结构
- 心智模型：预判用户目标与意图；识别信念差异（？当对话中一方误认为某物品位于特定位置而另一方掌握真相时，模型能推断出信念偏差，并预测持错误认知者的行为模式。）；预判情绪反应

<BszComponent/>