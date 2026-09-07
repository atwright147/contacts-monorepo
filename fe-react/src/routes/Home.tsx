import { Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { Agenda } from '#components/Agenda';
import { DataTable } from '#components/DataTable';
import { getApiContactsFavoritesOptions } from '#client/@tanstack/react-query.gen';
import { useMemo } from 'react';

export function Home() {
  const { data } = useQuery(getApiContactsFavoritesOptions());

  const body = useMemo(() => {
    return data?.map((row) => ({
      fullName: {
        value: `${row.firstName} ${row.lastName}`,
        link: `/contacts/${row.id}`,
      },
      email: { value: row.email },
    })) ?? [];
  }, [data]);

  const head = ['Name', 'Email'];

  return (
    <>
      <Title order={1}>Home</Title>

      <Stack gap={10}>
        <Agenda />

        <Title order={2}>Favourite Contacts</Title>

        <DataTable head={head} body={body} />
      </Stack>
    </>
  );
}
