import { useQuery } from '@tanstack/react-query';
import { Title } from '@mantine/core';

import { getApiContactsByIdOptions } from '#client/@tanstack/react-query.gen';
import { useAuthStore } from '#stores/authStore';
// import { boolToHuman } from '../utils/boolToHuman';

interface Props {
  contactId: string;
}

export function Contact({ contactId }: Props) {
  const id = Number(contactId);
  const token = useAuthStore((s) => s.token);
  const { data, isLoading, isError, isFetching } = useQuery({
    ...getApiContactsByIdOptions({ path: { id } }),
    enabled: !!token,
  });

  return (
    <>
      <Title order={1}>Contacts</Title>

      {!isLoading && !isFetching && !isError && data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
}
