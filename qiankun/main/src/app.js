
import { useState } from "react";

// apps 数据可以做成调用后端接口获取，至于entry如果有后端配合，能改成 域名 + 模块名组成的新域名，
const apps = [{
  name: 'app1',
  entry: 'http://localhost:8001', // html entry
}];

// export 出的 qiankun 变量是一个 promise
export const qiankun = (() => (new Promise(resolve => {
  resolve({
    // 注册子应用信息
    apps,
    // prefetch: false,
    // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
    lifeCycles: {
      afterMount: (props) => {
        console.log(props);
      },
    },
  })
})))();
