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

    var _root, _gloryInner, _dotBox, _dots;
    var _activeElmNo, _items, _isAnimate = 0,_imc=0;
    var _gloryWidth, _gloryHeight, ITEM_W, ITEM_H, EX_W, EX_H, INNER_DEFAULT_LEFT;
    var PZ = options.sizeRate || 7 / 20, PU = options.expendRate || 10 / 13;//图片比例，展开和常规比例
    var _moveDuration = options.moveDuration || 12, _scaleDuration = options.scaleDuration || 12;
    var _movePerVal = options.movePerVal || 30, _scalePerVal = options.scalePerVal || 6;
    var _autoScroll=options.autoScroll||false,_scrollDuration=options.scrollDuration||5000;
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
        if (_isAnimate == 0) {
            var moveItem = 0;
            if (_activeElmNo == 0) {
                moveItem = _items.length - 2;
            } else if (_activeElmNo == 1) {
                moveItem = _items.length - 1;
            } else {
                moveItem = _activeElmNo - 2;
            }
            _items[moveItem].style.left = _items[moveItem].offsetLeft + _items.length * ITEM_W + "px";
            narrow(_items[_activeElmNo])
            moveToLeft();
            if (_activeElmNo < _items.length - 1) { _activeElmNo++; }
            else { _activeElmNo = 0; }
            reRenderDots();
            expand(_items[_activeElmNo])
        }
    }

    function previous() {
        if (_isAnimate == 0) {
            var moveItem = _activeElmNo - 3 >= 0 ? _activeElmNo - 3 : _activeElmNo - 3 + _items.length;
            _items[moveItem].style.left = _items[moveItem].offsetLeft - _items.length * ITEM_W + "px";
            narrow(_items[_activeElmNo])
            moveToRight();
            if (_activeElmNo > 0) { _activeElmNo--; }
            else { _activeElmNo = _items.length - 1; }
            reRenderDots();
            expand(_items[_activeElmNo])
        }
    }

    function moveToLeft() {
        addAnimation();
        _imc--;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < _movePerVal) {
                _gloryInner.style.left = _gloryInner.offsetLeft - (ITEM_W - hadDiff) + 'px';
            } else {
                _gloryInner.style.left = _gloryInner.offsetLeft - _movePerVal + 'px';
            }
            hadDiff += _movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
                //_gloryInner.style.left=_gloryInner.offsetLeft-_gloryInner.offsetLeft%ITEM_W+"px";
            }
        }, _moveDuration)
    }

    function moveToRight() {
        addAnimation();
        _imc++;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < _movePerVal) {
                _gloryInner.style.left = _gloryInner.offsetLeft + (ITEM_W - hadDiff) + 'px';
            } else {
                _gloryInner.style.left = _gloryInner.offsetLeft + _movePerVal + 'px';
            }
            hadDiff += _movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
            }
        }, _moveDuration)
    }

    //缩小动作
    function narrow(elm) {
        addAnimation();
        var perW = _scalePerVal;
        var exW = EX_W - ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                //elm.style.width = elm.offsetWidth - leftW + 'px';
                elm.style.width=ITEM_W+"px";
                elm.style.height = ITEM_H + 'px';
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
        }, _scaleDuration)
    }
    //放大动作
    function expand(elm) {
        addAnimation();
        elm.style.zIndex = 10;
        var perW = _scalePerVal;
        // var exW = (1 - PU) * ITEM_W;
        var exW=EX_W-ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                //elm.style.width = elm.offsetWidth + leftW + 'px';
                elm.style.width=EX_W+"px";
                elm.style.height = EX_H + 'px';
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
        }, _scaleDuration)
    }
    //计算item位置
    function initPostion(n) {
        _gloryInner.style.left = 0;
        _imc=0; 
        var orArr = [];
        for (var i = 0; i < _items.length; i++) {
            n = n - _items.length >= 0 ? n - _items.length : n;
            orArr[i] = n;
            n++;
        }
        for (var i = 0; i < _items.length; i++) {
            _items[orArr[i]].style.zIndex=0;
            if (_items.length - i <= 2) {
                _items[orArr[i]].style.left = INNER_DEFAULT_LEFT - (_items.length - i) * ITEM_W + "px";
            } else {
                _items[orArr[i]].style.left = INNER_DEFAULT_LEFT + i * ITEM_W + "px";
            }
        }
    }

    function initSize(width, height) {
        calcBaseSize(width, height);
        _root.style.width = _gloryWidth + 'px';
        _root.style.height = _gloryHeight + 'px';
        _gloryInner.style.height = _gloryHeight + 'px';
        for (var i = 0; i < _items.length; i++) {
            _items[i].style.width = ITEM_W + 'px';
            _items[i].style.height = ITEM_H + 'px';
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
        _root = document.getElementById(options.name);
        if (!_root) {
            throw "no exist called this name element,please create element called this name";
        }
        _root.className = "glorycarousel";
        _gloryInner = document.createElement("div");
        _gloryInner.className = "glory-inner";
        _root.appendChild(_gloryInner);
        calcBaseSize(options.width, options.height);
        _activeElmNo = 0;

        for (var i = 0; i < imgPaths.length; i++) {
            var gloryItem = document.createElement("div");
            gloryItem.className = "glory-item";
            gloryItem.style.backgroundColor = randomColor();
            _gloryInner.appendChild(gloryItem);
        }
        _items = document.getElementsByClassName('glory-item');
        for (var i = 0; i < _items.length; i++) {
            var img = document.createElement("img");
            img.style.width = img.style.height = "100%";
            img.src = imgPaths[i];
            _items[i].appendChild(img);
        }

        _dotBox = document.createElement("ul");
        _dotBox.className = "dot-box";
        _root.appendChild(_dotBox);
        for (var i = 0; i < _items.length; i++) {
            var dot = document.createElement('li');
            _dotBox.appendChild(dot);
        }

        _dots = _dotBox.querySelectorAll("li")
        for (var i = 0; i < _dots.length; i++) {
            var dotSpan = document.createElement("span");
            _dots[i].appendChild(dotSpan);
            (function (arg) {
                _dots[i].addEventListener("mouseenter", function () {
                    if (_activeElmNo != arg) {
                        if (arg - _activeElmNo == 1 || arg - _activeElmNo == -_items.length + 1) {
                            next();
                        } else if (arg - _activeElmNo == -1 || arg - _activeElmNo == _items.length - 1) {
                            previous();
                        } else {
                            _activeElmNo = arg;
                            reload();
                        }
                    }
                })
            })(i)
        }

        if(_autoScroll){
            var timer=setInterval(function(){next()},_scrollDuration)
        }
    }

    //以组件长宽计算基础尺寸数值
    function calcBaseSize(width, height) {
        if (options.singleShow) {
            _gloryWidth=width||300;
            _gloryHeight=height||105;
            EX_W=_gloryWidth;
            EX_H=_gloryHeight;
            ITEM_W=EX_W*PU;
            ITEM_H=EX_H*PU;
            INNER_DEFAULT_LEFT=(EX_W-ITEM_W)/2;
        } else {
            _gloryWidth = width || 400;
            _gloryHeight = height || 100;
            ITEM_W = _gloryHeight * PU / PZ;
            ITEM_H = _gloryHeight * PU;
            EX_W = ITEM_W / PU;
            EX_H = ITEM_H / PU;
            INNER_DEFAULT_LEFT = (_gloryWidth - ITEM_W) / 2;
        }

    }

    function addAnimation() {
        _isAnimate++;
    }
    function rmAnimation() {
        _isAnimate--;
        if(_isAnimate==0){
            _gloryInner.style.left=_imc*ITEM_W+"px"
        }
    }

    function reRenderDots() {
        for (var i = 0; i < _dots.length; i++) {
            if (i == _activeElmNo) {
                _dots[i].className = "active";
            } else {
                _dots[i].className = "";
            }
        }
    }

    function reload() {
        reRenderDots();
        initSize(options.width, options.height);
        initPostion(_activeElmNo);
        expand(_items[_activeElmNo])
    }

    initElements();
    reload();
}