import { observer } from 'mobx-react-lite';
import React from 'react';
import { BrowserRouterProps, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from '../routes';
import { useStore } from '../store';

type IRoutes = typeof routes;

interface RouterProviderProps extends BrowserRouterProps {
  routes: IRoutes;
}

const AuthRequired = observer(({ children }: { children: JSX.Element }) => {
  const { user } = useStore();
  return user.access_token ? children : <Navigate to={{ pathname: '/login ' }} />;
});

const renderRoutes = (routes: IRoutes): JSX.Element[] => {
  return routes.map((route, index) => (
    <React.Fragment key={index}>
      <Route
        key={index}
        path={route.path}
        element={route.isPublic ? route.element : <AuthRequired>{route.element}</AuthRequired>}
      />
      {route.children && renderRoutes(route.children as IRoutes)}
    </React.Fragment>
  ));
};

export const RouterProvider: React.FC<RouterProviderProps> = ({ routes }) => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};
