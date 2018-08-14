**原因**：

​        1.xhtml里不兼容

​        2.在**页面加载完后执行**，会重绘整个页面（这点应该是最关键的）

​        3.它不能指定插入的位置

**三个例子让你更好的理解document.write**:

​        **1.特性一：在没调用document.open()的情况下直接调用document.write，会自动调用document.open()**

​         打开控制台一次执行以下代码

​        

```
  document.write(1) //结果为：1

          document.write(1)  //结果为：11

          document.close()  // 关闭文档流，强制进行渲染

          document.write(1) // 这边会自动执行document.open()，重新渲染整个页面，结果为1
```

​        **2.特性二：在onload里执行（一次文档流渲染完毕后），会替换掉整个文档流**

 

```
<!DOCTYPE html>

<html lang="en">

 

<head>

  <meta charset="UTF-8">

  <title>Document</title>

</head>

<body onload="newContent();">

  <h1>原来有的文字</h1>

   <script>

  function newContent() {

    document.open();

    document.write("<h1>新内容1</h1>");

    document.close();

     document.open();

    document.write("<h1>新内容2</h1>");

    document.close();

  }

  </script>

</body>

</html>


```

 结果为：新内容2

​        **3.特性三：若文档流是由浏览器创建，无权限手动关闭，document.close()函数只能够关闭由,document.open()函数创建的文档流**

```
 <!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <title>Document</title>  

</head>

<body>

  <h1>原来有的文字</h1>

  <script>

  function newContent() {

    document.open();

    document.write("<h1>新内容1</h1>");

    document.close();

    document.open();

    document.write("<h1>新内容2</h1>");

    document.close();

  }

  newContent();

  </script>

</body>

</html>


```

 结果为依次三行：原来有的文字，新内容1，新内容2

**特征四：用操作DOM的方式（insertAdjacentHTML）【网上许多人说的替换解决方案】和特征三中的document.write相比，后者性能会更优。**

insertAdjacentHTML类似的DOM操作是网上很多人说的解决方案，但网上的解决方案是相对于**特征二**的document.write相比的，的确它比**特征二**的document.write性能更优，因为它不用重绘整个页面。

insertAdjacentHTML和**特征三**中的document.write相比，优势是能控制插入的位置，但从性能上，它并不会更高，因为insertAdjacentHTML先要获取DOM元素，再通过DOM操作把内容写入，而**特征三**中的document.write是直接在渲染的时候写入文档流，这是理论上**特征三方式**的document.write会更优

接下来看代码

```
<!DOCTYPE html>

<html lang="en">

 

<head>

  <meta charset="UTF-8">

  <title>Document</title>

</head>

 

<body id="xixi">

  <h1>原来有的文字</h1>

  <script>

  function newContent() {

    document.open();

    document.write("<h1>新内容1</h1>");

    document.close();

    var time1 = new Date();

    document.open();

    document.write("<h1>新内容2</h1>");

    document.close();

    var time2 = new Date();

  console.log('document.write耗时:'+(time2 - time1))

  }

  newContent();

  var time3 = new Date();

  var d1 = document.getElementById('xixi');

  d1.insertAdjacentHTML('afterend', '<div id="two">insertAdjacentHTML</div>');

  var time4 = new Date();

  console.log('insertAdjacentHTML耗时:'+(time4 - time3))

  </script>

</body>

 

</html>
```

 运行结果：（

document.write耗时:0

insertAdjacentHTML耗时:1

【的确**特征三方式**的document.write会更优】

**总结：我们对document.write函数有些误会，并不是document.write这个函数有问题，而是认为它有问题的人使用它的方式不太对。**