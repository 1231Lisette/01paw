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
graph LR
    A[具身AI代理] --> B[引言]
    A --> C[理论基础]
    A --> D[核心架构]
    A --> E[AI代理类型]
    A --> F[评估与未来]
    A --> G[伦理挑战]
    A --> H[未来展望]

    B --> B1[起源]
    B1 --> B1a[图灵测试]
    B1 --> B1b[通用AI]
    B --> B2[形态]
    B2 --> B2a[机器人]
    B2 --> B2b[家电]
    B2 --> B2c[穿戴]
    B2 --> B2d[驾驶]

    C --> C1[具身假说]
    C1 --> C1a[身体互动]
    C1 --> C1b[认知视角]
    C --> C2[形态计算]
    C2 --> C2a[结构简化]
    C2 --> C2b[被动动态]
    C --> C3[三大原则]
    C3 --> C3a[非预定义]
    C3 --> C3b[动态交互]
    C3 --> C3c[多模态]

    D --> D1[世界模型]
    D1 --> D1a[感知]
    D1a --> D1a1[多模态]
    D1 --> D1b[建模]
    D1b --> D1b1[物理]
    D1b --> D1b2[心理]
    D1 --> D1c[记忆]
    D1c --> D1c1[动作]
    D1c --> D1c2[逻辑]
    D1c --> D1c3[表象]
    D1 --> D1d[控制]
    D1d --> D1d1[执行]
    D1d --> D1d2[调整]
    D --> D2[大模型]
    D2 --> D2a[视觉]
    D2 --> D2b[语言]
    D2 --> D2c[模拟]

    E --> E1[虚拟代理]
    E1 --> E1a[场景]
    E1a --> E1a1[治疗]
    E1a --> E1a2[元宇宙]
    E1a --> E1a3[NPC]
    E1 --> E1b[要求]
    


```

## Sonme Definitions
![Overview of the Embodied AI Agent architecture, with the interaction loop between user, world and agent.
The world model is the core component responsible for planning and reasoning](./world_model.png)

## Conclusions
## Notes
- **生成式模型**存在一个根本性缺陷，即**模型规律效率低下**。其虽然擅长预测下一个标记或像素，但容易过度关注文本或视觉细节而忽视了推理与规划任务所需的很细信息。
- VLM > LLM and Diffusion model > GPT 但是VLM任存在动作规划幻觉问题

<BszComponent/>