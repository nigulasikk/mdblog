var fs = require('fs');
var marked = require('marked');
// 构建output目录
var outputFold = 'build';
var pageTitle = 'kaikai的主页';
init();
//入口函数
function init(){
    initDir();
    writeHomepageHtml();
    readFolder('./src/posts');
    copyFolder('./src/assets')
    readJsonInfoOfAllPosts('./src/posts');
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
        console.log(filename)
        fs.writeFileSync('./'+ outputFold +'/assets/' + filename ,  fs.readFileSync(filePath +'/'+filename ));
     });
}
// 读取一个文件夹下所有文件
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
// 取所有博文信息
function readJsonInfoOfAllPosts(filePath){
    var postArrays = [];
    var files = fs.readdirSync(filePath);
    files.forEach(function(filename){
        if(filename.indexOf('.md') === -1) return;
        // 无后缀文件名
        let targetFileName = filename.replace('.md','');
        let markdownContent = readFileAndParse(filePath + '/' + filename);
        postArrays.push({
            title: targetFileName,
            content: markdownContent
        });
     });
    writePostHtml(postArrays);
}
// posts.html
function writePostHtml(postsList) {
    let rawHtml = readFileAndParse('./src/index.html');
    let headDOM = fs.readFileSync('./src/TopNav/nav.html', 'utf-8');
    let headCSS = fs.readFileSync('./src/TopNav/nav.css', 'utf-8');
    let headJS = fs.readFileSync('./src/TopNav/nav.js', 'utf-8');
    let postsDom = '';
    for (var i = 0;i<postsList.length;i++){
        postsDom += '<div class="post-item">' +
                        '<div class="post-title">' + postsList[i].title + '</div>'+
                        // '<div class="post-content">' + postsList[i].content + '</div>'+
                    '</div>'
    }
    // 读取模板 ，把markdown内容注入
    let html = rawHtml
                .replace('<!-- content -->', postsDom)
                .replace('<!-- title -->', '文章列表')
                .replace('<!-- header DOM -->', headDOM)
                .replace('<!-- header CSS -->', '<style>' + headCSS + '</style>')
                .replace('<!-- header JS -->', '<script>' + headJS + '</script>')
            ;
    fs.writeFileSync('./'+ outputFold +'/'  + 'posts.html', html, 'utf8');
    console.log('文章网页生成成功：'  + 'posts.html');
}
// 文章详情页把内容写入模板html
function writeHtml(fileName,content) {
    let rawHtml = readFileAndParse('./src/index.html');
    let headDOM = fs.readFileSync('./src/TopNav/nav.html', 'utf-8');
    let headCSS = fs.readFileSync('./src/TopNav/nav.css', 'utf-8');
    let headJS = fs.readFileSync('./src/TopNav/nav.js', 'utf-8');
    // 读取模板 ，把markdown内容注入
    let html = rawHtml
                .replace('<!-- content -->', content)
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
    let homepageDOM = fs.readFileSync('./src/HomePage/homepage.html', 'utf-8');
    let homepageCSS = fs.readFileSync('./src/HomePage/homepage.css', 'utf-8');
    let homepageJS = fs.readFileSync('./src/HomePage/homepage.js', 'utf-8');
    let headDOM = fs.readFileSync('./src/TopNav/nav.html', 'utf-8');
    let headCSS = fs.readFileSync('./src/TopNav/nav.css', 'utf-8');
    let headJS = fs.readFileSync('./src/TopNav/nav.js', 'utf-8');
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
// 字符转义
function unescapeHtml(html){
    return html.replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&#x3A;/g, ':')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
}