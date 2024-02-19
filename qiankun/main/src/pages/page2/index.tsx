import { useEffect, useRef, useState } from "react";

export default function IndexPage2() {

  const channel = useRef({});
  const [text, setText] = useState('');

  useEffect(() => {
    // 连接到广播频道
    const _channel = new BroadcastChannel("test_channel");

    _channel.onmessage = (msg: any) => {
      console.log(msg);
      setText(msg.data);
    }

    channel.current  = _channel;

    return () => {
      channel.current?.close();
    }
  }, []);


  return (
    <div>
      <h1>主项目的page2</h1>
      <div>{text}</div>
    </div>
  );
}
