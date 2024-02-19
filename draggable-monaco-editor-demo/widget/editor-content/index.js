import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { MonacoDragNDropProvider } from './provider';

function MonacoCustomEditor(props, ref) {
  const {
    defaultValue,
    keywords,
    expressions,
    onChange,
    refreshFlag,
    onGetValue,
    valueKey,
    rules,
  } = props;

  // 设置 编辑器外部的属性
  const [dragProvider, setDragProvider] = useState({});
  // 设置 两个实例，editor 为编辑器实例，monaco 为 monaco 组件实例
  const editor = useRef();
  const monaco = useRef();

  useImperativeHandle(ref, () => {
    return {
      insertText: (text) => {
        const manacoEditor = editor.current;
        const position = manacoEditor.getPosition();

        let selection = new monaco.current.Selection(position.lineNumber, position.column + text.length, position.lineNumber, position.column + text.length);
        if (text === '()') {
          selection = new monaco.current.Selection(position.lineNumber, position.column + text.length - 1, position.lineNumber, position.column + text.length - 1);
        }

        // 2 插入
        manacoEditor.executeEdits('insert', [
          {
            range: new monaco.current.Range(position.lineNumber,
              position.column,
              position.lineNumber,
              position.column),
            text,
            forceMoveMarkers: true,
          },
        ], [selection],);

        manacoEditor.focus();

      },
    }
  }, []);

  function getNodeValue(node) {
    if (onGetValue) {
      return onGetValue(node)
    }
    return node[valueKey];
  }

  // 自定义 关键字和主题
  function codeTooltipHandle(monacoRef) {
    // 定义自定义提示的名字
    monacoRef.languages.register({
      id: "calc",
    });

    // 自定义 关键词语言配置
    const languageConfig = {
      // 后端传输过来需要高亮的关键字
      ...keywords,

      defaultToken: "",
      ignoreCase: false,

      brackets: [
        { open: "{", close: "}", token: "delimiter" },
        { open: "[", close: "]", token: "delimiter" },
        { open: "(", close: ")", token: "delimiter" },
      ],

      operators: ['+', '-', '*', '/', '>', '<', '!'],

      // 匹配规则
      // monaco 的匹配规则是这样的，先匹配一次正则，找到所有符合条件的
      // 符合条件的再去 关键词数组中查找，找到的就高亮，相当于进行了两次筛选
      tokenizer: {
        root: [
          [/\d+/, "number"],

          // eslint-disable-next-line no-useless-escape
          [/[{}()\[\]]/, "@brackets"],

          // [/[;,.]/, "delimiter"],
          // eslint-disable-next-line no-useless-escape
          [/[\+\-\*\/]/,
            {
              cases: {
                '@operators': 'operators',
                "@default": "identifier",
              },
            },
          ],

          [/[a-zA-Z0-9_\-:]+/,
            {
              cases: {
                ...keywordsToCases(),
                "@default": "identifier",
              },
            },
          ],
        ],
      },
    };

    const rulesProp = Array.isArray(rules) ?
      rules : (
        [{
          token: "rt",
          foreground: "#AD8F4E",
        },
        {
          token: 'lt',
          foreground: "#52A250",
        }]
      );
    // 自定义 颜色主题
    const themeConfig = {
      // 编辑器各个部位的颜色
      colors: {
        'editor.background': '#F5F6FA',     // 编辑器的背景色
        "editorSuggestWidget.selectedBackground": '#51c4d3',    // 编辑器补全提示，当前项的背景色
      },
      base: "vs",
      inherit: false,

      // 关键字匹配到的高亮颜色
      rules: [
        ...rulesProp,
        {
          token: 'operators',
          foreground: '#A627A4',
        },
        {
          token: "identifier",
          foreground: "#000000",
        },
        {
          token: "delimiter",
          foreground: "#22a2c3",
        },
      ],
    };

    // 将 自定义关键词 设置进实例中
    monacoRef.languages.setMonarchTokensProvider("calc", languageConfig);
    // 将自定义颜色主题 设置进实例中
    monacoRef.editor.defineTheme("javascript-theme", themeConfig);

    // 设置 自定义补全提示
    registerDictionaries(monacoRef);
  }

  // 自定义 补全提示
  function registerDictionaries(editorRef) {
    const completeList = Array.isArray(expressions) ? expressions : [];
    if (completeList.length === 0) return;
    editorRef.languages.registerCompletionItemProvider("cal c", {
      provideCompletionItems(model, position) {
        // 获取 当前输入的光标位置
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return ({
          suggestions: formatExpressions(range, editorRef, completeList),
        });

      },
      fixedOverflowWidgets: true,
      triggerCharacters: ['.'],   // 全量触发提示的字符（这里不能设置字母）
    })
  }

  // 将 公式 处理成 补全提示的格式
  function formatExpressions(range, editorRef, list) {
    return list.map(item => {
      return {
        label: item,
        kind: 1,
        insertText: `${item} `,
        range,
      };
    })
  }

  // 将 后端返回的关键词，处理成 高亮判断条件的对象
  function keywordsToCases() {
    const cases = {};
    Object.keys(keywords).forEach(item => {
      cases[`@${item}`] = item;
    })

    return cases;
  }

  // monaco-editor 适配的 onDrop方法
  const onDropMonaco = (e, target, instance) => {
    // 获取需要插入的选项数据
    let data = e.dataTransfer.getData("extra");
    data = data ? JSON.parse(data) : null;
    // 组件内部定死valueType只会是lt,rt
    if (
      data &&
      ['lt', 'rt'].includes(data.valueType) &&
      instance
    ) {
      // 发布插入的动作，其实就是调用insertText方法而已
      insertTextAtPos(
        instance,
        data,
        [target.position.lineNumber, target.position.column],
        true
      );
    }
  }

  /**
 * monaco-editor 的插入方法
 * @param {*} instance 编辑器实例
 * @param {*} node 需要插入的对象数据
 * @param {*} pos 光标位置
 * @param {*} placeCursor （按理说可以不要这个参数，没用到，先留着万一之后需要用呢）
 */
  const insertTextAtPos = (instance, node, pos = [0, 0], placeCursor = true) => {
    // 解析出 需要插入的文字
    const text = getNodeValue(node) || '';
    if (!text) {
      console.log('未能获取元素的被插入值!');
    }

    // 光标偏移量，默认会便宜到插入文字的最后，+1是因为最后有个空格
    const offset = text.length + 1;

    // 通过 光标位置 设置 range 对象
    const range = {
      startLineNumber: pos[0],
      startColumn: pos[1],
      endLineNumber: pos[0],
      endColumn: pos[1],
    }

    if (placeCursor) {
      // 获取 selection 对象，pos[1] + offset 是光标偏移后的位置
      const selection = new monaco.current.Selection(pos[0], pos[1] + offset, pos[0], pos[1] + offset);

      // 将文本插入编辑器中
      instance.executeEdits('insert', [{ range, text: `${text} `, forceMoveMarkers: true }], [selection]);

      // 聚焦编辑器
      instance.focus();
    } else {
      instance.executeEdits('insert', [{ range, text: `${text} `, forceMoveMarkers: true }]);
    }
    instance.pushUndoStop();
  };

  // change 事件
  function handleChange(newValue) {
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className='edit-box' {...dragProvider.props}>
      <MonacoEditor
        key={refreshFlag}
        language="calc"
        defaultValue={defaultValue}
        theme="javascript-theme"
        onChange={handleChange}
        options={{
          selectOnLineNumbers: true,
          lineNumbersMinChars: 3,
          fontSize: 16,
          roundedSelection: false,
          readOnly: false,
          dragAndDrop: true,
          domReadOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          minimap: { enabled: false },
          fixedOverflowWidgets: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: {
            top: 12,
          },
          "bracketPairColorization.enabled": true,
          // scrollbar: {
          //   arrowSize: 6,
          //   verticalScrollbarSize: 6,
          //   verticalSliderSize: 6,
          // },
        }}
        editorDidMount={(editorRef, monacoRef) => {
          editor.current = editorRef;
          monaco.current = monacoRef;

          // 获取 下拉需要的属性
          const dropProps = new MonacoDragNDropProvider(onDropMonaco, () => editorRef);
          setDragProvider(dropProps);

          editorRef.focus();
        }}
        editorWillMount={(monacoRef) => { codeTooltipHandle(monacoRef); }}
      />
    </div>
  )
}

export default forwardRef(MonacoCustomEditor);