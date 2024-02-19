
## API

| 属性 | 说明 | 默认值 |
| - | - | - |
| valueKey | 列表数据的唯一索引访问路径 | 'code' | 
| getValue | 获取列表的唯一索引,作用类似valueKey | fn(dynamic node) |
| renderTitle | 列表展示文字，作用类似labelKey | fn(dynamic node, string type) 【type用以区分是左侧或右侧列表 ‘lt’:左，‘rt’:右】 |
| value | 编辑器默认值 | '' |
| onChange | 编辑区文本变化后的回调事件【非弹窗组件下的事件】 | fn(string value) |
| autoCompletion | 是否开启自动补全(开启后默认以右侧列表数据为目标作为需要补全的关键字集合) | false |
| keywords | 用于设置高亮关键字集合， 详见[keywords,rules,expressions](#keywords,rules,expressions) | {lt: <string>[],rt: <string>[]} | 
| expressions | (代码提示)指定需要作为自动补全的关键字集合，如：声明[ex],则输入时匹配到“e”,会弹出提示窗提示 | <string>[]| 
| height | 指定编辑组件的高度 | 420 |
| rules | 指定高亮关键字所属类型的高亮颜色，与`keywords`配合使用 | [] | 
| ltConfig | 左侧列表数据相关配置, 详见[ltConfig](#ltConfig) | {} |
| rtConfig| 右侧列表数据相关配置 | {} |

--
| width | 弹框宽度 | 700 |
| onOK | 弹框确认事件 | fn() |
| onCancel | 弹框取消事件 | fn() |

### valueKey,getValue

- valueKey 默认左右统一是同一个属性（如果分ltValueKey,rtValueKey,拖拽到编辑区时，内部无法区分，因此默认统一）
- 但由于左右数据列表的唯一索引可以不是同一个，因此提供`getValue`方法以便获取


### keywords,rules,expressions

``` javascript

const keywords = {
  'formula': ['+','-','*','/'],
  'listCode': ['code1','code2','code3'],
  ...
}
const rules = [{
  token: "formula", // 与keywords属性名对应
  foreground: "#AD8F4E", // 指定该属性名所指数组集合中的关键字颜色为 "#AD8F4E" 
},
{
  token: 'listCode',
  foreground: "#52A250",
},
...
];

const expressions = ['hasOwnProperty','has'];

```


### ltConfig
| 属性 | 说明 | 默认值 | 
| - | - | - |
| url | 获取数据的接口 | - |
| method | 请求方式('get','post') | - | 
| params | 请求参数，若为get则是请求头参数，若为post则是请求体参数 | - | 
| query | 可选，请求方式为post时，为请求头参数 | - |
| options | 列表数据 | - |
| subtreeTitle | 列表数据标题 | - |
| labelKey | 指定渲染列表数据时的文本路径， 若单一属性名无法满足需求，可使用`renderTitle`方法 | 'name' | 


> options 与url,method,params,query存在一个即可，优先以options为主


## demo
``` javascript

import React, { useState } from "react";
import { Button } from 'antd';
import DraggableEditor from "components/common/draggable-editor";
import DraggableEditorModal from "components/common/draggable-editor/modal";

export default function Demo() {
  const props = {
    ltConfig: {
      labelKey: "title",
      subtreeTitle: "列表数据",
      options: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '住址3',
          dataIndex: 'address3',
          key: 'address3',
        },
        {
          title: '住址4',
          dataIndex: 'address4',
          key: 'address4',
        },
        {
          title: '住址5',
          dataIndex: 'address5',
          key: 'address5',
        },
        {
          title: '住址6',
          dataIndex: 'address6',
          key: 'address6',
        },
        {
          title: '住址7',
          dataIndex: 'address7',
          key: 'address7',
        },
      ],
    },
    rtConfig: {
      url: '/data/api/hierarchy/page',
      params: { page: 0, size: 10 },
      method: 'get',
      labelKey: 'calculationName',
      // labelKey: "title",
      // options: [
      //   {
      //     title: 'CALC',
      //     key: 'CALC',
      //   },
      //   {
      //     title: 'ADD',
      //     key: 'ADD',
      //   },
      // ],
    },
    valueKey: "key",
    height: 300,
  };

  const [visible, setVisible] = useState(false);

  return (
    <>
      <DraggableEditor
        {...props}
        // getValue={(node) => node.calculationCode || node.key}
      />
      <Button onClick={() => {
        setVisible(true);
      }}>
        click me
      </Button>
      <DraggableEditorModal
        {...props}
        visible={visible}
        onOk={(v) => { console.log('v', v) }}
        onClose={() => { setVisible(false) }}
      />
    </>
  );
}

```


