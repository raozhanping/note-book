# CSS

## 弹出框(modal) 抽屉式弹出
```scss
.modal {
    &.fade .modal-dialog {
        -webkit-transition: -webkit-transform .3s ease-out;
        -o-transition: -o-transform .3s ease-out;
        transition: transform .3s ease-out;
        -webkit-transform: translate(100%, 0);
        -ms-transform: translate(100%, 0);
        -o-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }

    &.in .modal-dialog {
        -webkit-transform: translate(0, 0);
        -ms-transform: translate(0, 0);
        -o-transform: translate(0, 0);
        transform: translate(0, 0);
    }
}
```

## CSS基础布局--BFC
> BFC,全称 Block Formatting Context，翻译成块级格式化上下文，它就是一个环境，HTML元素在这个环境中按照一定规则进行布局

### BFC的生成
1. 浮动元素、
2. 绝对定位元素，
3. 块级元素以及块级容器(比如inline-block、table-cell、table-capation)
4. overflow值不为visible的块级盒子
root元素会自动生成一个BFC

