# mdblog 介绍

mdblog是一个极简的，基于markdown的静态网页生成器。它诞生的初衷仅仅是我个人需要把一些markdown文件转成静态网页来作为我的博客。

## 它是如何工作的

整个项目要做的无非就是把一堆markdown 文件变成一堆文章的HTML页面，同时生成主页和博客列表页，很幸运找到一个第三方库 [marked](https://github.com/markedjs/marked)帮我们来做markdown编译成HTML DOM 这个事情。

## 特征

- 支持markdown：以markdown文件为中心，生成github markdown样式风格的静态页面。
- 定制UI，无上手成本：没有繁杂的layout配置，回归html,css,js,以本该有的方式自定义导航，主页。
- 可能会有不少bug

## 为什么不是...

#### Keystone.js ,WordPress

不够轻，简易。之前我个人博客站点就是用keystone.js的，虽然照着文档搭建起来没那么难，但涉及到迁移，维护，运维成本显得过高。在我ECS到期之际，我就决定放弃这类带数据库的CMS类的博客框架，转向更适合我需求的静态网站生成工具，毕竟我需要的仅仅是文章页 + 一个可自定义的主页。

#### VuePress

灵活易用的vue.js在我心中印象甚好，其实在调研静态网站生成工具时候，VuePress是我的首选，但目前的VuePress整体页面结构更适合用作项目文档，VuePress的博客特性也正在开发中。

#### Hexo

功能很强大，建议定制化需求比较高的同学可以去用这个。相对于我个人的需求来说（仅仅是文章页 + 一个可自定义的主页），我感觉我需要的滑板鞋要更加的简单：不需要各种 new 文章的命令，就直接把一个文件夹下的所有markdown文件转成静态HTML好了。

##### 好了，反正给自己造轮子也找足理由了,能说服自己就好....

# 快速上手

请先确认自己本机拥有[node.js](https://nodejs.org/en/)，[git](https://git-scm.com/)环境

## 全局安装

```
# 安装脚手架
npm install -g mdblog-create # 或者 yarn global add mdblog-create
# 在指定目录，初始化项目
mdblog init # 初始化过程中会让你自定义目录名称 project-name
# 进入项目
cd project-name
# 安装依赖
npm install # 或 yarn 
```

## 构建静态页面

在项目根目录运行build命令即可，

```
npm run build # 或 yarn build
```

运行完毕后，在根目录下会有一个build目录产生，里面包含：主页(index.html)，博客列表页(posts.html)，文章页(文章名.html，其中文章 名一一和src/markdowns目录下的markdown文件对应)。

## 项目目录介绍

![image](https://github.com/nigulasikk/mdblog/blob/master/src/assets/fold.png)

## 自定义

##### 开启本地调试

```
npm run dev # 或 yarn dev
```

启动页面中包含三个组件（对应项目src/components目录下三个文件夹）：导航，主页，博客列表页。每个组件文件夹下分别含有该组件对应的 html, css, js这三个文件，让你最大自由度的自定义主题。

##### 图片引入 & 图片样式自定义

先把图片放在 src/assets 下，你可以在任何markdown文件里用熟悉的html格式引入该图片，如下

```
<img src="buildAssetPath/default.jpeg" width="100" alt="love"/>
```

其中，图片路径需命名为 buildAssetPath，同时支持width或style属性的定义。

##### 博客列表页博文自定义（包括文章配图，标题，介绍，标签，日期），如本文档头几行一样。

```
<!--<img-url>buildAssetPath/default.jpeg</img-url>--> 
<!--<title> mdblog 说明文档 </title>--> 
<!--<intro> 介绍mdblog </intro>--> 
<!--<tag>README</tag>-->
<!--<date>2018-08-20</date>-->
```

其中，title 和 intro 两个标签里面的内容分别会同步到页面的TDK(title,description,keywords)里面，用于SEO。

## 常见问题

因为引入了css-loader ，它需要匹配对应的node版本，如出现以下提示就按要求把本地node环境切到对应版本

```
error css-loader@1.0.0: The engine "node" is incompatible with this module. Expected version ">= 6.9.0 <7.0.0 || >= 8.9.0".
```
