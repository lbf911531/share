
/**
 * 自定义可拖拽元素
 */
import React from 'react';

/**
 *
 * @param {*} label 子元素
 * @param {object} node  需要插入的元素(包含了用于辅助格式化的相关参数)
 * @param {string} type 用于不同的可拖放区域处理不同的拖拽结果
 * @returns
 */
export default function DraggableItem(props) {

  const {
    title,
    node,
    type,
    onClick,
  } = props;

  /**
   * 监听拖拽开始的回调，设置数据
   * @param {*} event
   */
  function dragStart(event) {
    const data = { ...node, children: undefined, valueType: type };
    // 用extra传值，用text设定允许拖拽放置，不能给空，否则不能放置，data数据放在text中
    // 会被wangEditor识别到自动插入到编辑区
    event.dataTransfer.setData('Text', ' ');
    event.dataTransfer.setData('extra', JSON.stringify(data));

    // 将 拖拽时的 显示图片 固定在 光标右下方
    // const img = document.getElementById('scroll-tip-img');
    // img.alt = (typeof title === 'string' ? title : data[labelKey]) || '';
    // console.log(img.alt,'image alt');
    // event.dataTransfer.setDragImage(img, -30, -20);
  };

  return (
    <span
      draggable
      onDragStart={dragStart}
      onClick={onClick}
    >
      {title}
    </span>
  )
}
