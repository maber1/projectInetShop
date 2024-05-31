import React from 'react';
import moment from 'moment';
import { RouterProvider } from './providers/RouterProvider';
import { routes } from './routes';
import { Layout, Notification } from './components';

moment.locale('ru');

function App() {
  return (
    <Layout>
      <Notification />
      <RouterProvider routes={routes} />
    </Layout>
  );
}

export default App;
