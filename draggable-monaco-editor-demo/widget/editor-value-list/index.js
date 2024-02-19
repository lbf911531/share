
/**
 * 可拖拽项
 */
import React from "react";
import { Tooltip } from 'antd';
import EditorNode from '../draggable-node';

export default function EditorValueList(props) {

  const {
    options,
    type,
    labelKey,
    renderTitle,
    onNodeClick,
  } = props;


  /**
   * 渲染title
   * @param {*} option
   * @returns
   */
  function renderNodeTitle(option) {
    if (renderTitle) {
      return renderTitle(option, type);
    }
    return option[labelKey];
  };

  function renderOptions(option, index) {
    const key = `ed-vl-${index}`;
    const title = renderNodeTitle(option);
    return (
      <Tooltip
        title={title}
        key={key}
      >
        <div
          onClick={() => { onNodeClick(option) }}
          className='draggable-node'
          key={key}
        >
          <EditorNode
            key={key}
            type={type}
            title={title}
            node={option}
            labelKey={labelKey}
          />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="cs-dg-editor-vl-wrap">
      {Array.isArray(options) && options.map(renderOptions)}
    </div>
  )
}
