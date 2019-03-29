
TODO:
[:ballot_box_with_check:] sourcemap 支持
[:soon:] 报错堆栈跳转，sourcemap支持
[:ballot_box_with_check:] async/await 支持
[:ballot_box_with_check:] sass 编译错误提示
[:ballot_box_with_check:] gulp-sass 编译错误后，就算修复错误也不会再次编译并且pipe数据到dist文件夹中，（暂时使用替代的方案）
[:ballot_box_with_check:] babel编译选项优化,根据小程序的运行时环境来配置babel
[:soon:] V2.2.0之后支持npm
[:ballot_box_with_check:] createpage
[:soon:] createpage 选择分包
[:soon:] precommit
[:soon:] precommit 中增量eslint
[:soon:] eslint

## pug
你可以使用pug作为wxml的模板引擎

## sass
你可以在项目中使用sass预处理器，工具会自动将其编译成wxss。在小程序中使用sass需要注意以下几点：
* 不支持sourcemap，微信开发者工具本身不支持css 的sourcemap
* sass自动忽略.wxss的引入
```css
@import "./lib.wxss";
@import "./lib.scss";
```
如上经过编译之后，
```css
/*
只有lib.scss的样式会被注入到进来
*/
```

**所以应该始终使用sass的文件格式**
* sass文件编译错误，会在控制台提示
![编译错误](./doc/images/sass-errpr.png)
**这里需要注意的是，由于工具采取的是增量编译，只会在改变或者增加的文件上执行编译，所以，如果你修正了某个错误，可能需要在当前文件上执行保存操作，尤其是引起错误的原因不在当前文件中**

## babel
工具对于js文件采用babel转译，对于小程序工程，我们应该关闭ES6转ES5的设置
```javascript
// project.config.json
"es6": false,
```

[微信小程序js代码的运行时环境](https://developers.weixin.qq.com/miniprogram/dev/framework/details.html)有：
iOS: javascriptCore
Android: 旧版本: X5 JSCore, 新版本： V8

在语法上的差异我们使用env preset 来转换，这里我们不指定env的target，因为实在是不清楚上面几个JSCore的具体差异。
不指定target,让其语法转换适用于尽可能多的内核。:herb:

env.modules我们不指定，为auto的情况下是采用commonjs的规范。

## async/await 支持
得益于babel，我们可以使用async/await。
babel 将async函数编译成[generator function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)，但是小程序的运行环境缺少
Generator Function (没有regeneratorRuntime)的支持，因此我们需要引入其[polyfill](https://github.com/facebook/regenerator)
```javascript
Page({
  onLoad(){
    this.show()
  },
  print(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Date now:', Date.now())
        resolve()
      }, 1000);
    })
  },
  async show(){
    for(let i = 0; i < 10; i++){
      await this.print()
    }
  }
})
```

## 内置类型的支持
小程序环境对于ES6内置类型已经采取了一定的[polyfill](https://developers.weixin.qq.com/miniprogram/dev/guide/runtime/js-support.html)。
像Promise,Map,Set,Symbol都是支持的。如果你想使用ES2016+的API,那么你可以自己加入相应的[babel-plugin](https://babeljs.io/docs/en/plugins)

## sourcemap
目前小程序开发者工具调试只支持行内sourcemap。
:smile:但是报错在开发者工具点击错误时堆栈跳转对应语句却是跳转到编译后的js文件中，这点还是可以优化的。

## createpage用法
```javascript
npm run create:page [pagename] [page path]
// 如果你想在src下面快速建立一个user页面，你可以执行下面的命令
npm run create:page user
// 在src/pages/people 下面建立user
npm run create:page user pages/people
```




