function GloryCarousel(options) {
    var imgPaths = options.images;
    if (!options.name) {
        throw "require name to this glory";
    }
    if (!imgPaths) {
        throw "must provide parameter images";
    }
    if (imgPaths.length < 4) {
        throw "require more than 4 pictures";
    }

    var root, gloryInner;
    var activeElmNo, items, canAnimate = true;
    var PZ = options.sizeRate || 9 / 16, PU = options.expendRate || 7 / 8;//图片比例，展开和常规比例
    var gloryWidth, gloryHeight, ITEM_W, ITEM_H, EX_W, EX_H, INNER_DEFAULT_LEFT;

    ///public methods
    //计算尺寸
    this.initSize = function (width, height) {
        calcBaseSize(width, height);
        root.style.width = gloryWidth + 'px';
        root.style.height = gloryHeight + 'px';
        gloryInner.style.height = gloryHeight + 'px';
        for (var i = 0; i < items.length; i++) {
            items[i].style.width = ITEM_W + 'px';
            items[i].style.height = ITEM_H + 'px';
        }
        calcItemLeft(activeElmNo);
        items[activeElmNo].style.left = INNER_DEFAULT_LEFT + 'px';
        expand(items[activeElmNo]);
    }
    ////向右滚动
    // this.next = function () {
    //     if (canAnimate) {
    //         canAnimate = false;
    //         var hadDiff = 0;
    //         var perVal = 15;
    //         narrow(items[activeElmNo]);
    //         if (activeElmNo < items.length - 1) { activeElmNo++; }
    //         else { activeElmNo = 0; }
    //         expand(items[activeElmNo]);
    //         var timer = setInterval(function () {
    //             gloryInner.style.left = gloryInner.offsetLeft - perVal + 'px';
    //             hadDiff += perVal;
    //             if (hadDiff >= ITEM_W) {
    //                 clearInterval(timer);
    //                 calcItemLeft(activeElmNo);
    //                 gloryInner.style.left = 0;
    //                 canAnimate = true;
    //             }
    //         }, 20)
    //     }
    // }
    // //向左滚动
    // this.previous = function () {
    //     if (canAnimate) {
    //         canAnimate = false;
    //         var hadDiff = 0;
    //         var perVal = 15;
    //         narrow(items[activeElmNo]);
    //         if (activeElmNo > 0) { activeElmNo--; }
    //         else { activeElmNo = items.length - 1; }
    //         expand(items[activeElmNo]);
    //         var timer = setInterval(function () {
    //             gloryInner.style.left = gloryInner.offsetLeft + perVal + 'px';
    //             hadDiff += perVal;
    //             if (hadDiff >= ITEM_W) {
    //                 clearInterval(timer);
    //                 calcItemLeft(activeElmNo);
    //                 gloryInner.style.left = 0;
    //                 canAnimate = true;
    //             }
    //         }, 20)
    //     }
    // }

    this.next = function () {
        if (canAnimate) {
            canAnimate = false;
            narrow(items[activeElmNo])
            moveToLeft();
            if (activeElmNo < items.length - 1) { activeElmNo++; }
            else { activeElmNo = 0; }
            expand(items[activeElmNo])
        }
    }

    this.previous=function(){
        if (canAnimate) {
            canAnimate = false;
            narrow(items[activeElmNo])
            moveToRight();
            if (activeElmNo > 0) { activeElmNo--; }
            else { activeElmNo = items.length - 1; }
            expand(items[activeElmNo])
        }
    }

    ///private method
    //生成html对象
    function initElements() {
        root = document.getElementById(options.name);
        if (!root) {
            throw "no exist called this name element,please create element called this name";
        }
        gloryInner = document.createElement("div");
        gloryInner.className = "glory-inner";
        root.appendChild(gloryInner);
        calcBaseSize(options.width, options.height);
        activeElmNo = 0;
        for (var i = 0; i < imgPaths.length; i++) {
            var gloryItem = document.createElement("div");
            gloryItem.className = "glory-item";
            gloryInner.appendChild(gloryItem);
        }
        items = document.getElementsByClassName('glory-item');
        for (var i = 0; i < items.length; i++) {
            var img = document.createElement("img");
            img.style.width = img.style.height = "100%";
            img.src = imgPaths[i];
            items[i].appendChild(img);
        }

    }

    function moveToLeft() {
        var hadDiff = 0;
        var perVal = 30;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < perVal) {
                gloryInner.style.left = gloryInner.offsetLeft - (ITEM_W - hadDiff) + 'px';
            } else {
                gloryInner.style.left = gloryInner.offsetLeft - perVal + 'px';
            }
            hadDiff += perVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                calcItemLeft(activeElmNo);
                gloryInner.style.left = 0;
            }
        }, 15)
    }

    function moveToRight() {
        var hadDiff = 0;
        var perVal = 30;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < perVal) {
                gloryInner.style.left = gloryInner.offsetLeft + (ITEM_W - hadDiff) + 'px';
            } else {
                gloryInner.style.left = gloryInner.offsetLeft + perVal + 'px';
            }
            hadDiff += perVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                calcItemLeft(activeElmNo);
                gloryInner.style.left = 0;
            }
        }, 15)
    }

    //缩小动作
    function narrow(elm, callback) {
        var perW = 6;
        var perH = perW * PZ;
        var exW = (1 - PU) * ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            hadDiff += perW;
            elm.style.width = elm.offsetWidth - perW + 'px';
            elm.style.height = elm.offsetHeight - perH + 'px';
            elm.style.left = elm.offsetLeft + 0.5 * perW + 'px';
            if (hadDiff >= exW) {
                clearInterval(timer);
                elm.style.zIndex = 0;
            }
        }, 5)
    }
    //放大动作
    function expand(elm) {
        elm.style.zIndex = 10;
        var perW = 6;
        var perH = perW * PZ;
        var exW = (1 - PU) * ITEM_W;
        //var diff = 30;
        var hadDiff = 0;
        var timer = setInterval(function () {
            hadDiff += perW;
            elm.style.width = elm.offsetWidth + perW + 'px';
            elm.style.height = elm.offsetHeight + perH + 'px';
            elm.style.left = elm.offsetLeft - 0.5 * perW + 'px';
            if (hadDiff >= exW) {
                clearInterval(timer);
                canAnimate = true;
            }
        }, 5)
    }
    //计算item位置
    function calcItemLeft(n) {
        for (var i = 0; i < items.length; i++) {
            var x = Math.abs(n - i) < 3 ? n - i : n - i > 0 ? Math.abs(n - i) - items.length : Math.abs(Math.abs(n - i) - items.length);
            items[i].style.left = (INNER_DEFAULT_LEFT - x * ITEM_W) + 'px';
        }
        items[n].style.left = INNER_DEFAULT_LEFT - (EX_W - ITEM_W) / 2 + 'px';
    }

    function randomColor() {
        var r = Math.round(Math.random() * 255).toString(16);
        var g = Math.round(Math.random() * 255).toString(16);
        var b = Math.round(Math.random() * 255).toString(16);
        r = r.length == 2 ? r : '0' + r;
        g = g.length == 2 ? g : '0' + g;
        b = b.length == 2 ? b : '0' + b;
        var rgb = '#' + r + g + b;
        return rgb;
    }
    //把css内容用js完成
    function initStyles() {
        root.style.position = "relative";
        root.style.overflow = "hidden";
        gloryInner.style.position = "relative";
        gloryInner.style.fontSize = 0;
        for (var i = 0; i < items.length; i++) {
            items[i].style.backgroundColor = randomColor();
            items[i].style.position = "absolute";
            items[i].style.bottom = 0;
            items[i].style.display = "inline-block";
        }
    }
    //以组件长宽计算基础尺寸数值
    function calcBaseSize(width, height) {
        gloryWidth = width || 400;
        gloryHeight = height || 100;
        ITEM_W = gloryHeight * PU / PZ;
        ITEM_H = gloryHeight * PU;
        EX_W = ITEM_W / PU;
        EX_H = ITEM_H / PU;
        INNER_DEFAULT_LEFT = (gloryWidth - ITEM_W) / 2;
    }

    initElements();
    initStyles();
    this.initSize(options.width, options.height);
}