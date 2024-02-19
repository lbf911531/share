

import a from './page/a.js';
import b from './page/b.js';
// import axios from 'axios';

// import './css/global.css';

function add() {
  console.log(a.age + b);
  // console.log(axios);
  // console.log('webpack: env:',TYPE);
  console.log('vite: import?.meta:',import.meta.env)
}

add();

// 批量导入某些文件
// const files = require.context('./common/',true,/entry.js$/);
// Object.keys(files).forEach(file => {
//   console.log(files(file).default)
// })