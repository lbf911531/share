

import React from "react";
import { MicroApp, useLocation, useModel } from 'umi';
  
function GlobalContent({
  children,
  collapsed: curAppCollapsed, // 注意子项目这里的是来自子项目的，线上子项目当取masterProps
}) {

  const { pathname } = useLocation();

  const [,moduleName] = pathname.split('/');
  const masterProps = useModel('@@qiankunStateFromMaster');

  if (
    ['app1', 'app2'].includes(moduleName) && NAME === 'main'
  ) {
    return (
      <div className="global-content micro-app-gl-content">
        <MicroApp 
          name={moduleName} 
          autoSetLoading 
          collapsed={curAppCollapsed} 
        />
      </div>
    )
  }

  console.log(masterProps,'在主项目中打印masterProps');

  return (
    <div className="global-content">
      {children}
    </div>
  )

}

export default GlobalContent;