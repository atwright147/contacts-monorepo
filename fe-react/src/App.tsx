import { QueryClientProvider } from '@tanstack/react-query';
import { type Routes, useRoutes } from 'raviger';
import type { JSX } from 'react';
import { MantineProvider } from '@mantine/core';

import { ProtectedRoute } from '#components/ProtectedRoute';
import { Calendar } from '#routes/Calendar';
import { Calls } from '#routes/Calls';
import { Contacts } from '#routes/Contacts';
import { Home } from '#routes/Home';
import { Login } from '#routes/Login';
import { Logout } from './routes/Logout';
import { Messages } from '#routes/Messages';
import { Root } from '#routes/Root';
import { Settings } from '#routes/Settings';
import { queryClient } from '#utils/queryClient';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '#src/index.css';

const routes = {
  '/': () => <Home />,
  '/login': () => <Login />,
  '/logout': () => <Logout />,
  '/calendar': () => <ProtectedRoute><Calendar /></ProtectedRoute>,
  '/calls': () => <ProtectedRoute><Calls /></ProtectedRoute>,
  '/contacts': () => <ProtectedRoute><Contacts /></ProtectedRoute>,
  '/home': () => <ProtectedRoute><Home /></ProtectedRoute>,
  '/messages': () => <ProtectedRoute><Messages /></ProtectedRoute>,
  '/settings': () => <ProtectedRoute><Settings /></ProtectedRoute>,
} satisfies Routes<string>;

export const App = (): JSX.Element => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const route = useRoutes(routes, { basePath: base });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="auto">
        <Root>{route}</Root>
      </MantineProvider>
    </QueryClientProvider>
  );
};
