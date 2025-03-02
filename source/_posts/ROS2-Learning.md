---
title: ROS2_Learning
date: 2025-03-02 13:47:23
tags:
    - Python
    - C++
categories: 我的笔记
---
# ROS2中的命令行操作

``` linux
ros2 run turtlesim turtlesim_node //启动小海龟
ros2 run turtlesim turtle_teleop_key //开启电脑方向键控制小海龟运动
ros2 node + 直接回车 //会提示后面可以加什么
ros2 node list //会展示现在正在运行的节点们
ros2 topic + 直接回车
ros2 topic echo /turtle/pose 订阅并在终端打印信息
ros2 topic pub //publish a message to a topic
```

### 控制海龟运动
`ros2 topic pub --rate 1 /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 2.0, y : 0.0, z : 0.0}, angular: {x : 0.0, y : 0.0, z : 1.8}}" `
这个指令的作用是每秒向 /turtle1/cmd_vel 话题发布一条 geometry_msgs/msg/Twist 类型的消息，消息内容表示海龟在 X 轴上的线性速度为 2.0，绕 Z 轴的角速度为 1.8，从而控制海龟的运动。
1. `ros2 topic pub`
这是 ROS 2 提供的一个命令行工具，用于向指定的话题发布消息。在 ROS 2 中，话题（Topic）是节点之间进行异步通信的一种机制，节点可以发布消息到话题，也可以订阅话题来接收消息。
2. `--rate 1`
这是一个可选的参数，用于指定消息发布的频率，单位是赫兹（Hz）。`--rate 1` 表示每秒发布 1 条消息。也就是说，该指令会以每秒 1 次的频率向指定话题发送消息。
3. `/turtle1/cmd_vel`
这是要发布消息的话题名称。在 ROS 2 中，话题名称通常使用 `/` 作为分隔符，形成一个层次化的命名空间。`/turtle1/cmd_vel` 这个话题一般用于控制海龟仿真器（TurtleSim）中名为 `turtle1` 的海龟的运动速度。
4. `geometry_msgs/msg/Twist`
这是消息的类型。在 ROS 2 中，消息类型定义了消息的结构，不同的消息类型用于表示不同的数据。`geometry_msgs/msg/Twist` 是一个标准的 ROS 2 消息类型，用于表示线性速度和角速度。它通常用于控制机器人的运动，包含两个主要部分：`linear`（线性速度）和 `angular`（角速度）。
5. `"{linear:{x:2.0,y:0.0,z:0.0},angular:{x:0.0,y:0.0,z:1.8}}"`
这是要发布的消息内容，以 JSON 格式表示。具体解释如下：
- `linear`：表示线性速度，包含三个分量 `x`、`y` 和 `z`，分别代表在 X、Y 和 Z 轴上的线性速度。在这个例子中，`x` 轴的线性速度为 2.0，`y` 轴和 `z` 轴的线性速度为 0.0。
- `angular`：表示角速度，同样包含三个分量 `x`、`y` 和 `z`，分别代表绕 X、Y 和 Z 轴的角速度。在这个例子中，`x` 轴和 `y` 轴的角速度为 0.0，`z` 轴的角速度为 1.8。

### 生成一支新海龟
`ros2 service call/spawn turtlesim/srv/Spawn "{x: 2, y: 2, theta: 0.2, name: 'wr'}"`

话题是对机器人控制的一个接口

### 记录海龟的数据
`ros2 bag record`
`ros2 bag play`
- eg:可以把无人机在户外飞的数据给记录下来，回到实验室可以复现数据来完成后续的算法处理与仿真
- 小海龟复现的位置不一样？因为记录的是键盘信息，不是位置信息
### 今日总结：
1. 一键安装了ros2，感谢鱼香肉丝
2. 学了一些基本指令
3. 开小海龟的时候：一个终端开节点，一个终端进行按键控制，一个终端进行话题发布与运行