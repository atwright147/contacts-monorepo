import { useMemo } from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Box, Group, Paper, Stack, Text, Title, Typography } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { getApiContactsBirthdaysOptions } from '#client/@tanstack/react-query.gen';

dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);

export const Agenda = () => {
  const { data } = useQuery(getApiContactsBirthdaysOptions());

  const groups = useMemo(
    () =>
      (data ?? [])
        .slice()
        .sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
        .map((group) => ({
          month: group.month ?? 0,
          contacts: (group.contacts ?? [])
            .slice()
            .sort((a, b) => dayjs(a.dateOfBirth).date() - dayjs(b.dateOfBirth).date()),
        })),
    [data],
  );

  return (
    <>
      <Title order={1}>Upcoming Birthdays</Title>

      <Stack>
        {groups.map((group) => (
          <Paper component="section" key={group.month}>
            <Stack>
              <Title order={2}>{dayjs().month(group.month - 1).format('MMMM')}</Title>

              <Group>
                {group.contacts.map((contact) => (
                  <Box key={contact.id} pb="md">
                    <Group gap={0}>
                      <Text style={{ fontSize: '3rem' }}>{dayjs(contact.dateOfBirth).format('Do')}</Text>
                      <Text style={{ textOrientation: 'sideways', writingMode: 'vertical-rl'}}>{dayjs(contact.dateOfBirth).format('YYYY')}</Text>
                    </Group>
                    <Typography>{contact.firstName}&nbsp;{contact.lastName}</Typography>
                  </Box>
                ))}
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
};
