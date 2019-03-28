[-] sourcemap 作用
[-] async/await 支持
[✔] sass 编译错误提示
[✔] gulp-sass 编译错误后，就算修复错误也不会再次编译并且pipe数据到dist文件夹中，（暂时使用替代的方案）
[-] babel编译选项优化，支持npm
[-] createpage
[-] createpage 选择分包

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




