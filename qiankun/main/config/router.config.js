

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
      // {
      //   path: '/app1',
      //   microApp: 'app1',
      // },
      /**
       * qiankun是需要这样注入子项目的依赖的， 
       * 需要尝试 
       *  1. 主项目遍历apps数组，手动注入routes, 子项目的router就只有上面这一段
       *  2. 如果是调用microApp组件，那么是否是可以不需要维护这个呢？只要想办法给microApp传递当前路由应属app值即可
       * 
       */
    ]
  }
]