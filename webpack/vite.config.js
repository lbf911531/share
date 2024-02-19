

/**
 * vite 追求开箱即用，对于vite的配置，比起webpack来说很少
 * [尤其是vue官方提供的`create vite`脚手架中基于vite创建的项目模板的config文件，也只有注册了vue插件]
 **/

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {

  // const env = loadEnv(mode,process.cwd(),'');
  // console.log(env, mode);

  return ({
    // "base": '/', // 等同于webpack的publicPath,基础url
    // "root": '/', // 根目录，假设index.html是放在src/下，这里则需要将root改成"/src"
    // "mode": 'development',
    "build": {
      // 打包时的相关配置
      // 用于指定编译后代码的目标环境，例如 ES 版本、浏览器环境、Node.js 环境等。
      // target，
      outDir: 'dist2', // 用于指定编译输出目录。
      // assetsDir: 'public', // 用于指定静态资源的目录。
      // minify: // 用于指定是否压缩代码。
      // sourcemap: // 用于指定是否生成 sourcemap。
      rollupOptions: {
        // 用于配置 Rollup 的选项。
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        input: {
          main: '/app.js'
        },
        output: {
          entryFileNames: 'bundle.js',
          chunkFileNames: '[name].chunks.js',
        }
      },
      assetsInlineLimit: 2000, // 2kb以内的图片资源转换成base64
    },
    "server": {
      // 开发时的相关配置
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'www.xxx.com',
          // 这里和webpack不太一样，是个方法
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    "plugins": [],
    "css": {

    },
  })
})
