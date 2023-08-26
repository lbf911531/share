

# qiankun 学习第二天

> 先简单了解一下qiankun的实现流程

## 1.路由监听

路由的监听方式有两种：hash路由的监听和history的监听

### 1.1 hash路由监听
```javascript
window.addEventListener('hashchange',() => {});
```

### 1.2 history监听

```javascript

function onRouterChange() {}

// popstate只能监听history.go,history.forward,history.back
window.addEventListener('popstate',onRouterChange)；

// 因此如果想要监听所有情况就需要改造一下，

const pushState = window.history.pushState
window.history.pushState = function (...args) {
  pushState.apply(window.history, args);
  console.log('监听路由push');
  onRouterChange();
}

const replaceState = window.history.replaceState
window.history.replaceState = function (...args) {
  replaceState.apply(window.history, args);
  console.log('监听路由replace')
  onRouterChange();
}

```

## 2.qiankun的实现原理

1. 注册子应用
2. 监听路由变动
3. 根据路由匹配子应用
  - 获取当前路由
  - 与1中注册的apps中匹配
4. 加载子应用
  - const html = await fetch(app.entry);
  - document.querySelector(app.container).innerHTML = html;
5. 渲染子应用
  - 直到第四步，只能看到html结构但没有渲染内容，是因为出于安全考虑,innerHTML中的script不会加载执行
  - 找到script标签，手动执行（eval/new Function）
  - 由于子项目umd格式打包，所以 onRouterChange 中在执行了script内容后，可以通过创建module.exports来获取到内部暴漏的bootstarp,mount,unmount生命周期（获取生命周期这部分具体实现是qiankun调用了import-entry-html依赖实现的）
  - 最后执行生命周期，完成子应用的渲染
