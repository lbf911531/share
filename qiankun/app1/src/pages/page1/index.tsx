import { FastBackwardOutlined } from '@ant-design/icons'

import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

export default function IndexPage1() {

  const channel = useRef<any>({});
  const [count, setCount] = useState(1);

  useEffect(() => {
    // 连接到广播频道
    channel.current = new BroadcastChannel("test_channel");

    // function loadScript(url) {
    //   return new Promise((resolve, reject) => {
    //     fetch(url).then(data => data.text()).then(data => {
    //       console.log(data)
    //       resolve(data);
    //       // eval(data);
    //     })
    //     // const script = document.createElement('script');
    //     // script.src = url;
    //     // script.onload = () => {
    //     //   resolve('success');
    //     // }
    //     // script.onerror = (err) => {
    //     //   reject(err)
    //     // }
    //     // document.body.appendChild(script);
    //   });
    // }

    // loadScript('https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js').then(() => {
    //   console.log('success')
    // });

    return () => {
      channel.current.close();
    }
  }, []);

  function postMessage() {
    const newCount = count + 1;
    channel.current.postMessage(`test${newCount}`);
    setCount(newCount);
  }

  return (
    <div>
      <h1>子项目app1的page1</h1>
      <Button onClick={postMessage}>
        broadcast channel api 通信
      </Button>
      <span className='demo'><FastBackwardOutlined /></span>
    </div>
  );
}
