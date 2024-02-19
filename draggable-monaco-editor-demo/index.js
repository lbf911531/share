
/**
 * 可拖拽插入的公式组件
 */
import React, { useEffect, useState, useRef } from "react";
import httpFetch from 'share/httpFetch';
import EditorValueList from './widget/editor-value-list';
import EditorContent from './widget/editor-content';

import './style.less';

export default function DraggableEditor(props) {

  const {
    height = 420,
    valueKey = 'code',
    value,
    keywords,
    expressions,
    autoCompletion = true,
    rules,
    ltConfig,
    rtConfig,
    onChange,
    getValue,
  } = props;

  const [leftSubtree, setLeftSubtree] = useState([]);
  const [rightSubtree, setRightSubtree] = useState([]);
  const editorRef = useRef();

  // 左侧列表相关配置，如获取数据的url,options...
  const {
    subtreeTitle: ltSubtreeTitle,
    labelKey: ltLabelKey = 'name',
  } = ltConfig || {};

  const {
    subtreeTitle: rtSubtreeTitle,
    labelKey: rtLabelKey = 'name',
  } = rtConfig || {};

  const [doRefresh, setDoRefresh] = useState(0);

  const [editorProps, setEditorProps] = useState({
    keywords: {},
    expressions: [],
  });

  useEffect(() => {
    initState();
  }, []);

  async function initState() {
    const [{ data: ltData }, { data: rtData }] = await Promise.all([
      getSubtreeList(ltConfig),
      getSubtreeList(rtConfig),
    ]);

    setLeftSubtree(ltData);
    setRightSubtree(rtData);
    setEditorProps(initEditorProps(ltData, rtData));
    // 强制使 editor编辑器重新挂载，以便内部能够重新初始化相关诸如高亮，自动补全等配置
    setDoRefresh(prev => prev + 1);
  };

  function getSubtreeList(config) {
    if (Array.isArray(config?.options)) {
      return { data: config.options };
    } else if (config?.url) {
      return getSubtreeValuesFromService(config);
    } else {
      console.log('未配置用于获取列表数据的url或者options属性');
      return { data: [] };
    }
  };

  /**
   * 调用接口获取数据
   *  method为get请求时，params参数为请求头
   *  method为post请求时，params参数为请求体，query为请求头
   * @param {*} config
   * @returns
   */
  function getSubtreeValuesFromService(config) {
    const { url, method = 'get', params, query } = config;
    return httpFetch[method](url, params, null, null, query);
  };

  function getValueListCode(treeList) {
    return (
      treeList
        .map(node => getValue ? getValue(node) : node[valueKey])
        .filter(code => code)
    );
  };

  /**
   * 初始化 可编辑区域高亮，自动提示补全的list
   * 1. 高亮关键字默认用列表数据，
   *  1.1 左侧列表与右侧列表数据颜色默认不一致，用 key['lt','rt'] 区分
   *  1.2 支持外传keywords对象，与颜色高亮的配置属性rules
   * 2. 代码自动补全
   *  2.1 默认关闭代码补全
   *  2.2 如果开启且外界没有传入expression数组，默认右侧列表数据在输入时需要被补全
   *  2.3 如果开启且传入expression数组，则以expression数组中的数据为主
   * @param {*} ltSubTreeList
   * @param {*} rtSubTreeList
   * @returns
   */
  function initEditorProps(ltSubTreeList, rtSubTreeList) {

    let rtList = [];
    if (!keywords || (autoCompletion && !expressions)) {
      rtList = getValueListCode(rtSubTreeList);
    }

    const result = ({
      keywords: keywords || ({
        'lt': getValueListCode(ltSubTreeList),
        'rt': rtList,
      }),
      expressions: autoCompletion ? expressions || rtList : [],
    });
    console.log(result, 'result')
    return result;
  };

  /**
   * 监听可编辑区域文本变换
   * @param {*} value
   */
  function onChangeValue(editorString) {
    console.log('editor_editorString:', editorString);
    if (onChange) {
      onChange(editorString);
    }
  };

  function onNodeClick(option) {
    editorRef.current.insertText(option.key);
  }

  return (
    <div className="cs-dg-editor-wrap" style={{ height }}>
      <div className="cs-dg-editor-lt-subtree">
        <span className="subtree-title">{ltSubtreeTitle}</span>
        <EditorValueList
          options={leftSubtree}
          labelKey={ltLabelKey}
          valueKey={valueKey}
          type="lt"
          onNodeClick={onNodeClick}
        />
      </div>
      <div className="cs-dg-editor-ct-wrap">
        <EditorContent
          {...editorProps}
          valueKey={valueKey}
          rules={rules}
          defaultValue={value}
          refreshFlag={doRefresh}
          onGetValue={getValue}
          onChange={onChangeValue}
          ref={editorRef}
        />
      </div>
      <div className="cs-dg-editor-rt-subtree">
        <span className="subtree-title">{rtSubtreeTitle}</span>
        <EditorValueList
          options={rightSubtree}
          labelKey={rtLabelKey}
          valueKey={valueKey}
          type="rt"
          onNodeClick={onNodeClick}
        />
      </div>
    </div>
  )
}
