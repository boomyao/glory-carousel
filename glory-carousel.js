function GloryCarousel(options) {
    var imgPaths = options.images;
    if (!options.name) {
        throw "require name to this glory";
    }
    if (!imgPaths) {
        throw "must provide parameter images";
    }
    if (imgPaths.length < 5) {
        throw "require more than 4 pictures";
    }

    var root, gloryInner, dotBox, dots;
    var activeElmNo, items, isAnimate = 0;
    var gloryWidth, gloryHeight, ITEM_W, ITEM_H, EX_W, EX_H, INNER_DEFAULT_LEFT;
    var PZ = options.sizeRate || 7 / 20, PU = options.expendRate || 10 / 13;//图片比例，展开和常规比例
    var moveDuration = options.moveDuration || 15, scaleDuration = options.scaleDuration || 5;
    var movePerVal = options.movePerVal || 30, scalePerVal = options.scalePerVal || 6;
    var autoScroll=options.autoScroll||false,scrollDuration=options.scrollDuration||3000;
    ///public methods
    //计算尺寸
    this.initSize = function (width, height) {
        initSize(width, height);
    }
    this.next = function () {
        next();
    }
    this.previous = function () {
        previous();
    }

    function next() {
        if (isAnimate == 0) {
            var moveItem = 0;
            if (activeElmNo == 0) {
                moveItem = items.length - 2;
            } else if (activeElmNo == 1) {
                moveItem = items.length - 1;
            } else {
                moveItem = activeElmNo - 2;
            }
            items[moveItem].style.left = items[moveItem].offsetLeft + items.length * ITEM_W + "px";
            narrow(items[activeElmNo])
            moveToLeft();
            if (activeElmNo < items.length - 1) { activeElmNo++; }
            else { activeElmNo = 0; }
            reRenderDots();
            expand(items[activeElmNo])
        }
    }

    function previous() {
        if (isAnimate == 0) {
            var moveItem = activeElmNo - 3 >= 0 ? activeElmNo - 3 : activeElmNo - 3 + items.length;
            items[moveItem].style.left = items[moveItem].offsetLeft - items.length * ITEM_W + "px";
            narrow(items[activeElmNo])
            moveToRight();
            if (activeElmNo > 0) { activeElmNo--; }
            else { activeElmNo = items.length - 1; }
            reRenderDots();
            expand(items[activeElmNo])
        }
    }

    function moveToLeft() {
        addAnimation();
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < movePerVal) {
                gloryInner.style.left = gloryInner.offsetLeft - (ITEM_W - hadDiff) + 'px';
            } else {
                gloryInner.style.left = gloryInner.offsetLeft - movePerVal + 'px';
            }
            hadDiff += movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
            }
        }, moveDuration)
    }

    function moveToRight() {
        addAnimation();
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < movePerVal) {
                gloryInner.style.left = gloryInner.offsetLeft + (ITEM_W - hadDiff) + 'px';
            } else {
                gloryInner.style.left = gloryInner.offsetLeft + movePerVal + 'px';
            }
            hadDiff += movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
            }
        }, moveDuration)
    }

    //缩小动作
    function narrow(elm) {
        addAnimation();
        var perW = scalePerVal;
        var exW = EX_W - ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                elm.style.width = elm.offsetWidth - leftW + 'px';
                elm.style.height = elm.offsetHeight - leftW * PZ + 'px';
                elm.style.left = elm.offsetLeft + 0.5 * leftW + 'px';
            } else {
                elm.style.width = elm.offsetWidth - perW + 'px';
                elm.style.height = elm.offsetHeight - perW * PZ + 'px';
                elm.style.left = elm.offsetLeft + 0.5 * perW + 'px';
            }
            hadDiff += perW;
            if (hadDiff >= exW) {
                clearInterval(timer);
                elm.style.zIndex = 0;
                rmAnimation()
            }
        }, scaleDuration)
    }
    //放大动作
    function expand(elm) {
        addAnimation();
        elm.style.zIndex = 10;
        var perW = scalePerVal;
        // var exW = (1 - PU) * ITEM_W;
        var exW=EX_W-ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                elm.style.width = elm.offsetWidth + leftW + 'px';
                // elm.style.width=EX_W+"px";
                elm.style.height = elm.offsetHeight + leftW * PZ + 'px';
                elm.style.left = elm.offsetLeft - 0.5 * leftW + 'px';
            } else {
                elm.style.width = elm.offsetWidth + perW + 'px';
                elm.style.height = elm.offsetHeight + perW * PZ + 'px';
                elm.style.left = elm.offsetLeft - 0.5 * perW + 'px';
            }
            hadDiff += perW;
            if (hadDiff >= exW) {
                clearInterval(timer);
                rmAnimation();
            }
        }, scaleDuration)
    }
    //计算item位置
    function initPostion(n) {
        gloryInner.style.left = 0;
        var orArr = [];
        for (var i = 0; i < items.length; i++) {
            n = n - items.length >= 0 ? n - items.length : n;
            orArr[i] = n;
            n++;
        }
        for (var i = 0; i < items.length; i++) {
            items[orArr[i]].style.zIndex=0;
            if (items.length - i <= 2) {
                items[orArr[i]].style.left = INNER_DEFAULT_LEFT - (items.length - i) * ITEM_W + "px";
            } else {
                items[orArr[i]].style.left = INNER_DEFAULT_LEFT + i * ITEM_W + "px";
            }
        }
    }

    function initSize(width, height) {
        calcBaseSize(width, height);
        root.style.width = gloryWidth + 'px';
        root.style.height = gloryHeight + 'px';
        gloryInner.style.height = gloryHeight + 'px';
        for (var i = 0; i < items.length; i++) {
            items[i].style.width = ITEM_W + 'px';
            items[i].style.height = ITEM_H + 'px';
        }
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

    ///private method
    //生成html对象
    function initElements() {
        root = document.getElementById(options.name);
        if (!root) {
            throw "no exist called this name element,please create element called this name";
        }
        root.className = "glorycarousel";
        gloryInner = document.createElement("div");
        gloryInner.className = "glory-inner";
        root.appendChild(gloryInner);
        calcBaseSize(options.width, options.height);
        activeElmNo = 0;

        for (var i = 0; i < imgPaths.length; i++) {
            var gloryItem = document.createElement("div");
            gloryItem.className = "glory-item";
            gloryItem.style.backgroundColor = randomColor();
            gloryInner.appendChild(gloryItem);
        }
        items = document.getElementsByClassName('glory-item');
        for (var i = 0; i < items.length; i++) {
            var img = document.createElement("img");
            img.style.width = img.style.height = "100%";
            img.src = imgPaths[i];
            items[i].appendChild(img);
        }

        dotBox = document.createElement("ul");
        dotBox.className = "dot-box";
        root.appendChild(dotBox);
        for (var i = 0; i < items.length; i++) {
            var dot = document.createElement('li');
            dotBox.appendChild(dot);
        }

        dots = dotBox.querySelectorAll("li")
        for (var i = 0; i < dots.length; i++) {
            var dotSpan = document.createElement("span");
            dots[i].appendChild(dotSpan);
            (function (arg) {
                dots[i].addEventListener("mouseenter", function () {
                    if (activeElmNo != arg) {
                        if (arg - activeElmNo == 1 || arg - activeElmNo == -items.length + 1) {
                            next();
                        } else if (arg - activeElmNo == -1 || arg - activeElmNo == items.length - 1) {
                            previous();
                        } else {
                            activeElmNo = arg;
                            reload();
                        }
                    }
                })
            })(i)
        }

        if(autoScroll){
            setInterval(function(){next()},scrollDuration)
        }
    }

    //以组件长宽计算基础尺寸数值
    function calcBaseSize(width, height) {
        if (options.singleShow) {
            gloryWidth=width||300;
            gloryHeight=height||105;
            EX_W=gloryWidth;
            EX_H=gloryHeight;
            ITEM_W=EX_W*PU;
            ITEM_H=EX_H*PU;
            INNER_DEFAULT_LEFT=(EX_W-ITEM_W)/2;
        } else {
            gloryWidth = width || 400;
            gloryHeight = height || 100;
            ITEM_W = gloryHeight * PU / PZ;
            ITEM_H = gloryHeight * PU;
            EX_W = ITEM_W / PU;
            EX_H = ITEM_H / PU;
            INNER_DEFAULT_LEFT = (gloryWidth - ITEM_W) / 2;
        }

    }

    function addAnimation() {
        isAnimate++;
    }
    function rmAnimation() {
        isAnimate--;
        if(isAnimate==0){
            //initPostion(activeElmNo);
        }
    }

    function reRenderDots() {
        for (var i = 0; i < dots.length; i++) {
            if (i == activeElmNo) {
                dots[i].className = "active";
            } else {
                dots[i].className = "";
            }
        }
    }

    function reload() {
        reRenderDots();
        initSize(options.width, options.height);
        initPostion(activeElmNo);
        expand(items[activeElmNo])
    }

    initElements();
    reload();
}