
import React, { useEffect, useState } from "react";
import { Menu } from 'antd';
import { Link } from 'umi';

import './style.less';

export default function SideMenu({
  routes: routeProps,
  inlineCollapsed,
}) {


  const [routes, setRoutes] = useState(routeProps);

  useEffect(() => {
    setRoutes(updateMenusRecursively(routeProps));
  }, []);


  function updateMenusRecursively(menus) {
    if (Array.isArray(menus)) {
      return menus.map(menu => {
        const key = menu.path || menu.name;
        const route = {
          ...menu,
          key,
          label: (
            <div className="side-menu-item" key={key} id={key}>
              {menu.path ? (<Link to={menu.path}>{menu.name}</Link>) : menu.name}
            </div>
          )
        };
        if (Array.isArray(menu.children)) {
          route.children = updateMenusRecursively(menu.children);
        }
        return route;
      });
    }
  }

  return (
    <div className="side-menu">
      <Menu
        mode="inline"
        theme="dark"
        items={routes}
        inlineCollapsed={inlineCollapsed}
      />
    </div>
  )
}