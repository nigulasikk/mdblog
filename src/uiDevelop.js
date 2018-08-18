import './components/HomePage/homepage.css';
import './components/TopNav/nav.css';
import './components/Posts/posts.css';
import homePageDom from './components/HomePage/homepage.html';
import topNavDom from './components/TopNav/nav.html';
import postsDom from './components/Posts/posts.html';
document.write(topNavDom);
document.write('<h1 style="width:1000px;margin:60px auto;color:black;border:2px dotted black;"><div style="color:white;background:red;text-align:center;padding:5px;width:250px;margin:30px auto;">FBI WARNING</div>温馨提示：本页把src/components 目录下的三个组件导入在一个页面，如果你也了解一些前端知识，可用它来进行页面DRY，进行本地调试。</h1>');
document.write('<div style="color:red;border:1px dashed red;">homePageDom 组件样式 start</div>');
document.write(homePageDom);
document.write('<div style="margin-bottom:60px;color:red;border:1px dashed red;">homePageDom 组件样式 end</div>');
document.write('<div style="color:red;border:1px dashed red;">postsDom 组件样式 start</div>');
document.write(postsDom);
document.write('<div style="color:red;border:1px dashed red;">postsDom 组件样式 start</div>');


import './components/TopNav/nav.js';
import './components/HomePage/homepage.js';
