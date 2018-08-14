思路：当然，首先想到的一定是 animation-play-state 这个属性有paused和running 两个值，那么利用这个东西，应该就能实现功能。

- 首先编写keyframe动画，这里不祥谈
- 初始化目标DOM animation-play-state 为paused
- 点击按钮把目标DOM animation-play-state 变为running===》然后很开心的看到动画跑起来了===》可是它仅仅只能跑一次，再按按钮也没有反应

**找原因：**

1. **这时候注意到** animation-iteration-count**这个属性，规定的是动画播放次数，默认为1。所以动画只能播放一次，而且这次动画播放完毕后，它的**animation-play-state **并不会变为paused,还是running。**

**所以我这边解决这个问题的思路是**

1. **animation-iteration-count这个属性就不能用默认值1，因为动画要重复播放，值用 infinite （无限循环）**
2. **根据animation动画的时间，设置定时器，即一次动画播放完毕，则在定时器内执行动画animation-play-state 变为paused 。**
3. **为了防止在播放过程中按钮多次点击，定时器被多次执行==》 每次点击按钮后就把按钮隐藏，动画播放完毕后再把按钮显示**

```
$('.how-drap-btn').click(function(){
   var self = this;
   // 按钮隐藏,防止重复触发延时定时器
   $(this).hide();
   $('.petal').css('-webkit-animation-play-state','running')
   $('.petal').css('animation-play-state','running')
   setTimeout(function(){
      $('.petal').css('-webkit-animation-play-state','paused')
      $('.petal').css('animation-play-state','paused')
      $(self).show();
   },10000);
});
```