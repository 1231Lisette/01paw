---
title: Pi Network（树莓派4B非桌面端初始化及WIFI配置）
date: 2025-07-26
tags: [树莓派, WiFi配置, SSH, 静态IP, 网络调试]
categories: 我的笔记
---

# 树莓派4B初始化及WiFi连接（无图形界面版）

> 本文主要是我自己在配置树莓派4B时的完整过程和踩坑记录。适合以后自己复盘使用，也可能对新手有帮助。

---

## 一、准备工作

### 1. SD卡格式化

推荐使用官方的 **[SD Card Formatter](https://www.sdcard.org/downloads/formatter/)** 工具进行格式化，这样能避免潜在的分区问题。SD卡建议容量 **至少32GB**，速度尽量选择 A1 或 U1 及以上。

---

### 2. 烧录系统镜像

使用 **树莓派官方 Imager** 进行烧录（图形界面工具，支持 Windows/Mac/Linux），镜像选择 Raspberry Pi OS Lite（无桌面版），更轻量、适合纯SSH远程控制。

烧录步骤：
- 插入SD卡
- 选择操作系统（推荐：Raspberry Pi OS Lite）
- 点击右下角齿轮图标【预设】进行以下配置（可提前完成系统初始化）：

  **⚙️ 配置项：**
  - 设置主机名（例如：`raspberrypi`）
  - 启用SSH
  - 设置默认用户名/密码
  - 设置WiFi SSID 和密码
  - 设置WiFi国家（如CN）
  - 设置局域网时区、键盘布局（可选）

---

## 二、手动检查SD卡配置（可选）

烧录完成后，在 Windows 系统中会看到名为 `boot` 或 `system-boot` 的分区（FAT32格式），进入后：

### 1. 检查并编辑 WiFi 配置文件

如果你用了 Imager 的配置功能，系统会自动生成一个 `network-config` 或 `wpa_supplicant.conf` 文件，你可以用记事本或 VSCode 检查其中的SSID和密码是否正确，**尤其是密码，有时乱码要手动改**。

范例内容：

```conf
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="你的热点名"
    psk="你的wifi密码"
    key_mgmt=WPA-PSK
}
````

### 2. 启用 SSH（非常重要）

新版本的系统默认 **不启用SSH**，你需要在 `boot` 分区根目录下手动创建一个名为 `ssh` 的空文件（无扩展名）。

```bash
# 如果在Linux系统操作
touch /media/$USER/boot/ssh
```

---

## 三、重要提醒：热点必须使用 2.4GHz

这是我卡了最久的点！！！树莓派4B默认 **不支持5GHz热点的某些AP频段**（特别是某些手机共享热点），一定要将热点配置改为 **2.4GHz频段**。
否则你会怎么都连不上，一度以为是前面哪个步骤错了，还多烧了两次系统……

---

## 四、上电、查找IP、远程连接

将烧录好的SD卡插入树莓派，上电启动，稍等1分钟左右。

### 查找树莓派IP地址（几种方式）：

* 查看手机热点已连接设备（树莓派会显示出来）
* 或者在路由器管理后台查看新接入设备
* 或使用工具如 `Fing` 扫描局域网
* 也可以在虚拟机中用 `arp -a` 查看局域网内IP

### 用 SSH 远程连接

```bash
ssh pi@树莓派IP地址
# 默认用户：pi，默认密码：raspberry（如果没改过）
```

---

## 五、配置静态 IP（可选但推荐）

动态IP在断电或切换热点时容易变化，建议将树莓派配置为静态IP。步骤如下：

```bash
sudo nano /etc/netplan/50-cloud-init.yaml
```

修改如下（示例）：

```yaml
network:
  version: 2
  ethernets:
    wlan0:
      dhcp4: no
      addresses:
        - 192.168.68.100/24
      gateway4: 192.168.68.1
      nameservers:
        addresses:
          - 8.8.8.8
```

修改完后保存，并执行以下命令应用设置：

```bash
sudo netplan apply
```

**注意：一旦设置成功并应用后，SSH连接会断开**，你需要用新的静态IP重新连接。

---

## 六、常见问题与排查

### 1. 无法连网但能看到IP？

尝试手动ping网关：

```bash
ping 192.168.68.1
```

如果不能通，可能是网关写错了，或者热点与树莓派频段不兼容。

### 2. `wget` 失败报错 "No route to host"？

说明树莓派虽然有IP但没有正确连通外网，常见原因：

* DNS未配置或写错 → 可改为 `8.8.8.8`
* 网关写错
* 热点未开启数据共享（流量转发）

---

## 总结

我的踩坑记录如下：

* ⚠️ 配置热点时未选2.4GHz，导致WiFi连不上，一度以为是系统烧录失败
* ⚠️ 密码乱码未注意，实际配对失败
* ⚠️ 静态IP设置后忘记换新IP连接
* ✅ 使用官方Imager工具进行预配置非常方便，建议以后都使用

---

> 如果你也在配置树莓派非桌面版并连接WIFI，这篇笔记或许能帮你少走弯路。


---
