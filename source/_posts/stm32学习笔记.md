---
title: stm32学习笔记
date: 2025-02-05 16:26:24
tags:
    - stm32
    - C
categories: 我的笔记
---
> 基于江科大的stm32学习于2025.2.5启动，希望10号前能多学点！
---
## stm32简介
### stm32介绍
- STM32是ST公司基于ARM Cortex-M内核开发的32位微控制器（M——Microcontroller ）
- STM32常应用在嵌入式领域如智能车、无人机、机器人无线通信、物联网、工业控制、娱乐电子产品等
- STM32功能强大、性能优异片上资源丰富、功耗低，是一款经典的嵌入式微控制器
  
### ARM介绍
- ARM既指ARM公司，也指ARM处理器内核
- ARM公司是全球领先的半导体知识产权(IP)提供商，全世界超过95%的智能手机和平板电脑都采用ARM架构（它卖方案）
- ARM公司设计ARM内核，半导体厂商完善内核周边电路并生产芯片

### STM32F103C8T6
- 系列:主流系列STM32F1
- 内核:ARM Cortex-M3
- 主频:72MHZ(SRAM)
- RAM :20K
- ROM :64K(Flash)
- 供电:2.0~3.6V(标准3.3V)
- 封装:LQFP48

### 片上资源/外设
![外设](/images/image.png)
(英文是peripheral)

- NVIC：用于内核里面管理中断，配置中断优先级
- Systick：内核里的定时器，主要用来给操作系统提供定时服务，进行任务切换；stm32可以加入操作系统，例如freeRTOS，UCOS（江科课程不涉及操作系统）
- RCC：用于外设时钟的使能（stm32外设在上电情况下默认是没有时钟的；无时钟时，操作外设是无效的，目的是为了减少功耗；所以在操作外设之前必须使能它的时钟）
- 看门狗：当单片机因为电磁干扰死机或者程序设计不合理出现死循环时，看门狗可以及时复位芯片，保证系统的稳定
（c8t6没有后四个外设，详情去看datasheet）

### 命名规则
![alt text](/images/image-1.png)

### 启动配置
![alt text](/images/image-2.png) 


---
## 软件安装
---
## 新建工程模板 
### 关于启动文件
![alt text](/images/image-3.png)
![alt text](/images/image-4.png)
### 用配置寄存器和库函数的方法点亮一颗灯
```c
#include "stm32f10x.h"                  // Device header
int main()
{
	/*RCC->APB2ENR = 0x00000010;//打开GPLC的时钟
	GPIOC->CRH = 0x00300000;//配置PC13口的模式，什么推挽输出blabla，寄存器配置，具体看原理图
	GPIOC->ODR = 0x00000000;//灯是低电平点亮的，等等我的和江科是相反的*/
	//1. 配置时钟寄存器
	//2. 配置GPIO寄存器模式
	//3. 配置GPIO端口输出寄存器
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC,ENABLE);
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_13;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOC,&GPIO_InitStructure);
	GPIO_SetBits(GPIOC,GPIO_Pin_13);
	//GPIO_ResetBits(GPIOC,GPIO_Pin_13);
	while(1)
	{
		
	}
}
```
用库函数的话有许多前置条件，你要有start启动文件，library装依赖的库函数，user装你的main函数啥的，好难🤯

### 新建工程的步骤
  1. 建立工程文件夹，Kei中新建工程，选择型号
  2. 工程文件夹里建立Start、Library、User等文件夹，复制固件库里面的文件到工程文件夹
  3. 工程里对应建立Start、Library、User等同名称的分组，然后将文件夹内的文件添加到工程分组里
  4. 工程选项，C/C++，Include Paths内声明所有包含头文件的文件夹
   ![alt text](/images/image-6.png)
  5. 工程选项，C/C++，Define内定义USE STDPERIPH DRIVER
  6. 工程选项，Debug，下拉列表选择对应调试器，Settings，FlashDownload里勾选Reset and Run

### 工程架构
![alt text](/images/image-7.png)

结束，2025/2/6 0:00;好难。

---
## GPIO输出
### GPIO简介
- GPIO(General Purpose Input Output)通用输入输出口
- 可配置为8种输入输出模式
- 引脚电平:0V~3.3V，部分引脚可容忍5V
- 输出模式下可控制端口输出高低电平，用以驱动LED、控制蜂鸣器模拟通信协议输出时序等
- 输入模式下可读取端口的高低电平或电压，用于读取按键输入、外接模块电平信号输入、ADC电压采集、模拟通信协议接收数据等

### GPIO基本结构
![alt text](/images/image-8.png)

### GPIO模式
- 通过配置GPIO的端口配置寄存器，端口可以配置成一下8种模式
![GPIO模式](/images/image-9.png)

1. 开漏输出模式下，高电平为高阻态，所以无驱动力;只有低电平有驱动能力
2. 推挽输出高低电平均有驱动能力

### 流水灯
- 一种cv,一种用for
``` c
#include "stm32f10x.h"                  // Device header
#include "Delay.h"

int main(void)
{
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
	
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_All;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA, &GPIO_InitStructure);
	
	while (1)
	{
		GPIO_Write(GPIOA, ~0x0001);	//0000 0000 0000 0001
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0002);	//0000 0000 0000 0010
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0004);	//0000 0000 0000 0100
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0008);	//0000 0000 0000 1000
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0010);	//0000 0000 0001 0000
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0020);	//0000 0000 0010 0000
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0040);	//0000 0000 0100 0000
		Delay_ms(100);
		GPIO_Write(GPIOA, ~0x0080);	//0000 0000 1000 0000
		Delay_ms(100);
	}
}
```
``` c
#include "stm32f10x.h"                  // Device header
#include "Delay.h"

int main()
{
    int i; 

    // 1. 配置时钟寄存器
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);  // 这里使用apb2是因为gpio的总线接在APB2

    // 2. 配置GPIO寄存器模式
    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;  // 推挽输出，就是可以输出高低电平，直接驱动小功耗器件
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_All;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;

    // 3. 配置GPIO端口输出寄存器
    GPIO_Init(GPIOA, &GPIO_InitStructure);

    while (1)
    {
        for (i = 0; i < 8; i++)
        {
            int value = ~(0x0001 << i);
            // 写入 GPIOA 端口
            GPIO_Write(GPIOA, value);
            // 延迟 500 毫秒
            Delay_ms(500);
        }
    }
}
```
### 蜂鸣器
- I/O口随便找个接就好了，但是不要找那些调试接口
``` c
#include "stm32f10x.h"                  // Device header
#include "Delay.h"

int main()
{

    // 1. 配置时钟寄存器
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);  // 这里使用apb2是因为gpio的总线接在APB2

    // 2. 配置GPIO寄存器模式
    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;  // 推挽输出，就是可以输出高低电平，直接驱动小功耗器件
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_12;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;

    // 3. 配置GPIO端口输出寄存器
    GPIO_Init(GPIOB, &GPIO_InitStructure);

    while (1)
    {
        GPIO_ResetBits(GPIOB, GPIO_Pin_12);
		Delay_ms(100);
		GPIO_SetBits(GPIOB, GPIO_Pin_12);
		Delay_ms(100);
		GPIO_ResetBits(GPIOB, GPIO_Pin_12);
		Delay_ms(100);
		GPIO_SetBits(GPIOB, GPIO_Pin_12);
		Delay_ms(700);
		
    }
}


```
---

## GPIO输入
### 按键介绍
- 按键:常见的输入设备，按下导通，松手断开
- 按键抖动:由于按键内部使用的是机械式弹簧片来进行通断的，所以在按下和松手的瞬间会伴随有一连串的抖动
![抖动](/images/image-10.png)

### 用按键控制LED亮灭
> Key.c
```c
#include "stm32f10x.h"                  // Device header
#include "Delay.h"
void Key_Init(void)
{
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);  
    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU; 
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1 | GPIO_Pin_11;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &GPIO_InitStructure);
	GPIO_SetBits(GPIOB, GPIO_Pin_1 | GPIO_Pin_11);
}

uint8_t Key_GetNum(void)//unsigned char
{
	uint8_t KeyNum = 0;
	if(GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0)//这里的返回值就是输入寄存器某一位的值,按键按下的话
	{
		Delay_ms(20);
		while(GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0)//如果按键一直按下，那就一直在这里循环
		Delay_ms(20);
		KeyNum = 1;
	}
	if(GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_11) == 0)//这里的返回值就是输入寄存器某一位的值,按键按下的话
	{
		Delay_ms(20);
		while(GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_11) == 0)//如果按键一直按下，那就一直在这里循环
		Delay_ms(20);
		KeyNum = 2;
	}		
	return KeyNum;
}
```
> Key.h
```c
#ifndef __KEY_H
#define __KEY_H
void Key_Init(void);
uint8_t Key_GetNum(void);//unsigned char
#endif
```
> LED.c
```c
#include "stm32f10x.h"                  // Device header

void LED_Init(void)
{
	// 1. 配置时钟寄存器
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);  // 这里使用apb2是因为gpio的总线接在APB2

    // 2. 配置GPIO寄存器模式
    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;  // 推挽输出，就是可以输出高低电平，直接驱动小功耗器件
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1 | GPIO_Pin_2;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;

    // 3. 配置GPIO端口输出寄存器
    GPIO_Init(GPIOA, &GPIO_InitStructure);
	
	GPIO_SetBits(GPIOA, GPIO_Pin_1 | GPIO_Pin_2);
}

void LED1_ON(void)
{
	GPIO_SetBits(GPIOA, GPIO_Pin_1);
}

void LED1_OFF(void)
{
	GPIO_ResetBits(GPIOA, GPIO_Pin_1);
}

void LED2_ON(void)
{
	GPIO_SetBits(GPIOA, GPIO_Pin_2);
}

void LED2_OFF(void)
{
	GPIO_ResetBits(GPIOA, GPIO_Pin_2);
}

void LED1_Turn(void)
{
	if(GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_1) == 0)
	{
		GPIO_SetBits(GPIOA, GPIO_Pin_1);
	}
	else
	{
		GPIO_ResetBits(GPIOA, GPIO_Pin_1);
	}
}

void LED2_Turn(void)
{
	if(GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_2) == 0)
	{
		GPIO_SetBits(GPIOA, GPIO_Pin_2);
	}
	else
	{
		GPIO_ResetBits(GPIOA, GPIO_Pin_2);
	}
}
```
> LED.h
```c
#ifndef __LED_H
#define __LED_H
void LED_Init(void);
void LED1_ON(void);
void LED1_OFF(void);
void LED2_ON(void);
void LED2_OFF(void);
void LED1_Turn(void);
void LED2_Turn(void);
#endif
```
> main.c
```c
#include "stm32f10x.h"                  // Device header
#include "Delay.h"
#include "LED.h"
#include "Key.h"
int main()
{
	uint8_t KeyNum;
	LED_Init();
	Key_Init();
    while (1)
    {
		KeyNum = Key_GetNum();
		if(KeyNum == 1)
		{
			LED1_Turn();
		}
		if(KeyNum == 2)
		{
			LED2_Turn();
		}
    }
}
```

#### 按键的硬件电路
- 常用的就是以下这两种电路，按键按下时引脚时低电平，松手是高电平
![电路](/images/image-11.png)
左边的接法必须要求是上拉或者是下拉输入模式，右边的接法可以是浮空输入模式，因为已经外置了上拉电阻和下拉电阻



### 传感器模块（我没买）
- 传感器模块:传感器元件(光敏电阻/热敏电阻/红外接收管等)的电阻会随外界模拟量的变化而变化，通过与定值电阻分压即可得到模拟电压输出，再通过电压比较器进行二值化即可得到数字电压输出

## 常用的GPIO函数
这些函数是 STM32 标准库中用于 GPIO（通用输入输出）操作的函数，下面为你详细介绍每个函数的使用情景：

### 初始化相关函数
`void GPIO_Init(GPIO_TypeDef* GPIOx, GPIO_InitTypeDef* GPIO_InitStruct);`
- **使用情景**：该函数用于根据 `GPIO_InitStruct` 结构体中的参数初始化指定的 GPIO 端口。在使用 GPIO 之前，需要先对其进行初始化，设置 GPIO 的模式（如输入、输出、复用等）、引脚、速度等参数。例如，在控制 LED 灯、读取按键状态等操作前，都需要先调用此函数对相应的 GPIO 端口进行初始化。
- **示例代码**：
```c
GPIO_InitTypeDef GPIO_InitStructure;
// 使能 GPIOA 时钟
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
// 配置 GPIO 模式为推挽输出
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
// 选择要初始化的引脚
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;
// 配置 GPIO 速度
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
// 初始化 GPIOA 的 0 号引脚
GPIO_Init(GPIOA, &GPIO_InitStructure);
```

 `void GPIO_StructInit(GPIO_InitTypeDef* GPIO_InitStruct);`
- **使用情景**：该函数用于将 `GPIO_InitTypeDef` 结构体的成员变量初始化为默认值。当你不想手动为结构体的每个成员赋值时，可以先调用此函数进行默认初始化，然后再根据需要修改部分成员的值。
- **示例代码**：
```c
GPIO_InitTypeDef GPIO_InitStructure;
// 将 GPIO_InitStructure 初始化为默认值
GPIO_StructInit(&GPIO_InitStructure);
// 修改部分成员的值
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1;
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
// 初始化 GPIOA 的 1 号引脚
GPIO_Init(GPIOA, &GPIO_InitStructure);
```

### 读取数据相关函数
 `uint8_t GPIO_ReadInputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);`
- **使用情景**：该函数用于读取指定 GPIO 端口的单个引脚的输入电平状态。当你需要检测某个按键是否被按下，或者读取外部传感器的信号时，可以使用此函数。
- **示例代码**：
```c
// 假设 GPIOA 的 2 号引脚连接了一个按键
if (GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_2) == Bit_SET) {
    // 按键被按下，执行相应操作
}
```
 `uint16_t GPIO_ReadInputData(GPIO_TypeDef* GPIOx);`
- **使用情景**：该函数用于读取指定 GPIO 端口的所有引脚的输入电平状态，返回一个 16 位的值，每一位对应一个引脚的状态。当你需要同时读取多个引脚的状态时，可以使用此函数。
- **示例代码**：
```c
// 读取 GPIOA 端口所有引脚的输入状态
uint16_t inputData = GPIO_ReadInputData(GPIOA);
// 判断 GPIOA 的 3 号引脚状态
if (inputData & GPIO_Pin_3) {
    // 3 号引脚为高电平，执行相应操作
}
```
 `uint8_t GPIO_ReadOutputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);`
- **使用情景**：该函数用于读取指定 GPIO 端口的单个引脚的输出电平状态。通常在调试或者需要确认当前引脚的输出状态时使用。
- **示例代码**：
```c
// 读取 GPIOA 的 4 号引脚的输出状态
uint8_t outputBit = GPIO_ReadOutputDataBit(GPIOA, GPIO_Pin_4);
```
 `uint16_t GPIO_ReadOutputData(GPIO_TypeDef* GPIOx);`
- **使用情景**：该函数用于读取指定 GPIO 端口的所有引脚的输出电平状态，返回一个 16 位的值，每一位对应一个引脚的状态。类似于 `GPIO_ReadInputData`，但读取的是输出状态。
- **示例代码**：
```c
// 读取 GPIOA 端口所有引脚的输出状态
uint16_t outputData = GPIO_ReadOutputData(GPIOA);
```

### 写入数据相关函数
 `void GPIO_SetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);`
- **使用情景**：该函数用于将指定 GPIO 端口的单个或多个引脚置为高电平。当你需要点亮 LED 灯、驱动继电器等需要高电平触发的设备时，可以使用此函数。
- **示例代码**：
```c
// 将 GPIOA 的 5 号引脚置为高电平
GPIO_SetBits(GPIOA, GPIO_Pin_5);
```
 `void GPIO_ResetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);`
- **使用情景**：该函数用于将指定 GPIO 端口的单个或多个引脚置为低电平。当你需要熄灭 LED 灯、关闭继电器等需要低电平触发的设备时，可以使用此函数。
- **示例代码**：
```c
// 将 GPIOA 的 6 号引脚置为低电平
GPIO_ResetBits(GPIOA, GPIO_Pin_6);
```
 `void GPIO_WriteBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin, BitAction BitVal);`
- **使用情景**：该函数用于将指定 GPIO 端口的单个引脚设置为指定的电平状态（高电平或低电平）。可以根据需要动态地改变引脚的电平。
- **示例代码**：
```c
// 将 GPIOA 的 7 号引脚设置为高电平
GPIO_WriteBit(GPIOA, GPIO_Pin_7, Bit_SET);
```
`void GPIO_Write(GPIO_TypeDef* GPIOx, uint16_t PortVal);`
- **使用情景**：该函数用于将一个 16 位的值写入指定的 GPIO 端口，同时设置多个引脚的电平状态。当你需要同时控制多个引脚的输出状态时，可以使用此函数。
- **示例代码**：
```c
// 将 GPIOA 端口的所有引脚设置为 0x000F（低 4 位为高电平，其余为低电平）
GPIO_Write(GPIOA, 0x000F);
```

---

## OLED
### 简介
- OLED(Organic Light Emitting Diode):有机发光二极管
- OLED显示屏:性能优异的新型显示屏，具有功耗低、相应速度快，宽视角、轻薄柔韧等特点
- 0.96寸OLED模块:小巧玲珑、占用接口少、简单易用，是电子设计中非常常见的显示屏模块
- 供电:3~5.5V，通信协议:12C/SPI，分辨率:128*64
### 调试方式
1. 串口调试:通过串口通信，将调试信息发送到电脑端，电脑使用串口助手显示调试信息
2. 显示屏调试:直接将显示屏连接到单片机，将调试信息打印在显示屏上
3.  Keil调试模式:借助Kei软件的调试模式，可使用单步运行、设置断点、查看寄存器及变量等功能
   
- 因为I2C总线协议必须用开漏输出，否则容易短路
- 但是，改成推挽输出就能亮了
---

## 中断系统
- 中断:在主程序运行过程中，出现了特定的中断触发条件(中断源)，使得CPU暂停当前正在运行的程序，转而去处理中断程序处理完成后又返回原来被暂停的位置继续运行
- 中断优先级:当有多个中断源同时申请中断时，CPU会根据中断源的轻重缓急进行裁决，优先响应更加紧急的中断源
- 中断嵌套:当一个中断程序正在运行时，又有新的更高优先级的中断源申请中断，CPU再次暂停当前中断程序，转而去处理新的中断程序，处理完成后依次进行返回
![alt text](/images/image-12.png)

### stm32中断
- 68个可屏蔽中断通道包含EXTI、TIM、ADCUSART、SPI、I2C、RTC等多个外设
- 使用NVIC统一管理中断，每个中断通道都拥有16个可编程的优先等级，可对优先级进行分组，进一步设置抢占优先级和响应优先级


### NVIC
#### 基本结构
![alt text](/images/image-13.png)

#### 优先级分组
- NVIC的中断优先级由优先级寄存器的4位(0~15)决定，这4位可以进行切分，分为高n位的抢占优先级和低4-n位的响应优先级
- 抢占优先级高的可以中断嵌套，响应优先级高的可以优先排队，抢占优先级和响应优先级均相同的按中断号排队
- 值越小，优先级越高

**响应优先级就是不打断当前执行的，抢占优先级就是打断当前正在执行的低优先级中断**

| 分组方式      | 抢占优先级 |     响应优先级   |
| :---:        |    :----:   |      :---: |
| 分组0     | 0位，取值位0    | 4位，取值位0~15|
| 分组1  | 1位，取值位0~1     | 3位，取值0~7   |
| 分组2  | 2位，取值位0~3     | 2位，取值0~3   |
| 分组3  | 3位，取值位0~7     | 1位，取值0~1   |
| 分组4  | 4位，取值位0~15    | 0位，取值0   |

### EXTI
- EXTI(Extern Interrupt)外部中断
- EXTI可以监测指定GPIO口的电平信号，当其指定的GPIO口产生电平变化时，EXTI将立即向NVIC发出中断申请，经过NVIC裁决后即可中断CPU主程序，使CPU执行EXTI对应的中断程序
- 支持的触发方式:上升沿/下隆沿/双边沿/软件触发支持的GPIO口:所有GPIO口，但相同的Pin不能同时触发中断
- 通道数:16个GPIO Pin，外加PVD输出、RTC闹钟、USB唤醒、以太网
- 唤醒触发响应方式:中断响应/事件响应

#### 基本结构
![alt text](/images/image-14.png)
**如何配置外部中断**
1. 配置RCC，把涉及的外设的时钟都打开
2. 配置GPIO，选择端口为输入模式
3. 配置AFIO，选择我们这一路的GPIO，连接后面的EXTI
4. 配置EXTI，选择边沿触发方式（比如上升沿、下降沿或者双边沿），选择触发响应方式（中断响应和事件响应）
5. 配置NVIC，为中断选一个合适的优先级（在misc.c中）

（重映射就是引脚被占用，可以把别的引脚暂时变成你想用的引脚）
（这点其实讲错了，不是中断标志位，是中断挂起标志位，就是中断来了 可以处理了 先挂起等待处理着，也可以理解成等待处理标志位，中断标志位是 触发了中断条件就会产生的）
```c
#include "stm32f10x.h"                  // Device header

uint16_t CountSensor_Count;				//全局变量，用于计数

/**
  * 函    数：计数传感器初始化
  * 参    数：无
  * 返 回 值：无
  */
void CountSensor_Init(void)
{
	/*开启时钟*/
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);		//开启GPIOB的时钟
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO, ENABLE);		//开启AFIO的时钟，外部中断必须开启AFIO的时钟
	
	/*GPIO初始化*/
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_14;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOB, &GPIO_InitStructure);						//将PB14引脚初始化为上拉输入
	
	/*AFIO选择中断引脚*/
	GPIO_EXTILineConfig(GPIO_PortSourceGPIOB, GPIO_PinSource14);//将外部中断的14号线映射到GPIOB，即选择PB14为外部中断引脚
	
	/*EXTI初始化*/
	EXTI_InitTypeDef EXTI_InitStructure;						//定义结构体变量
	EXTI_InitStructure.EXTI_Line = EXTI_Line14;					//选择配置外部中断的14号线
	EXTI_InitStructure.EXTI_LineCmd = ENABLE;					//指定外部中断线使能
	EXTI_InitStructure.EXTI_Mode = EXTI_Mode_Interrupt;			//指定外部中断线为中断模式
	EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling;		//指定外部中断线为下降沿触发
	EXTI_Init(&EXTI_InitStructure);								//将结构体变量交给EXTI_Init，配置EXTI外设
	
	/*NVIC中断分组*/
	NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);				//配置NVIC为分组2
																//即抢占优先级范围：0~3，响应优先级范围：0~3
																//此分组配置在整个工程中仅需调用一次
																//若有多个中断，可以把此代码放在main函数内，while循环之前
																//若调用多次配置分组的代码，则后执行的配置会覆盖先执行的配置
	
	/*NVIC配置*/
	NVIC_InitTypeDef NVIC_InitStructure;						//定义结构体变量
	NVIC_InitStructure.NVIC_IRQChannel = EXTI15_10_IRQn;		//选择配置NVIC的EXTI15_10线
	NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;				//指定NVIC线路使能
	NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1;	//指定NVIC线路的抢占优先级为1
	NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1;			//指定NVIC线路的响应优先级为1
	NVIC_Init(&NVIC_InitStructure);								//将结构体变量交给NVIC_Init，配置NVIC外设
}

/**
  * 函    数：获取计数传感器的计数值
  * 参    数：无
  * 返 回 值：计数值，范围：0~65535
  */
uint16_t CountSensor_Get(void)
{
	return CountSensor_Count;
}

/**
  * 函    数：EXTI15_10外部中断函数
  * 参    数：无
  * 返 回 值：无
  * 注意事项：此函数为中断函数，无需调用，中断触发后自动执行
  *           函数名为预留的指定名称，可以从启动文件复制
  *           请确保函数名正确，不能有任何差异，否则中断函数将不能进入
  */
void EXTI15_10_IRQHandler(void)
{
	if (EXTI_GetITStatus(EXTI_Line14) == SET)		//判断是否是外部中断14号线触发的中断
	{
		/*如果出现数据乱跳的现象，可再次判断引脚电平，以避免抖动*/
		if (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_14) == 0)
		{
			CountSensor_Count ++;					//计数值自增一次
		}
		EXTI_ClearITPendingBit(EXTI_Line14);		//清除外部中断14号线的中断标志位
													//中断标志位必须清除
													//否则中断将连续不断地触发，导致主程序卡死
	}
}
```
#### 注意事项
   1. **中断函数要简短快速，别刚进中断就执行一个Delay多少毫秒这样的代码**。因为中断是处理突发的事情，如果你为了一个突发的事情待着中断里不出来了，那么主程序就会受到严重的阻塞
   2. 最好不要在中断函数和主函数调用相同的函数或者操作同一个硬件，尤其是硬件相关的函数，比如OLED显示函数，如果你既在主程序里调用OLED，又在中断里调用OLED，OLED就会显示错误。虽然在中断进入和退出的时候，会有保护现场和恢复现场，但这只能保证CPU程序能正常返回不出问题，对于外部硬件的话，并没有在进入中断时，进行现场保护。在实现功能的时候，**可以在中断里操作变量或者标志位**，当中断返回时，我再对这个变量进行显示和操作，这样既能保证中断函数的简短快速，又能保证不产生冲突的硬件操作
### 旋转编码器（我没买）
- 旋转编码器:用来测量位置、速度或旋转方向的装置，当其旋转轴旋转时，其输出端可以输出与旋转速度和方向对应的方波信号，读取方波信号的频率和相位信息即可得知旋转轴的速度和方向
- 类型:机械触点式/霍尔传感器式/光栅式


---
## TIM(Timer)定时器
- 定时器可以对输入的时钟进行计数，并在计数值达到设定值时触发中断
- 16位计数器、预分频器、自动重装寄存器的时基单元，在72MHz计数时钟下可以实现最大59.65s的定时
- 不仅具备基本的定时中断功能，而且还包含内外时钟源选择、输入捕获、输出比较、编码器接口、主从触发模式等多种功能
- 根据复杂度和应用场景分为了高级定时器、通用定时器、基本定时器三种类型

### 定时器类型
| 类型      | 编号 |     总线   |    功能    |
| :---:    |  :----: |   :---: |    :---:   | 
| 高级定时器    | TIM1、TIM8    | APB2|    拥有通用定时器全部功能，并额外具有重复计数器、死区生成、互补输出、刹车输入等功能   |
| 通用定时器  | TIM2、TIM3、TIM4、TIM5 | APB2 |  拥有基本定时器全部功能，并额外具有内外时钟源选择:输入捕获、输出比较、编码器接口、主从触发模式等功能  |
| 基本定时器  | TIM6、TIM7  | APB1    |    拥有定时中断、主模式触发DAC的功能    |

- STM32F103C8T6定时器资源:TIM1、TIM2、TIM3、TIM4

#### 定时中断
![alt text](/images/image-15.png)
从基准时钟到预分频器，再到计数器，计时器自增，同时不断地与自动重装寄存器进行比较，值相等时，即计时时间到，计数值清零同时会产生一个更新中断和更新事件，CPU响应更新中断，就完成了我们定时中断的任务了
- 时基单元
  - 预分频器
  - 计数器
  - 自动重装载寄存器

![alt text](/images/image-16.png)


### 定时中断和内外时钟源选择
- 计数器溢出频率: `CK_CNT_OV=CK_CNT/(ARR +1) =CK PSC/(PSC + 1)/(ARR + 1)`
### 输出比较