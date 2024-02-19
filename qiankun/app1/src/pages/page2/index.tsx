import React, { useEffect, useRef, useState } from "react";
import Painter from "./painter";

export default function IndexPage2() {

  const channel = useRef<any>({});
  const [text, setText] = useState('');

  useEffect(() => {
    // 连接到广播频道
    const _channel = new BroadcastChannel("test_channel");

    _channel.onmessage = (msg: any) => {
      console.log(msg);
      setText(msg.data);
    }

    channel.current = _channel;

    return () => {
      channel.current.close();
    }
  }, []);

  useEffect(() => {
    document.querySelector('h1')?.addEventListener('click', evt => {
      evt.stopPropagation();
      console.log('原生事件')
    })
  }, []);

  function onClick(evt) {
    evt.stopPropagation();
    console.log('React 混合事件')
  }


  return (
    <div>
      <h1 id='h1' onClick={onClick}>子项目app1的page2</h1>
      <div>{text}</div>
      <Painter />
    </div>
  );
}
