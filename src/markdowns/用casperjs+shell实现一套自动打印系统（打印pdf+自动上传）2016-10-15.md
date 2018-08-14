首先把问题进行分解嘛，把**这只大象放进冰箱要经过几个步骤**：

1. 请求最新的订单，得到要转为pdf的网页**(写个网页，来实现这个业务逻辑)**
2. 用脚本把网页转成pdf**(casperjs, phantomjs)**
3. 上传pdf到服务器**（shell  scp）**
4. 把最新订单标识为处理成功**(shell curl)**
5. 若有订单，循环执行1，不然等待10分钟再执行1。

其实吧，整个workflow最关键的就是**第二步**，把网页转成pdf，所以在这个问题上做了些研究，按时间轴顺序分为这么初级，中级，高级这么三个阶段。

- 初级：谈到网页转pdf，最先想到的一定是**chrome浏览器自带的 cmd+p 这个网页打印功能**。这个时候的操作步骤是

- - 做一个适应于A4的网页（浏览器提供A4，A3）。经过尝试发现网页【每页的尺寸width:794px;height:1123px;border:1px solid rgba(0, 0, 0, 0.01);】在这个尺寸下，多页不会出现跨页，pdf尺寸溢出之类的问题。
  - 打开网页，等待期加载完成
  - 按cmd+p 打开浏览器自带打印程序，拖到页尾，等待其加载完成
  - 按保存，输入文件名，保存到本地目录
  - 因为最终要交付的是A5格式的，所以还要用mac自带的pdf阅读器把A4转成A5格式的pdf

- 中级：从初级这个打印步骤看，很明显，一旦订单量上来了，我们就要配制定的负责打印的员工，**去做这类重复枯燥的事情**，这时候我们就开始尝试其他的打印解决方案**，让程序帮我们完成这些重复枯燥的事情。** 当然网页转pdf的方案很多，有c++(wkhtmltopdf),ruby(pdfkit),java(asciidoc)，node.js(phantomjs)，最终因为自己是前端开发，所以选择了node.js下 phantomjs的解决方案，它是这么自我介绍的PhantomJS is a headless WebKit scriptable with a JavaScript API.  这个框架的主要用途是配合一些Jasmine，Mocha这些测试框架用来做无界面的网页测试。api里其中有一块是 **screen capture**，其中有个page.render('a.pdf')函数，直接可以实现把一个网页保存为pdf这个功能。后来又在phantomjs官网被安利了 casperjs  （和phantomjs的关系类似于 jquery之于javascript），语法更加简便。在这个阶段，我实现了

- - 用一个网页提供一堆待转成pdf的网页url
  - 用casperjs脚本去爬去待打印的url数组
  - 依次把每个url转成pdf，并按照规定文件名存好
  - filezilla拖动上传到ftp

- 高级：中级实现的几个功能虽然极大的解放了劳动力，但还不是最理想的，全自动化的。其实打印那一步，借鉴中级阶段的流程就好了，只要加上些业务上的逻辑，让程序能做到循坏依次打印订单，然后配合上shell脚本就能实现啦。具体步骤就参照本文开头的把大象放进冰箱的几个步骤。



在写这套系统中，当然会遇到一些坑或难题，所以总结了一些**小技巧,小经验**。

-  在我的使用经验中，**不同版本的casperjs，phantomjs有不同的特性**,

- -  在casper 1.1.0 beta3和 phantomjs 1.9.8中，执行capture函数，它直接会等待该网页所有图片加载完成，然后产出pdf。
  - 在后来比较新的版本，如casper 1.1.0 beta5和 phantomjs 2.1.1中，capture函数不会等待所有内容加载完成，所以在使用过程中必须在打开网页后设置些等待时间。

- 因为在项目中，需要在这两种不同版本的（capserjs+phantomjs）做不同内容的打印，所以**需要在同台电脑里装两个不同的版本**

- - 在全局安装老版本casper 1.1.0 beta3和 phantomjs 1.9.8

  - 在当前目录安装新版本casper 1.1.0 beta5和 phantomjs 2.1.1

  - 建立软链接用于在当前目录下调用到新版本的casper

  - - ln -s node_modules/casperjs/bin/casperjs ./
    - ln -s node_modules/casperjs/bin/casperjs ./

  - 在node_modules/casperjs/bin/casperjs.js 改启动配置项

  - - 'default_exec' : './phantomjs'

- - 在当前目录下通过./casperjs 启动新本程序，用capserjs启动老版程序



- 如果想兼容老版本的casperjs的话，这个**最好不要升级到** **mac OS sierra 10.12**  ，一天手贱，点了下系统升级，然后升级到这个系统后 npm ，homebrew各种不兼容，还要配合升级XCODE。最终是能把最新的casperjs跑起来，但老版本的casperjs1.1.0beta-3（phantomjs1.9.8）已经跑不起来了。后来公司整了台新mac（OSX EL Captian 10.11.6）,完美的运行着新老两套casperjs

- 

- scp （secure copy）向服务器拷贝文件时需要输入密码。通过建立信任关系，现配置免登录。

- - 在这里先介绍两个概念：SSH公钥(~/.ssh/id_rsa.pub)和公钥授权文件(~/.ssh/authorized_keys)

  - - 本地执行 ssh-keygen，产生id_rsa.pub
    - scp id_rsa.pub 服务器地址/.ssh
    - cat id_rsa.pub >~/.ssh/authorized_keys  把你本地机子的公钥放进服务器的公钥授权文件就ok啦

- 在shell端，用curl实现 get请求，post获取接口返回数据

- - curl "http://xxxx.com/printConfirm"