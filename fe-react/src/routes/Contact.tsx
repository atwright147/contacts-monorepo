import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Title } from '@mantine/core';
import type { JSX } from 'react';

import {
  getApiContactsByIdOptions,
  putApiContactsByIdMutation,
} from '#client/@tanstack/react-query.gen';
import { useAuthStore } from '#stores/authStore';
import { ContactFormRHF } from '#src/components/ContactForm.tsx';

interface Props {
  contactId: string;
}

export function Contact({ contactId }: Props): JSX.Element {
  const id = Number(contactId);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    ...getApiContactsByIdOptions({ path: { id } }),
    enabled: !!token,
  });

  const update = useMutation({
    ...putApiContactsByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getApiContactsById'] });
    },
  });

  return (
    <>
      <Title order={1}>Contacts</Title>

      {isLoading || isFetching ? null : isError ? (
        <Title order={3} c="red">
          Failed to load contact
        </Title>
      ) : data ? (
        <ContactFormRHF
          initialValues={data}
          onSubmit={(values) =>
            update.mutate({
              path: { id },
              body: {
                id,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                dateOfBirth: values.dateOfBirth || null,
                isFavorite: values.isFavorite,
              },
            })
          }
        />
      ) : null}
    </>
  );
}
