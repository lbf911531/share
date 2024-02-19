

import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import DraggableEditor from './index';

export default function DraggableEditorModal(props) {

  const {
    visible,
    onOk,
    onClose,
    height,
    width,
  } = props;

  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      setValue(props.value);
    }
  }, [visible]);

  function handleSubmit() {
    if (onOk) {
      onOk(value);
    }
  }

  return (
    <Modal
      title="编辑器"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
      bodyStyle={{ padding: 0, height }}
      width={width || 700}
      zIndex={1002}
    >
      <DraggableEditor {...props} onChange={setValue} />
    </Modal>
  )

}
