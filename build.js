
var fs = require('fs');
var marked = require('marked');
// 构建output目录
var outputFold = 'build';
var pageTitle = 'mdblog的主页';
// 博客页面 和 博客列表页 top-banner
var blogTopBanner =function (title) {
 return '<div class="top-banner" > <div id="top-banner-logo">mdblog</div> <div class="top-banner-name">'+title+'</div> </div>'
}

init();
//入口函数
function init(){
    initDir();
    writeHomepageHtml();
    readFolder('./src/markdowns');
    copyFolder('./src/assets')
    readJsonInfoOfAllPosts('./src/markdowns');
}

// 初始化目录结构
function initDir(){
    // 如果build目录不存在，则创建它
    if (!fs.existsSync(outputFold)) {
        // 创建output文件夹
        fs.mkdirSync(outputFold,0777);
    }
     // 如果build asset目录不存在，则创建它
    if (!fs.existsSync(outputFold + '/assets')) {
        // 创建output文件夹
        fs.mkdirSync(outputFold+ '/assets',0777);
    }
}
// 复制文件夹一级图片
function copyFolder(filePath){
    var files = fs.readdirSync(filePath);
    files.forEach(function(filename){
        fs.writeFileSync('./'+ outputFold +'/assets/' + filename ,  fs.readFileSync(filePath +'/'+filename ));
     });
}
// 读取一个文件夹下所有文件 ，生产的时候，不用排序
function readFolder(filePath){
    var files = fs.readdirSync(filePath);
    files.forEach(function(filename){
        if(filename.indexOf('.md') === -1) return;
        // 无后缀文件名
        let targetFileName = filename.replace('.md','');
        let markdownContent = readFileAndParse(filePath + '/' + filename);
        writeHtml(targetFileName, markdownContent);
     });
}
// 取所有博文信息，post页面文章列表生成，得排序
function readJsonInfoOfAllPosts(filePath){
    var postArrays = [];
    var files = fs.readdirSync(filePath);
    files.sort(function(a,b){
        return a.split('.')[0] - b.split('.')[0]
    });
    files.forEach(function(filename){
        if(filename.indexOf('.md') === -1) return;
        // 无后缀文件名
        let targetFileName = filename.replace('.md','');
        let markdownContent = readFileAndParse(filePath + '/' + filename);
        // 自定义博客列表的内容
        let dryTitle = /<!--<title>(.*)<\/title>-->/.exec(markdownContent);
        let dryIntro= /<!--<intro>(.*)<\/intro>-->/.exec(markdownContent);
        let dryPic= /<!--<img-url>(.*)<\/img-url>-->/.exec(markdownContent);
        let dryTag= /<!--<tag>(.*)<\/tag>-->/.exec(markdownContent);
        let dryDate= /<!--<date>(.*)<\/date>-->/.exec(markdownContent);
        postArrays.push({
            date: dryDate && dryDate[1] || '',
            tag: dryTag && dryTag[1] || '无标签',
            link:'./' + targetFileName + '.html',
            title: dryTitle && dryTitle[1] || targetFileName,
            intro: dryIntro && dryIntro[1] || '',
            pic: dryPic && dryPic[1] || './assets/bg.jpeg'
        });
     });
    // console.log(postArrays);
    writePostHtml(postArrays);
}
// posts.html
function writePostHtml(postsList) {
    let rawHtml = readFileAndParse('./src/index.html');
    let headDOM = fs.readFileSync('./src/components/TopNav/nav.html', 'utf-8');
    let headCSS = readCssFile('./src/components/TopNav/nav.css');
    let postsPageCSS = readCssFile('./src/components/Posts/posts.css');
    let postsPageJS = readCssFile('./src/components/Posts/posts.js');
    let headJS = fs.readFileSync('./src/components/TopNav/nav.js', 'utf-8');
    let postsDom = '';
    for (var i = 0;i<postsList.length;i++){
        postsDom += '<div class="post-item">' +
                        '<div class="post-pic"><img src="' + postsList[i].pic + '" height="200" alt="love"/></div>'+
                        '<div class="post-detail">' +
                            '<div class="post-category">'+postsList[i].tag+'</div><br/>'+
                            '<div class="post-title">' + 
                                '<a href="' + postsList[i].link +'">'+postsList[i].title +'</a>'+
                            '</div>'+
                            '<div class="post-content">' + postsList[i].intro + '</div>'+
                            ' <div class="post-date"> ' + postsList[i].date + ' </div>'+ 
                        '</div>'+
                    '</div>'
    }
    // 读取模板 ，把markdown内容注入
    let html = rawHtml
                .replace('<!-- content -->', blogTopBanner('文章列表') + postsDom)
                .replace('<!-- title -->', '文章列表')
                .replace('<!-- header DOM -->', headDOM)
                .replace('<!-- header CSS -->', '<style>' + headCSS + '</style>')
                .replace('<!-- postsPageCSS CSS -->', '<style>' + postsPageCSS + '</style>')
                .replace('<!-- header JS -->', '<script>' + headJS + '</script>')
                .replace('<!-- posts JS -->', '<script>' + postsPageJS + '</script>')
            ;
    fs.writeFileSync('./'+ outputFold +'/'  + 'posts.html', html, 'utf8');
    console.log('文章网页生成成功：'  + 'posts.html');
}
// 文章详情页把内容写入模板html
function writeHtml(fileName,content) {
    let rawHtml = readFileAndParse('./src/index.html');
    let headDOM = fs.readFileSync('./src/components/TopNav/nav.html', 'utf-8');
    let headCSS = readCssFile('./src/components/TopNav/nav.css');
    let headJS = fs.readFileSync('./src/components/TopNav/nav.js', 'utf-8');
    let dryTitle = /<!--<title>(.*)<\/title>-->/.exec(content);
    // 读取模板 ，把markdown内容注入
    let html = rawHtml
                .replace('<!-- content -->', blogTopBanner(dryTitle && dryTitle[1] ||fileName)+' <div class="markdown-body">' + content + '</div>')
                .replace('<!-- title -->', fileName)
                .replace('<!-- header DOM -->', headDOM)
                .replace('<!-- header CSS -->', '<style>' + headCSS + '</style>')
                .replace('<!-- header JS -->', '<script>' + headJS + '</script>')
            ;
    fs.writeFileSync('./'+ outputFold +'/' + fileName + '.html', html, 'utf8');
    console.log('文章网页生成成功：' + fileName + '.html');
}
// 首页
function writeHomepageHtml() {
    let rawHtml = readFileAndParse('./src/index.html');
    let homepageDOM = fs.readFileSync('./src/components/HomePage/homepage.html', 'utf-8');
    let homepageCSS = readCssFile('./src/components/HomePage/homepage.css');
    let homepageJS = fs.readFileSync('./src/components/HomePage/homepage.js', 'utf-8');
    let headDOM = fs.readFileSync('./src/components/TopNav/nav.html', 'utf-8');
    let headCSS = readCssFile('./src/components/TopNav/nav.css');
    let headJS = fs.readFileSync('./src/components/TopNav/nav.js', 'utf-8');
    // 读取模板 ，把markdown内容注入
    let html = rawHtml
                .replace('<!-- title -->', pageTitle)
                .replace('<!-- homepage DOM -->', homepageDOM)
                .replace('<!-- homepage CSS -->', '<style>' + homepageCSS + '</style>')
                .replace('<!-- homepage JS -->', '<script>' + homepageJS + '</script>')
                .replace('<!-- header DOM -->', headDOM)
                .replace('<!-- header CSS -->', '<style>' + headCSS + '</style>')
                .replace('<!-- header JS -->', '<script>' + headJS + '</script>')
            ;
    fs.writeFileSync('./'+ outputFold +'/' +'index.html', html, 'utf8');
    console.log('文章主页生成成功：' + 'index.html');
}

// 读取一个文件内容
function readFileAndParse(path){
    text = fs.readFileSync(path, 'utf-8')
    try {
        var result = marked(text).replace(/buildAssetPath/g,'./assets');
        return result;
    } catch (err) {
        console.error('解析文件出错：'+path);
    }
}
// css文件需要把静态相对链接（webapck用的） 换成dist的相对链接
function readCssFile(cssFilePath){
    let cssString = fs.readFileSync(cssFilePath, 'utf-8');
    return cssString.replace('../../assets','./assets');
}
// 字符转义
function unescapeHtml(html){
    return html.replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&#x3A;/g, ':')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
}

