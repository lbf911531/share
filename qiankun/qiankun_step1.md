

# qiankun 学习第一天

## 0.目标

1. 搭建基座 + App1 + App2 + ...
2. 引入Antd美化样式
3. 简单的分别使用MicroApp和路由式两种渲染，并实现父子通信
4. 支持跨模块调用组件

### 1.为什么不用iframe

摘自[qiankun](https://www.yuque.com/kuitos/gky7yw/gesexv)：

1. url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
2. UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..（无法解决）
3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。（难解决）
4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

### 2.学习使用umi/qiankun插件来搭建微前端项目

### 2.1 初始化基座项目

```bash
// 使用脚手架命令初始化一个项目
$ yarn create @umijs/umi-app

$ yarn install

// 启动后，就能访问本地，看到一个很简陋的页面
$ yarn start
```

### 2.2 修改基座routers

此时代码目录结构如[start](https://v3.umijs.org/zh-CN/docs/getting-started)描述的一样，只有pages/index.js

那么编译时是怎么知道入口是它的？

答：'.umirc.ts' 中的routers；（此外，.umirc.ts 等效 config/config.ts【这是umi自己约定好的】）

因此，为了拓展方便，这里将 'umirc.ts' 改造成 config文件夹，同时将router变量抽离出单独的文件，将入口由`src/pages/index`改为`src/index`

### 2.3 引入antd

```bash
$ yarn add antd @ant-design/pro-layout
```

### 2.4 引入umi/qiankun

```bash
$ yarn add @umijs/plugin-qiankun -D

```
此时 "umi": "^3.5.41",  "@umijs/plugin-qiankun": "^2.43.3",

### 2.5 qiankun配置

qiankun 主项目配置 
- 注册子项目有两种方式： 静态和动态；
- 装载子项目也有两种： 路由绑定和使用MicroApp

以上任意搭配

#### 2.5.1 静态 + 路由绑定
```javascript

// config.js

// 主：
{
  ...
  qiankun: {
    master: {
      // 注意：有几个子项目部署或者本地编译好了，这里就设置几个，假如本地只起了app1,而没有app2，这里不能配置app2的
      apps: [
        {
          name: 'app1',
          entry: '//localhost:8001',
        }
      ],
    }
  }
}
// 子：
{
  qiankun = {
    slave: {}
  };
}

--------------------------------

// router.js
// 主：
export default [
  {
    path: '/',
    component: '../index',
    routes: [
      {
        path: '/main/page1',
        component: '../pages/page1',
      },
      {
        path: '/main/page2',
        component: '../pages/page2',
      },
      {
        path: '/app1',
        microApp: 'app1',
      },
    ]
  }
]

// 子：
export default [
  {
    path: '/',
    component: '../index',
    routes: [
      {
        path: '/page1',
        component: '../pages/page1',
      },
      {
        path: '/page2',
        component: '../pages/page2',
      },
      {
        path: '/page3',
        component: '../pages/page1',
      },
    ]
  }
]

```
!!! 注意： 本例子用的是旧版本，如果是[新版本](https://umijs.org/docs/max/micro-frontend#%E6%8F%92%E4%BB%B6%E6%B3%A8%E5%86%8C%E5%AD%90%E5%BA%94%E7%94%A8)的话， 主项目注册子项目路由的时候写成
```javascript
 {
    path: '/app1/*',
    microApp: 'app1',
  },
```
- 如果在umi3.x版本这样写了，子项目的页面是匹配不到的；
- 另外，尽管url上会拼接上模块名“app1”，但不意味着子项目的路由文件就要加上这个，仍旧是像正常项目开发一样，维护自己的路由

#### 2.5.1 动态 + MicroApp

个人推荐这种，假如有场景 apps数据来自后端接口，就需要动态注入；而MicroApp更方便父子项目通信，传递props

1. 与上对比，首先是config的变动，改到src/app.js文件中 （约定是src/app[.js|.ts|.tsx]）;
```javascript
// export 出的 qiankun 变量是一个 promise 或者对象
export const qiankun = (() => (new Promise(resolve => {
  resolve({
    // 注册子应用信息
    apps,
    prefetch: false,
    lifeCycles: {
      afterMount: (props) => {
        console.log(props);
      },
    },
    routes: apps.map(app => ({
      path: `/${app.name}`,
      microApp: app.name,
    }))
  })
})))()
  
```

> 但是要注意： config文件中仍然要保留 qiankun: { master: {} }；否则也会出现，无法加载子项目的情况

2. MicroApp，渲染子项目

// 主项目的GlobalContent文件
```javascript
import { useLocation } from 'umi';

function GlobalContent() {
  const { pathname } = useLocation();
  const [moduleName] = pathname.split('/');

  if (
    apps.map(app => app.name).filter(app => app !== 'main').includes(moduleName) && NAME === 'main'
  ) {
    return (
      <div className="global-content">
        <MicroApp name={moduleName} autoSetLoading />
      </div>
    )
  }
  return (<div>{children}</div>)
}

```

主项目只有在线上环境或者需要本地主、子项目联调的时候，才用MicroApp，否则都正常走 children

### 2.6 父子组件通信

```javascript

// 主：
function GlobalContent() {
  return (
    <MicroApp masterProp='props' />
  )
}

// src/app.ts
export function useQiankunStateForSlave() {
  const [masterState, setMasterState] = useState({});

  return {
    masterState,
    setMasterState,
  };
}



// 子:
import { useModel } from 'umi';
function GlobalContent() {
  const masterProps = useModel('@@qiankunStateFromMaster');

  const { masterProp } = masterProps;

  return (
    <div>
      ...
    </div>
  )
}

```

### 2.7 跨模块调用组件

比如想在主模块中调用app1模块中的一个按钮组件

- 主模块
``` typescript
// src/components/MicroAppComponent.tsx

// 封装一个组件，供当前项目中需要使用其他模块组件的地方使用
export default function MicroAppComponent({
  name,
  componentName,
  params
}: MicroAppComponentProp) {

  return (
    <MicroAppWithMemoHistory
      name={name}  // 所属模块
      url={`/${name}`}
      type='component'
      params={params} // 需要使用的组件的参数
      componentName={componentName} // 需要使用的组件名
    />
  )
}

// src/page1
export default function MainPage1() {
  return (
    <div>
      <h1 className={styles.title}>
        主项目page1
      </h1>
      // 像正常使用组件一样，调用组件即可，真正渲染按钮的地方在子项目中，componentName告知子项目要渲染的是哪个组件
      <MicroAppComponent 
        name='app1'
        componentName='btn'
        params={{
          text: 'app1项目的btn'
        }}
      />
    </div>
  )
}

```

- 子模块

1. 在src/components/microAppComponentList文件中注册需要导出给其他模块使用的组件
```javascript
import Btn from 'scr/pages/btn';

export default { 
  'btn': Btn, // 这里的键就是componentName 
}
```
2. 在GlobalContent文件中
```javascript
// 借助父子模块通信，判断当前需要渲染组件，且组件在导出清单中是存在的，
const masterProps = useModel('@@qiankunStateFromMaster');
if (masterProps.type === 'component' && microAppComponentList[masterProps.componentName]) {
  // 如果约定的type是component表示是要渲染组件，
  return (
    React.createElement(
      microAppComponentList[masterProps.componentName], 
      masterProps.params
    )
  )
} else if {
  return <MicroApp />
} else {
  return children
}
```   

这样一来，既实现了跨模块调用组件，又能支持抽离，以后如果app1有其他组件需要导出，只需要在microAppComponentList 文件中注册即可。


### 3.小结

- 不论是主子项目，其本质都是渲染的src/index文件，只是根据路由的不同，将对应的pages中存放的页面组件插入GlobalContent中渲染；简单来说，就是：路由变动，src/index会重新执行