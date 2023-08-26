
import React from 'react';
import { MicroAppWithMemoHistory } from 'umi';

interface MicroAppComponentProp {
  name: string; // 所属模块
  componentName: string; // 组件名
  params?: any; // 组件参数
}


export default function MicroAppComponent({
  name,
  componentName,
  params
}: MicroAppComponentProp) {

  return (
    <MicroAppWithMemoHistory
      name={name}
      url={`/${name}`}
      type='component'
      params={params}
      componentName={componentName}
    />
  )
}