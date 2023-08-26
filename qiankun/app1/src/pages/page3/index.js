

import React from 'react';
import { Button, message } from 'antd';


export default function Page3(props) {

  return (
    <div>
      <Button onClick={() => { message.success('成功触发子项目组件') }}>
        click me
        {props.text}  
      </Button>
    </div>
  )
}