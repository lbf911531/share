
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import GlobalContent from "./layouts/content";
import GlobalHeader from "./layouts/header";
import SideMenu from "./layouts/sideMenu";


import './style.less';

export default function Main(props) {

  const [collapsed, setCollapsed] = useState(false);

  if (NAME !== 'main') {
    /**
     * 这里需要兼容本地和线上，如果是线上环境且非主项目，需要走这里
     * 否则，正常走下面（这就需要用到package.json那边注册环境变量了）
     */
    return (
      <GlobalContent {...props} />
    )
  }

  function onSwitchMenuCollapse() {
    setCollapsed(!collapsed);
  };

  return (
    <div className="system-entry">
      <div
        className="extra-group-wrap"
        style={{
          left: !collapsed ? '200px' : '80px'
        }}
      >
        <div onClick={onSwitchMenuCollapse} >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      <div 
        className="lt-side-menu-wrap"
        style={{
          width: !collapsed ? '200px' : '80px'
        }}
      >
        {/* 关于渲染路由,主项目这里跳转是需要带上模块名的,子项目本身是不需要模块名的,
        因此需要考虑routerChange拦截覆盖当前的路由,以重定位匹配到正确的页面 */}
        <SideMenu
          routes={[
            {
              name: '首页',
              path: '/'
            },
            {
              name: 'main',
              children: [
                {
                  name: 'main.1',
                  path: '/main/page1',
                },
                {
                  name: 'main.2',
                  path: '/main/page2',
                }
              ]
            },
            {
              name: 'app1',
              children: [
                {
                  name: 'app1.1',
                  path: '/page1',
                },
                {
                  name: 'app1.2',
                  path: '/page2',
                },
                {
                  name: 'app1.3',
                  path: '/page3',
                }
              ]
            },
            {
              name: 'app2',
              children: [
                {
                  name: 'app2.1',
                  path: '/app2/page1',
                },
                {
                  name: 'app2.2',
                  path: '/app2/page2',
                }
              ]
            },
          ]}
          inlineCollapsed={collapsed}
        />
      </div>
      <div className="rt-content-wrap">
        <GlobalHeader />
        <GlobalContent {...props} collapsed={collapsed} />
      </div>
    </div>
  );
}
