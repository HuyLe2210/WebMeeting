// src/App.js
import React from 'react';
import { BrowserRouter as Router, useRoutes, Navigate  } from 'react-router-dom';
import routes from './router';

// Hàm chuyển đổi routes từ object sang tree router
function RenderAppRoutes({ userRole }) {
  const routeTree = transformRoutes(routes, userRole);
  return useRoutes(routeTree);
}

// Chuyển đổi routes dạng object sang dạng v6
function transformRoutes(routes, userRole) {
  return routes.map(route => {
    const hasPermission = !route.roleCode || route.roleCode === userRole;

    const transformed = {
      path: route.path,
      element: hasPermission
        ? typeof route.component === 'function'
          ? <route.component />
          : route.element
        : <Navigate to="/errors/error-404" />,
    };

    if (route.routes || route.children) {
      transformed.children = transformRoutes(route.routes || route.children, userRole);
    }

    return transformed;
  });
}

function App() {
  return (
    <Router>
      <RenderAppRoutes />
    </Router>
  );
}

export default App;
