

import React from 'react';
import { ColorPicker } from 'antd';

interface PainterToolbarProps {
  list: Array<{ id: string; name: string }>;
  onChange: (value: Record<string, string>) => void;
  value: Record<string, string>;
}

export default function PainterToolbar({
  list,
  onChange,
  value,
}: PainterToolbarProps) {

  function dispatchValChange(field, val) {
    onChange({
      ...value,
      [field]: val,
    })
  }

  return (
    <div className='painter-toolbar'>
      {
        Array.isArray(list) && list.map(item => {
          return (
            <div
              className={`painter-toolbar-item${value.shapeType === item.id ? ' selected' : ''}`}
              key={item.id}
              onClick={() => { dispatchValChange('shapeType', item.id) }}
            >
              {item.name}
            </div>
          )
        })
      }
      <div className='painter-toolbar-item'>
        <ColorPicker
          size='small'
          value={value.color}
          onChange={val => dispatchValChange('color', val.toRgbString())}
        />
      </div>
    </div>
  )
}