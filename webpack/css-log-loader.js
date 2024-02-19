

/**
 * loader的本质类似下面的代码
 * 通过ast抽象语法树分析字符串，并按需求转换
 * @param {*} cssContent 
 * @returns 
 */
module.exports = function (cssContent) {
  cssContent = cssContent.replace('padding: 0', 'padding: 1px');
  return cssContent;
}