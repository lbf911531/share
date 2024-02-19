

import React, { useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import openDb from '../../indexeddb';

export default function Page3(props) {

  const _db = useRef();

  useEffect(() => {
    openDb().then(db => {
      // const userStore = db.transaction('user', 'readwrite').objectStore('user');
      _db.current = db;
      // [{ name: 'zs', age: 22 }, { name: 'ls', age: 33 }].forEach(user => {
      //   userStore.add(user);
      // });
    });
  }, []);

  function change() {
    const userStore = _db.current.transaction('user', 'readwrite').objectStore('user')
    userStore.put({
      id: 10,
      name: 'lss',
      age: 22,
    });
  }

  function onGet() {
    console.log(1);
    const userStore = _db.current.transaction('user', 'readwrite').objectStore('user')

    const rq = userStore.get(2);
    console.log(2);
    rq.onsuccess = (event) => {
      console.log(3);
      console.log(rq.result);
    };
  }

  function onDelete() {
    const userStore = _db.current.transaction('user', 'readwrite').objectStore('user')
    const rq = userStore.delete(4);
    rq.onsuccess = () => {
      alert('删除成功');
    }
  };

  function change2() {
    const userStore = _db.current.transaction('user', 'readwrite').objectStore('user')
    userStore.put({
      name: 'gls',
      age: 22,
    });
  }

  function change3() {
    const userStore = _db.current.transaction('user', 'readwrite').objectStore('user')
    userStore.put({
      id: 11,
      name: 'ggg',
      age: 22,
    });
  }


  return (
    <div>
      <Button onClick={() => { message.success('成功触发子项目组件') }}>
        click me
        {props.text}
      </Button>
      <Button onClick={change}>put</Button>
      <Button onClick={change2}>put2</Button>
      <Button onClick={change3}>put2</Button>
      <Button onClick={onGet}>get</Button>
      <Button onClick={onDelete}>delete</Button>
    </div>
  )
}