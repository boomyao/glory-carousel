# glory carousel
## 介绍
一款简单的带滑动动画效果的滚动图插件
## 怎么使用
1 引用文件

`<link rel="stylesheet" href="glory-carousel.css"/>`

`<script src="glory-carousel-min.js"></script>`

或者

`<script src="glory-carousel-bundle-min.js"></script>`

2 添加标签

`<div id="myGlory"></div>`

3 js调用
`var glory=new GloryCarousel(
    {
        name:"myGlory",
        images:[url1,url2,url3,url4,url5,...],
        autoScroll:true
    }
)`


## Options和Methods
### Options
| name         | type      | default         | required   |
| --------     | --------- |:----------:     | ----------:| 
| name         | string    | NaN             |  yes       |
| images       | Array     | NaN             |  yes       |
| singleShow   | boolean   | false           |  no        |
| autoScroll   | boolean   | false           | no         |
| scrollDuration|number    | 5000            | no         |
| sizeRate | number | 7/20  |  no|
| scaleRate | number|  10/13 | no|
|movePerVal | number | 30 | no |
|scalePerVal | number | 6 |no |

### Methods
| name|parameters| describe|
|------|-------|------|
|next|none|下一张|
|previous|none|上一张|
|resize| width : number , height : number|变化尺寸|

