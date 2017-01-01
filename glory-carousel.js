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

    var root, gloryInner;
    var activeElmNo, items, isAnimate = 0;
    var PZ = options.sizeRate || 9 / 16, PU = options.expendRate || 7 / 8;//图片比例，展开和常规比例
    var gloryWidth, gloryHeight, ITEM_W, ITEM_H, EX_W, EX_H, INNER_DEFAULT_LEFT;
    var moveDuration = options.moveDuration|| 15, scaleDuration = options.scaleDuration|| 5;
    var movePerVal = options.movePerVal|| 30, scalePerVal = options.scalePerVal|| 6;
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
        initPostion(activeElmNo);
    }
    function addAnimation(){
        isAnimate++;
    }
    function rmAnimation(){
        isAnimate--;
    }
    this.next = function () {
        if (isAnimate==0) {
            var moveItem=0;
            if(activeElmNo==0){
                moveItem=items.length-2;
            }else if(activeElmNo==1){
                moveItem=items.length-1;
            }else{
                moveItem=activeElmNo-2;
            }
            items[moveItem].style.left=items[moveItem].offsetLeft+items.length*ITEM_W+"px";
            narrow(items[activeElmNo])
            moveToLeft();
            if (activeElmNo < items.length - 1) { activeElmNo++; }
            else { activeElmNo = 0; }
            expand(items[activeElmNo])
        }
    }

    this.previous = function () {
        if (isAnimate==0) {
            var moveItem=activeElmNo-3>=0?activeElmNo-3:activeElmNo-3+items.length;
            items[moveItem].style.left=items[moveItem].offsetLeft-items.length*ITEM_W+"px";
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
        var exW = (1 - PU) * ITEM_W;
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
        var exW = (1 - PU) * ITEM_W;
        console.log(exW);
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                elm.style.width = elm.offsetWidth + leftW + 'px';
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
        for(var i =0; i<items.length;i++){
            if(items.length-i<=2){
                items[i].style.left=INNER_DEFAULT_LEFT-(items.length-i)*ITEM_W+"px";
            }else{
                items[i].style.left=INNER_DEFAULT_LEFT+i*ITEM_W+"px";
            }
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
    expand(items[activeElmNo])
}