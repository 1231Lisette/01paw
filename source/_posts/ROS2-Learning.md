---
title: ROS2_Learning
date: 2025-03-02 13:47:23
tags:
    - Python
    - C++
categories: 我的笔记
---
# ROS2中的命令行操作

ros的本质是通信框架，具体做什么得按照你的需求来

``` linux
ros2 run turtlesim turtlesim_node //启动小海龟
ros2 run turtlesim turtle_teleop_key //开启电脑方向键控制小海龟运动
ros2 node + 直接回车 //会提示后面可以加什么
ros2 node list //会展示现在正在运行的节点们
ros2 topic + 直接回车
ros2 topic echo /turtle/pose 订阅并在终端打印信息
ros2 topic pub //publish a message to a topic
```

## 控制海龟运动
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

## 生成一支新海龟
`ros2 service call/spawn turtlesim/srv/Spawn "{x: 2, y: 2, theta: 0.2, name: 'wr'}"`

话题是对机器人控制的一个接口

## 记录海龟的数据
`ros2 bag record`
`ros2 bag play`
- eg:可以把无人机在户外飞的数据给记录下来，回到实验室可以复现数据来完成后续的算法处理与仿真
- 小海龟复现的位置不一样？因为记录的是键盘信息，不是位置信息
## 今日总结：
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
![alt text](/images/image-48.png)
比如说，创建一个c++的功能包，里面的package.xml描述的是基本信息和一些依赖项
cmakelists写的是编译规则，c++需要编译成可执行文件，但是Python语言是解析型的，不需要对代码去编译

> 突然忘记了视频好像有说到如果你对机器人不同的功能写了一套代码，要怎么给别人，但是我忘记了，好像没做笔记

# 节点：机器人的工作细胞
![alt text](/images/image-49.png)
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

节点不是孤立的哈
![alt text](/images/image-50.png)

# 话题：节点间传递数据的桥梁
- 发布/订阅模型
- 订阅者或发布者可以不唯一
- 异步通信机制
- .msg文件定义通信的消息结构
![alt text](/images/image-51.png)
## 发布者
- 编程接口初始化
- 创建节点初始化
- 创建发布者对象
- 创建并填充话题消息
- 发布话题消息
- 销毁节点并关闭接口

```python 
import rclpy                                     # ROS2 Python接口库
from rclpy.node import Node                      # ROS2 节点类
from std_msgs.msg import String                  # 字符串消息类型

"""
创建一个发布者节点
"""
class PublisherNode(Node):
    
    def __init__(self, name):
        super().__init__(name)                                    # ROS2节点父类初始化
        self.pub = self.create_publisher(String, "chatter", 10)   # 创建发布者对象（消息类型、话题名、队列长度）
        self.timer = self.create_timer(0.5, self.timer_callback)  # 创建一个定时器（单位为秒的周期，定时执行的回调函数）
        
    def timer_callback(self):                                     # 创建定时器周期执行的回调函数
        msg = String()                                            # 创建一个String类型的消息对象
        msg.data = 'Hello World'                                  # 填充消息对象中的消息数据
        self.pub.publish(msg)                                     # 发布话题消息
        self.get_logger().info('Publishing: "%s"' % msg.data)     # 输出日志信息，提示已经完成话题发布
        
def main(args=None):                                 # ROS2节点主入口main函数
    rclpy.init(args=args)                            # ROS2 Python接口初始化
    node = PublisherNode("topic_helloworld_pub")     # 创建ROS2节点对象并进行初始化
    rclpy.spin(node)                                 # 循环等待ROS2退出
    node.destroy_node()                              # 销毁节点对象
    rclpy.shutdown()                                 # 关闭ROS2 Python接口
```
别忘记setup.py!
## 订阅者
- 编程接口初始化
- 创建节点并初始化
- 创建订阅者对象
- 回调函数处理话题数据
- 销毁节点并关闭接口

```python
import rclpy                                     # ROS2 Python接口库
from rclpy.node   import Node                    # ROS2 节点类
from std_msgs.msg import String                  # ROS2标准定义的String消息

"""
创建一个订阅者节点
"""
class SubscriberNode(Node):
    
    def __init__(self, name):
        super().__init__(name)                                    # ROS2节点父类初始化
        self.sub = self.create_subscription(\
            String, "chatter", self.listener_callback, 10)        # 创建订阅者对象（消息类型、话题名、订阅者回调函数、队列长度）

    def listener_callback(self, msg):                             # 创建回调函数，执行收到话题消息后对数据的处理
        self.get_logger().info('I heard: "%s"' % msg.data)        # 输出日志信息，提示订阅收到的话题消息
        
def main(args=None):                                 # ROS2节点主入口main函数
    rclpy.init(args=args)                            # ROS2 Python接口初始化
    node = SubscriberNode("topic_helloworld_sub")    # 创建ROS2节点对象并进行初始化
    rclpy.spin(node)                                 # 循环等待ROS2退出
    node.destroy_node()                              # 销毁节点对象
    rclpy.shutdown()                                 # 关闭ROS2 Python接口
```
## 完成一个更复杂的节点通信
![alt text](/images/image-52.png)


`rqt_graph` 可以绘制节点的图片
![alt text](/images/image-53.png)

# 服务：节点间的你问我答
![alt text](/images/image-54.png)
- 客户端/服务器（c/s）模型
- 同步通信机制
- 服务器唯一，客户端可以不唯一
- .srv文件定义请求和应答数据结构

## 创建服务客户端的程序流程
- 编程接口初始化
- 创建节点并初始化
- 创建客户端对象
- 创建并发送请求数据
- 等待服务器端应答数据
- 销毁节点并关闭接口

## 创建服务服务端
- 编程接口初始化
- 创建节点并初始化
- 创建服务器对象
- 通过回调函数处进行服务
- 向客户端反馈应答结果
- 销毁节点并关闭接口

## 实现一个更为复杂的服务通信
![alt text](/images/image-55.png)
1. 相机驱动节点：发布图像数据
2. 视觉识别节点：订阅图像数据，并且集成了一个服务器端的对象，随时准备提供目标的位置
3. 机器人目标跟踪节点（客户端的节点）：当需要根据目标运动时，就发送一次请求，拿到一个当前的目标位置

# 通信接口：数据传递的标准接口
![alt text](/images/image-56.png)
![alt text](/images/image-57.png)

- 服务通信
![alt text](/images/image-58.png)

- 话题通信
![alt text](/images/image-59.png)
> 原理其实讲的很清楚了，ROS2的使用本来就是运行在应用层上的，所以作者没有讲具体的实现代码。这里一个节点启动摄像头，然后一个节点处理图像得到坐标并推送话题，最后一个节点订阅话题得到坐标。

- 服务：请求一次，反馈一次结果
- 话题：周期上地反馈结果

# 动作：完整行为地流程管理
![alt text](/images/image-60.png)
- 客户端/服务器（c/s）模型
- 服务器唯一，客户端可以不唯一
- 同步通信机制
- .action文件定义通信接口地数据结构

![alt text](/images/image-61.png)
- 里面三个通信模块有两个服务和一个话题
  - 当客户端发送运动目标请求时，使用的是服务的请求调用
  - 服务器端也会去反馈一个应答，表示收到命令
  - 动作的反馈过程就是一个话题的周期发布，服务器端是发布者，客户端是订阅者
- 动作就是一种应用层的通信机制，底层就是基于话题和服务实现的

![alt text](/images/image-62.png)

- 实现一个机器人画圆的动作
![alt text](/images/image-63.png)
    - 使用MoveCircle.action来进行定义，且有3个部分
      - 动作的目标
      - 动作的执行结果
      - 动作的周期反馈
    - 通讯模型
      - 客户端发送一个动作的目标服务器来控制机器人开始运动，并且进行周期反馈，反馈整体的一个信息

相比话题和服务的通讯，动作通讯的历程相对较长

> 请后续复盘回调函数部分
> 有非常多的callback 
![alt text](/images/image-64.png)
# 参数：机器人系统的全局字典(类似c中的全局变量)

- 全局共享字典
- 由键与值组成
- 可实现动态监控

## 参数在机器人中的应用
![alt text](/images/image-65.png)

# 分布式通信：多计算平台的任务分配
![alt text](/images/image-65.png)
![alt text](/images/image-66.png)
![alt text](/images/image-67.png)
![alt text](/images/image-68.png)
![alt text](/images/image-69.png)
![alt text](/images/image-70.png)

# DDS:机器人的神经网络
![alt text](/images/image-71.png)
DDS，Data Distribution Service，即数据分发服务
- 2004年由对象管理组织0MG(0bjectManagementGroup)发布
- 专门为实时系统设计的数据分发/订阅标准
- 最早应用于美国海军，解决舰船复杂网络环境中大量软件升级的兼容性问题，目前已经成为美国国防部的强制标准，同时广泛应用于国防民航、工业控制等领域，成为分布式实时系统中数据发布/订阅的标准解决方案。
- DDS强调以数据为中心，提供丰富的服务质量策略(QoS)，以保障数据进行实时、高效、灵活地分发，可满足各种分布式实时通信应用需求。

![alt text](/images/image-72.png)
![alt text](/images/image-73.png)

# Launch: 多节点启动与配置脚本

-  rviz.launch.py
`ros2 run rviz2 rviz2 -d /home/lisettepeng/ros2/dev_ws/src/ros2_21_tutorials/learning_launch/rviz/turtle_rviz.rviz` 该命令行是如何实现的？
``` python
import os
from ament_index_python.packages import get_package_share_directory # 查询功能包路径的方法

from launch import LaunchDescription    # launch文件的描述类
from launch_ros.actions import Node     # 节点启动的描述类


def generate_launch_description():      # 自动生成launch文件的函数
   rviz_config = os.path.join(          # 找到配置文件的完整路径
      get_package_share_directory('learning_launch'),
      'rviz',
      'turtle_rviz.rviz'
      )

   return LaunchDescription([           # 返回launch文件的描述信息
      Node(                             # 配置一个节点的启动
         package='rviz2',               # 节点所在的功能包
         executable='rviz2',            # 节点的可执行文件名
         name='rviz2',                  # 对节点重新命名!!!!
         arguments=['-d', rviz_config]  # 加载命令行参数
      )
   ])
```

> 当我开发a机器人写了一堆资源用了一个名字，但你代码不想换，但你想换个名字，用B
> 这个时候不用改你源码，只用重新配置一个launch文件

- remapping.launch.py
 ```python
 from launch import LaunchDescription      # launch文件的描述类
from launch_ros.actions import Node       # 节点启动的描述类

def generate_launch_description():        # 自动生成launch文件的函数
    return LaunchDescription([            # 返回launch文件的描述信息
        Node(                             # 配置一个节点的启动
            package='turtlesim',          # 节点所在的功能包
            namespace='turtlesim1',       # 节点所在的命名空间
            executable='turtlesim_node',  # 节点的可执行文件名
            name='sim'                    # 对节点重新命名
        ),
        Node(                             # 配置一个节点的启动
            package='turtlesim',          # 节点所在的功能包
            namespace='turtlesim2',       # 节点所在的命名空间
            executable='turtlesim_node',  # 节点的可执行文件名
            name='sim'                    # 对节点重新命名
        ),
        Node(                             # 配置一个节点的启动
            package='turtlesim',          # 节点所在的功能包
            executable='mimic',           # 节点的可执行文件名
            name='mimic',                 # 对节点重新命名
            remappings=[                  # 资源重映射列表
                ('/input/pose', '/turtlesim1/turtle1/pose'),         # 将/input/pose话题名修改为/turtlesim1/turtle1/pose
                ('/output/cmd_vel', '/turtlesim2/turtle1/cmd_vel'),  # 将/output/cmd_vel话题名修改为/turtlesim2/turtle1/cmd_vel
                # 重映射
            ]
        )
    ])
```
 - parameters.launch.py
 - 这是对参数的一个launch
```python
from launch import LaunchDescription                   # launch文件的描述类
from launch.actions import DeclareLaunchArgument       # 声明launch文件内使用的Argument类
from launch.substitutions import LaunchConfiguration, TextSubstitution

from launch_ros.actions import Node                    # 节点启动的描述类


def generate_launch_description():                     # 自动生成launch文件的函数
   background_r_launch_arg = DeclareLaunchArgument(
      'background_r', default_value=TextSubstitution(text='0')     # 创建一个Launch文件内参数（arg）background_r
   )
   background_g_launch_arg = DeclareLaunchArgument(
      'background_g', default_value=TextSubstitution(text='84')    # 创建一个Launch文件内参数（arg）background_g
   )
   background_b_launch_arg = DeclareLaunchArgument(
      'background_b', default_value=TextSubstitution(text='122')   # 创建一个Launch文件内参数（arg）background_b
   )

   return LaunchDescription([                                      # 返回launch文件的描述信息
      background_r_launch_arg,                                     # 调用以上创建的参数（arg）
      background_g_launch_arg,
      background_b_launch_arg,
      Node(                                                        # 配置一个节点的启动
         package='turtlesim',
         executable='turtlesim_node',                              # 节点所在的功能包
         name='sim',                                               # 对节点重新命名
         parameters=[{                                             # ROS参数列表
            'background_r': LaunchConfiguration('background_r'),   # 创建参数background_r
            'background_g': LaunchConfiguration('background_g'),   # 创建参数background_g
            'background_b': LaunchConfiguration('background_b'),   # 创建参数background_b
         }]
      ),
   ])
```

- parameters_yaml.launch.py
``` python
import os

from ament_index_python.packages import get_package_share_directory  # 查询功能包路径的方法

from launch import LaunchDescription   # launch文件的描述类
from launch_ros.actions import Node    # 节点启动的描述类


def generate_launch_description():     # 自动生成launch文件的函数
   config = os. n.join(              # 找到参数文件的完整路径
      get_package_share_directory('learning_launch'),
      'config',
      'turtlesim.yaml'
      )

   return LaunchDescription([          # 返回launch文件的描述信息
      Node(                            # 配置一个节点的启动
         package='turtlesim',          # 节点所在的功能包
         executable='turtlesim_node',  # 节点的可执行文件名
         namespace='turtlesim2',       # 节点所在的命名空间
         name='sim',                   # 对节点重新命名
         parameters=[config]           # 加载参数文件
      )
   ])
```

- namespaces.launch.py
- 一个launch文件包含一堆
```python
import os

from ament_index_python.packages import get_package_share_directory  # 查询功能包路径的方法

from launch import LaunchDescription                 # launch文件的描述类
from launch.actions import IncludeLaunchDescription  # 节点启动的描述类
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.actions import GroupAction               # launch文件中的执行动作
from launch_ros.actions import PushRosNamespace      # ROS命名空间配置

def generate_launch_description():                   # 自动生成launch文件的函数
   parameter_yaml = IncludeLaunchDescription(        # 包含指定路径下的另外一个launch文件
      PythonLaunchDescriptionSource([os.path.join(
         get_package_share_directory('learning_launch'), 'launch'),
         '/parameters_nonamespace.launch.py'])
      )
  
   parameter_yaml_with_namespace = GroupAction(      # 对指定launch文件中启动的功能加上命名空间
      actions=[
         PushRosNamespace('turtlesim2'),
         parameter_yaml]
      )

   return LaunchDescription([                        # 返回launch文件的描述信息
      parameter_yaml_with_namespace
   ])
```

