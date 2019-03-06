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