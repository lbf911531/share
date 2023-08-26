

import React from "react";
import { MicroApp, useLocation, useModel } from 'umi';
import microAppComponentList from "../../components/microAppComponentList";

function GlobalContent({
  children,
  collapsed: curAppCollapsed,  // 注意子项目这里的是来自子项目的，线上子项目当取masterProps
}) {

  const { pathname } = useLocation();

  const [moduleName] = pathname.split('/');
  const masterProps = useModel('@@qiankunStateFromMaster');


  if (masterProps.type === 'component' && microAppComponentList[masterProps.componentName]) {
    // 如果约定的type是component表示是要渲染组件，
    return (
      React.createElement(
        microAppComponentList[masterProps.componentName], 
        masterProps.params
      )
    )
  }

  if (
    ['app1', 'app2'].includes(moduleName) && NAME === 'main'
  ) {
    return (
      <div className="global-content">
        <MicroApp
          name={moduleName}
          autoSetLoading
          collapsed={curAppCollapsed}
        />
      </div>
    )
  }

  console.log(masterProps, '在子项目中打印masterProps')

  return (
    <div className="global-content">
      {children}
    </div>
  )

}

export default GlobalContent;