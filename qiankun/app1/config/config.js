
import { defineConfig } from 'umi';
// 路由
import routes from './router.config';
import packages from '../package.json';

// const apps = [{
//   name: 'app1',
//   entry: '//localhost:8001', // html entry
// }];

const config = {
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  define: {
    NAME: packages.name,
  },
  qiankun: {
    master: {}
  },
  proxy: {

    '/api': {
      target: "https://www.baidu.com",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  }
  // qiankun: {
  //   master: {
  //     apps: apps,
  //   }
  // }
}

if (packages.name !== 'main') {
  config.qiankun = {
    slave: {}
  };
}


export default defineConfig(config);
