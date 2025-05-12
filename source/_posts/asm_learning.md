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
- T 一步一步执行
- G 直接执行到终点
- R 输出所有寄存器的地址（）
- D XXXX:0000，查看内存

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
## LABEL和JUMP
- 一段代码就有label
- jump NAME就可以跳转至label的位置
```armasm
MAIN:MOV X,AX
JUMP DONE
MOV AX,Y

...
DONE:
    MOV AH,4CH
    INT21
```
在这段程序中，`MOV AX,Y`就会直接跳过


## 分支和循环
### 分支 CMP-JGE/...
- 先CMP再JGE
- 都是第一个怎么样第二个

| Mnemonic | Condition Tested | "Jump IF ..." |
|:----------:|:------------------:|:---------------:|
| JA/JNBE  | (CF = 0) and (ZF = 0) | above/not below nor zero |
| JAE/JNB  | CF = 0           | above or equal/not below |
| JB/JNAE  | CF = 1           | below/not above nor equal |
| JBE/JNA  | (CF or ZF) = 1   | below or equal/not above |
| JC       | CF = 1           | carry         |
| JE/JZ    | ZF = 1           | equal/zero    |
| **JG**/JNLE  | ((SF xor OF) or ZF) = 0 | greater/not less nor equal |
| **JGE**/JNL  | (SF xor OF) = 0  | greater or equal/not less |
| **JL**/JNGE  | (SF xor OF) = 1  | less/not greater nor equal |
| **JLE**/JNG  | ((SF xor OF) or ZF) = 1 | less or equal/not greater |
| JNC      | CF = 0           | not carry     |
| JNE/JNZ  | ZF = 0           | not equal/not zero |
| JNO      | OF = 0           | not overflow  |
| JNP/JPO  | PF = 0           | not parity/parity odd |
| JNS      | SF = 0           | not sign      |
| JO       | OF = 1           | overflow      |
| JP/JPE   | PF = 1           | parity/parity equal |
| JS       | SF = 1           | sign          |

eg:求abs（AX）保存在AX中
```armasm 
MAIN:
...
CMP AX,0
JGE DONE ;JUMP IF GREATER OR EQUAL
NEG AX ;将 AX 中的数值变为它的负数形式

DONE:
...

END MAIN
```

### 循环LOOP
- 一种简单的循环，类似于`for(cx;;cx--)`。(事实上，你可以用JUMP和分支结构来实现循环)
```armasm
; 三段论
MOV CX,6
NM: ...
LOOP NM;这样写一共执行CX次（声明NM时执行1次，LOOP中执行CX-1次）
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
```armasm
DSEG SEGMENT
    X DW 1234H
    Y DW 2345H
    Z DW ?
DSEG ENDS

CSEG SEGMENT
    ASSUME DS:DSEG, CS:CSEG ;define

BEGIN: ;only a label which means you can use any words you like
    MOV AX,DSEG
    MOV DS, AX ;initialize DS

    MOV AX, X
    ADD AX, Y
    MOV Z, AX
    
    MOV AH, 4CH ;返回dos
    INT 21H 
CSEG ENDS
END BEGIN
```
# 练习2
> 1. 在数据段(data segment)中定义4个word,其中x=1234H，y=2345H,
> Z=-1234H，W=?
> 2. 求max(x,y,z)储存于w
```armasm
; 求最大值
DSEG SEGMENT
        X DW 1234H
        Y DW 2345H
        Z DW -1234H
        W DW ?
DSEG ENDS
 
;程序是从上到下执行的，条件不符合JGE就会跳到下面的代码
CSEG SEGMENT
    ASSUME DS:DSEG, CS:CSEG ;define
BEGIN: 
    MOV AX,DSEG
    MOV DS, AX ;initialize DS

    MOV AX, X
    CMP AX, Y ;AX里面一直存放最大值

    JGE X_LARGER
    MOV AX, Y;AX<Y

X_LARGER:
    CMP AX, Z
    JGE Z_LARGER
    MOV AX, Z

Z_LARGER:
    MOV W, AX

    MOV AH, 4CH ;返回dos
    INT 21H
CSEG ENDS
END BEGIN
```
注意label不要用跟命令一样的


# 堆栈的使用
## 初始化
两个方法
1. 直观的（堆栈段中做定义）
   1. 在堆栈段划分位置，保存栈顶位置
   2. 在程序段开始的时候把堆栈段的位置告诉堆栈寄存器SS，把栈顶的位置告诉指针寄存器SP
    ```armasm
    SSEG SEGMENT
        STACK DW 128 dup(?)
        TOP DW LENGTH STACK ;划定范围
    SSEG ENDS
    
    CSEG SEGMENT
        ASSUME CS:CSEG,DS:DSEG,SS:SSEG
    MAIN:
        MOV AX,DSEG
        MOV DS,AX
        MOV AX,SSEG
        MOV SS,AX
        MOV AX,TOP;手动把栈顶指针放好
        MOV SP,AX ;栈顶地址载入
    ```
2. 没那么直观的（程序段中划空间）
直接给SP赋值
    ```armasm
    SSEG SEGMENT
    SSEG ENDS
    ;ss:0000-ss:1000
    
    CSEG SEGMENT
        ASSUME CS:CSEG, DS:DSEG,SS:SSEG
    BEGIN:
        MOV AX,DSEG
        MOV DS,AX
        MOV AX,SSEG
        MOV SS,AX
        MOV SP,1000H ;手动规定了1000H的空置空间(OFFSET 0H-1000H)
    ```

## push和pop
**只能操作寄存器，不能操作内存单元**

---

假设当前：
```
SS = 1000H
SP = 2000H
AX = 1234H
```
 执行 `PUSH AX` 后发生了什么？

1. 因为 `AX` 是一个 **16位寄存器（两个字节）**，所以要将这两个字节写入堆栈。
2. 写入之前，**SP 先减去 2** → `SP = 1FFEh`
3. 然后把 `AX=1234H` 存入内存：
   - 地址 `SS:1FFE` = `34H`（低位）
   - 地址 `SS:1FFF` = `12H`（高位）

> ⚠️ 注意：x86 是小端序（Little Endian），低位字节放在低地址。

**此时堆栈状态如下：**

| 地址       | 数据 |
|------------|------|
| SS:1FFF    | 12H |
| SS:1FFE    | 34H |
| SS:1FFD    | --  |
| ...        | ... |

---
接着执行 `POP AX`：

1. 从当前 SP 所指向的位置读取两个字节：
   - `SS:1FFE = 34H`
   - `SS:1FFF = 12H`
   - 组合起来就是 `AX = 1234H`
2. 然后 **SP 增加 2** → `SP = 2000H`

---

**🔁 总结一句话：**

> 在 x86 架构中，堆栈是向下增长的，因此：
> - `PUSH` 操作：先让 SP 减 2，再把数据写入；
> - `POP` 操作：先读取数据，再让 SP 加 2。

---

**🧩 类比记忆方法（类比现实中的“箱子”）**

你可以把堆栈想象成一个箱子，只能从顶部拿东西和放东西：

- 箱子底部是高地址；
- 放东西进去（`PUSH`）→ 箱子里的东西变多，顶部下移（SP 减小）；
- 拿东西出来（`POP`）→ 箱子里的东西变少，顶部上移（SP 增大）。

---

**✅ 补充知识：SP 指的是栈顶的偏移地址**

- `SS` 是堆栈段寄存器；
- `SP` 是当前堆栈指针（偏移地址）；
- 实际访问的内存地址是：`SS:SP`

---
# <函数>:PROC和MACRO
## PROC
以下是根据你的描述整理的Markdown格式内容：

```markdown


# 子程序(PROC)和宏(MACRO)

## PROC & CALL（子程序结构）

**定义：** 

```assembly
MAIN:
    CALL NM

NM PROC
    ...
    RET
NM ENDP
...
END MAIN
```

**完整的表达式：**

- 调用：`CALL FAR/NEAR PTR NM`
- 定义：`NM PROC FAR/NEAR`

如果只需要主Label调用，则可以留空，默认为Near。

**PROC的本质：**

入栈程序出口指针，RET时返回到出口指针的位置。因此：
1. 第一个出栈元素会是一个偏移地址。
2. 如果最后SP的指针位置不对，就无法正确RET。

简单的方法是使用寄存器BP保护SP，并使用BP进行数据读取。

### 示例：求两个栈顶元素之和并存储于AX中

```assembly
SUM PROC 
    MOV BP, SP
    MOV AX, [BP+2]
    ADD AX, [BP+4]
    RET
SUM ENDP
```

## MACRO（宏定义）

```assembly
NM MACRO R1, R2...
    ...
ENDM
```

例如：

```assembly
NM MACRO AX, BX...
    ...
ENDM
```

**注意：**
- `PROC`的使用有调用开销（程序中断、跳转、继续），而`MACRO`没有。
- `MACRO`相当于写代码的人把重复写代码的过程交给了汇编器，相比子程序来说，它是通过多占程序的内存来提高运行速度。

# INT 21H指令：输入/输出

## 键盘输入

### 单个字符输入（1号指令）

```assembly
MOV AH, 1
INT 21H
; 内容保存在AL
```

### 字符串输入（10号指令）

需要在内存里划分三个部分：
1. 一个字节存放最大长度。
2. 一个字节存放实际长度（指令运行完CPU会填写）。
3. 一些字节用来存字符串。

示例：

```assembly
DATA SEGMENT
    MAXLENGTH DB 100 ; 最大长度
    ACTUALLENGTH DB ? ; 实际长度
    STRING DB 100 DUP(?) ; 字符串
DATA ENDS

STACK SEGMENT
STACK ENDS

CODE SEGMENT
ASSUME DS:DATA, SS:STACK, CS:CODE
MAIN:
    MOV AX, DATA
    MOV DS, AX
    MOV DX, OFFSET MAXLENGTH
    MOV AH, 10
    INT 21H
    MOV AH, 4CH
    INT 21H
CODE ENDS
END MAIN
```

## 显示器输出

### 单个字符输出（2号调用）

```assembly
MOV DL, 'A'
MOV AH, 2
INT 21H
```

### 字符串输出（9号调用）

字符串必须以`'$'`结尾，类似于C语言中的`'\0'`。

```assembly
MOV DX, OFFSET STRING
MOV AH, 9
INT 21H
```

# 综合练习

## 练习d: 大小写转换+输入输出

用户输入一个单词，程序将所有大写字母转换为小写字母并输出到显示器。

提示： `'a' = 'A' + 20H`
```

这段整理涵盖了你提供的关于汇编语言中子程序(`PROC`)和宏(`MACRO`)的使用方法、堆栈操作以及如何使用`INT 21H`进行输入输出处理的基本知识。希望这对你有所帮助！如果有任何进一步的问题或需要更多细节，请随时告知。