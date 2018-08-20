<!--<img-url>buildAssetPath/default.jpeg</img-url>--> 
<!--<title>mdblog说明文档</title>--> 
<!--<intro>文章简介文章介文章简介简介文章简文章简介文章简介文章简介 </intro>--> 
<!--<tag>README</tag>-->
<!--<date>2018-08-20</date>-->
mdblog 介绍
mdblog是一个极简的，基于markdown的静态网页生成器。它诞生的初衷仅仅是我个人需要把一些markdown文件转成静态网页来作为我的博客。

它是如何工作的

整个项目要做的无非就是把一堆markdown 文件变成一堆文章的HTML页面，同时生成主页和博客列表页，很幸运找到一个第三方库 marked 帮我们来做markdown编译成HTML DOM 这个事情。

特征

- 可能会有不少bug
- 极简，无上手成本

为什么不是...

Nuxt,,Hexo,VuePress,Keystone.js

快速上手

请先确认自己本机拥有node.js，git环境

全局安装

    # 安装脚手架
    npm install -g mdblog-create # 或者 yarn global add mdblog-create
    # 在指定目录，初始化项目
    mdblog init # 初始化过程中会让你自定义目录名称 project-name
    # 进入项目
    cd project-name
    # 安装依赖
    npm install # 或 yarn 

构建静态页面

在项目根目录运行build命令即可，

    npm run build # 或 yarn build

运行完毕后，在根目录下会有一个build目录产生，里面包含：主页(index.html)，博客列表页(posts.html)，文章页(文章名.html，其中文章 名一一和src/markdowns目录下的markdown文件对应)。

项目目录介绍



自定义主题

开启本地调试

    npm run dev # 或 yarn dev

启动页面中包含三个组件（对应项目src/components目录下三个文件夹）：导航，主页，博客列表页。每个组件文件夹下分别含有该组件对应的 html, css, js这三个文件，让你最大自由度的自定义主题。

图片引入 & 样式自定义

把图片放在 src/assets 下，图片路径需命名为 buildAssetPath，支持html格式写法，同时支持宽度或style属性的定义

    <img src="buildAssetPath/default.jpeg" width="100" alt="love"/>



常见问题

因为引入了css-loader ，它需要匹配对应的node版本，如出现以下提示就按要求把本地node环境切到对应版本

    error css-loader@1.0.0: The engine "node" is incompatible with this module. Expected version ">= 6.9.0 <7.0.0 || >= 8.9.0".








