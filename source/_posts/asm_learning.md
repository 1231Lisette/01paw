---
title: 8086/8088学习
date: 2025-05-10
tags:
    - assembly language
categories: 我的笔记
---
# 第一个程序
> 把helloworld存储到数据段里，然后在代码段里执行指令把内存里的数据显示出来
```armasm
DSEG SEGMENT;datasegment,dataseg,data...
    MESS DB 'Hello,world', 0DH, 0AH, '$'  ; 注意：24H 即 '$'
    ;mess是变量的名字，DB是变量类型
DSEG ENDS

SSEG SEGMENT PARA STACK
    DW 256 DUP(?)
SSEG ENDS

CSEG SEGMENT
    ASSUME CS:CSEG, DS:DSEG, SS:SSEG
BEGIN:
    MOV AX, DSEG ;INT MAIN()
    MOV DS, AX

    MOV DX, OFFSET MESS
    MOV AH, 09H      
    INT 21H

    MOV AH, 4CH
    INT 21H
CSEG ENDS
END BEGIN
```
# 用dosbox调试
- t 逐步执行
- G 直接输出结果
- D 查看内存
  - 040B:0000

# 指令
## SEGMENT指令
- 在内存中分配一段内存存东西
- 只能分配4个段
  - 数据段data
  - 堆栈段stack
  - 代码段code（可以只有code）
  - 

## ASSUME
一般就这么用`ASSUME CS:CSEG, DS:DSEG, SS:SSEG`

## 数据定义
- 数据类型
  - DB define a byte
  - DW define a word
```armasm
DB:12H
DW:1234H
X DB ? ;不知道定义什么就把它留空
ARRAY DB 100(12H);分配100个字节，都放12H，不知道装什么就打问号
```
## MOV
常用的合法操作
```armasm
MOV AX,Y ;内存到寄存器
MOV Y,AX ;寄存器到内存
MOV AX,BX ;寄存器到寄存器
MOV AX, 5    ; 立即数到寄存器
MOV [Y], 10  ; 立即数到内存（变量Y所指向的内存位置）

; 寄存器作为中介
MOV AX, Y2    ; 首先将Y2的值加载到寄存器AX
MOV Y1, AX    ; 然后将AX的值存储到Y1

MOV AX, DSEG ; 假设DSEG是一个数据段地址
MOV DS, AX   ; 将AX的内容传给段寄存器DS

```
**不能直接操作两个内存单元！！**
## +-
```armasm
ADD AX,X ;AX=AX+X
SUB AX,X 
INC AX ;AX++
DEC AX ;AX--
```

## 程序的终止
直接把他记住！
```armasm
MOV AH,4CH
INT 21H
```

# 寄存器（都是16位寄存器）
## 通用寄存器：AX,BX,CX,DX 
- 可以拆成高8位和低8位`AH`,`AL`
- 中转站
### AX Accumlator累加器
与MUL/DIV有关
### BX Base基地址寄存器
- 可以存储地址并访问
内存中的地址是这样的`204B:1001`，用两个16进制数来表示。`204B`是段地址(这个段就是指我们程序对应的段Segment)，`1001`是偏移地址，各需要一个word进行存储。可以用`SEG`指令获取**段地址**，用`OFFSET`指令获取**偏移地址**

```armasm
;在“通过地址找内容”这件事情方面，一般用BX存储偏移地址
X DW 1234H
Y DW ?
MOV BX OFFSET X ;BX中存储了X的偏移地址
MOV Y [BX] ;BX存储的偏移地址对应的内容被存放到y
[] ;取内容
```
一般来说，`[BX]`就是指`DS:[BX]`，默认段地址为数据段，当然可以自己指定CS和SS
### CX Count计数器
和循环指令`loop`有关
### DX Data数据寄存器
与MUL/DIV有关

## 指针变址寄存器：SP,BP,SI,DI
都倾向于用来存地址
### SP:Stack Pointer
栈顶指针，和堆栈段的使用有关，**定义堆栈段要手动把SP放在栈顶**
### BP:Base Pointer
和BX有类似的用法，只是一般更倾向于用在**堆栈段**的数据里，`[BP]`默认为`SS:[BP]`
### SI:Source Index
### DI Destination Index
和BX有类似的用法，`[SI]`默认为`DS:[SI]`，如果要转移数据，倾向用SI存原地址，DI存新地址

## 段寄存器：CS,DS,SS,ES,IP
- 段的存在方便我们以段地址+偏移地址的方式定位内存单元
- 刚刚在例子中看到，一般的程序我们定义三个段，Data、stack和Code，它们的作用和名字是一致的
- 这些寄存器都和程序段还有程序的运行有关。
- 在程序启动的时候，操作系统会把IP(InstructionPointer)指向程序的第一句开始运行，之后IP会一直指向每次要运行的下一条指令(显然我们可以用IP玩一些花活，但是对于简单的程序，我们没有必要操作IP)
- 在代码段的开始，我们就用Assume语句声明CS、DS、SS的地址和CS不同，DS和SS寄存器的值需要我们手动指定，而与SS寄存器绑定的SP指针也需要我们手动设置(SS:SP指向的就是栈顶元素)
- ES是Extra segment，程序有附加段落的时候才用，用法和DSSS差不多
## 标志寄存器：FLAG

只是写代码的话不用管它。16位分开使用，有各自不同的意思，结果会以下面的形式呈现在-R
| 标志位名称 | 值为 1 时的标记 | 值为 0 时的标记 |
|:------------:|:-----------------:|:-----------------:|
| OF         | OV              | NV              |
| SF         | NG              | PL              |
| ZF         | ZR              | NZ              |
| PF         | PE              | PO              |
| CF         | CY              | NC              |
| DF         | DN              | UP              |

# 例题1
> 练习a x+y
> 1. 在数据段中定义三个word，其中x=1234H，y=2345H，z=？
> 2. 将x+y的结果保存在z中