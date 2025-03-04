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
3. 开小海龟的时候：一个终端开节点，一个终端进行按键控制，一个终端进行话题发布与


# 工作空间与功能包
- 工作空间：是一个存放项目开发相关文件的文件夹
  - src：代码空间（source space）
  - install：安装空间（install space）
  - build：编译空间（build space）
  - log：日志空间（log space）
![alt text](image-47.png)

- 功能包
    ![alt text](image-48.png)
比如说，创建一个c++的功能包，里面的package.xml描述的是基本信息和一些依赖项
cmakelists写的是编译规则，c++需要编译成可执行文件，但是Python语言是解析型的，不需要对代码去编译

> 突然忘记了视频好像有说到如果你对机器人不同的功能写了一套代码，要怎么给别人，但是我忘记了，好像没做笔记

# 节点：机器人的工作细胞
![alt text](image-49.png)
（如果是相同的语言，那不就相当于FPGA的不同模块）

## 第一个节点（面向过程编程）
`ros2 run learning_node node_helloworld`

1. 在根目录下`colcon build `
2. 
```python
"""
@作者: 古月居(www.guyuehome.com)
@说明: ROS2节点示例-发布“Hello World”日志信息, 使用面向过程的实现方式
"""
# 引入了Node这个类，类创建对象才能对他进行使用
import rclpy                                     # ROS2 Python接口库
from rclpy.node import Node                      # ROS2 节点类
import time

def main(args=None):                             # ROS2节点主入口main函数
    rclpy.init(args=args)                        # ROS2 Python接口初始化
    node = Node("node_helloworld")               # 创建ROS2节点对象并进行初始化
    
    while rclpy.ok():                            # ROS2系统是否正常运行
        node.get_logger().info("Hello World")    # ROS2日志输出
        time.sleep(0.5)                          # 休眠控制循环时间
    
    node.destroy_node()                          # 销毁节点对象，内存销毁掉  
    rclpy.shutdown()                             # 关闭ROS2 Python接口
```

3. 进行程序入口的配置，只针对Python版本
```python
# setup.py
from setuptools import setup

package_name = 'learning_node'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Hu Chunxu',
    maintainer_email='huchunxu@guyuehome.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
         'node_helloworld       = learning_node.node_helloworld:main',
         'node_helloworld_class = learning_node.node_helloworld_class:main',
         'node_object            = learning_node.node_object:main',
         'node_object_webcam     = learning_node.node_object_webcam:main',
        ],
    },
)
```
 `'node_helloworld       = learning_node.node_helloworld:main'`
程序名字 = 文件夹.程序名称：main
4. 才可以在工作环境的根目录下用`ros2 run 文件夹 程序名字`命令

主要过程：
- 编程接口初始化
- 创建ROS2节点对象并进行初始化
- 实现节点功能
- 销毁节点并关闭窗口
   
## 优化第一个节点的代码（面向对象编程）
你得学习一些面向过程和面向对象编程不同的思想，面向过程编程不好进行机器人的模块化处理
source一下是什么意思

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@作者: 古月居(www.guyuehome.com)
@说明: ROS2节点示例-发布“Hello World”日志信息, 使用面向对象的实现方式
"""

import rclpy                                     # ROS2 Python接口库
from rclpy.node import Node                      # ROS2 节点类
import time

"""
创建一个HelloWorld节点, 初始化时输出“hello world”日志
"""
class HelloWorldNode(Node):
    def __init__(self, name):
        super().__init__(name)                       # ROS2节点父类初始化
        while rclpy.ok():                            # ROS2系统是否正常运行
            self.get_logger().info("Hello World")    # ROS2日志输出
            time.sleep(0.5)                          # 休眠控制循环时间

def main(args=None):                                 # ROS2节点主入口main函数
    rclpy.init(args=args)                            # ROS2 Python接口初始化
    node = HelloWorldNode("node_helloworld_class")   # 创建ROS2节点对象并进行初始化
    node.destroy_node()                              # 销毁节点对象
    rclpy.shutdown()                                 # 关闭ROS2 Python接口
```

`node = Node("node_helloworld") ` 这里是运用ros2的Python接口创建的一个node
`node = HelloWorldNode("node_helloworld_class")` 这里是自己定义一个class来创建一个node

Q:为什么不在节点的类中直接初始化？
A1:因为父类的__init__会被子类新定义的覆盖掉，所以要用super（）.加载父类Node中的init
A2:功能分清楚啊，class就只是一个对象，它要被调用的时候才应该出初始化
A3:helloworldNode类是继承自Node节点类，在创建这个类的时候调用了自己的构造函数，然后调用了父类的构造函数，并且进入循环直到退出

- 编写与修改程序之后要重新编译`colcon build`，因为编译过程中会将src里面的代码拷贝到install里面，ros2run的是install里面的代码，不编译的话，install里面的程序是不会更新的

- colcon build只能在workplace里面的终端进行
- 刚刚出现的问题是因为旧的日志缓存一直没删除
- 解决办法：
`cd ~/ros2/dev_ws  # 进入工作空间根目录
rm -rf build install log
colcon build`