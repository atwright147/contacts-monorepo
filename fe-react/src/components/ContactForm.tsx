import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { z } from 'zod';
import type { JSX } from 'react';

import type { ContactWithFullName } from '#client/types.gen';
import { zAddress, zPhoneNumber } from '#client/zod.gen';

const addressSchema = zAddress.extend({
  line1: z.string().trim().min(1, 'Line 1 is required').nullable(),
  city: z.string().trim().min(1, 'City is required').nullable(),
});

const phoneSchema = zPhoneNumber.extend({
  number: z.string().trim().min(1, 'Number is required').nullable(),
});

const contactFormSchema = z.object({
  id: z.number().int().optional(),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
  dateOfBirth: z.union([z.literal(''), z.iso.date()]).optional(),
  isFavorite: z.boolean(),
  primaryAddressId: z.number().positive().int().nullable().optional(),
  primaryPhoneNumberId: z.number().positive().int().nullable().optional(),
  addresses: z.array(addressSchema),
  phoneNumbers: z.array(phoneSchema),
});

type FormValues = z.infer<typeof contactFormSchema>;

const emptyValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  isFavorite: false,
  primaryAddressId: null,
  primaryPhoneNumberId: null,
  addresses: [],
  phoneNumbers: [],
};

type Props = {
  initialValues?: ContactWithFullName;
  onSubmit: (values: FormValues) => void;
};

export function ContactFormRHF({ initialValues, onSubmit }: Props): JSX.Element {
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialValues
      ? {
          id: initialValues.id,
          firstName: initialValues.firstName ?? '',
          lastName: initialValues.lastName ?? '',
          email: initialValues.email ?? '',
          dateOfBirth: initialValues.dateOfBirth ?? '',
          isFavorite: initialValues.isFavorite,
          primaryAddressId: initialValues.primaryAddressId ?? null,
          primaryPhoneNumberId: initialValues.primaryPhoneNumberId ?? null,
          addresses: (initialValues.addresses ?? []).map((address) => ({
            id: address.id,
            contactId: address.contactId,
            line1: address.line1 ?? '',
            line2: address.line2 ?? '',
            city: address.city ?? '',
            state: address.state ?? '',
            postalCode: address.postalCode ?? '',
            country: address.country ?? '',
          })),
          phoneNumbers: (initialValues.phoneNumbers ?? []).map((phone) => ({
            id: phone.id,
            contactId: phone.contactId,
            number: phone.number ?? '',
            type: phone.type ?? '',
          })),
        }
      : emptyValues,
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray<FormValues, 'addresses'>({ control, name: 'addresses' });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray<FormValues, 'phoneNumbers'>({ control, name: 'phoneNumbers' });

  const primaryAddressId = useWatch({ control, name: 'primaryAddressId' });
  const primaryPhoneNumberId = useWatch({ control, name: 'primaryPhoneNumberId' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Contact</Title>

          <Group grow>
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <TextInput
                  label="First Name"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState }) => (
                <TextInput
                  label="Last Name"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </Group>

          <Group grow>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput
                  label="Email"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <TextInput
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              )}
            />
          </Group>

          <Controller
            control={control}
            name="isFavorite"
            render={({ field }) => (
              <Checkbox
                label="Favorite"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            )}
          />

          <Divider />
          <Title order={4}>Addresses</Title>

          {addressFields.map((field, index) => (
            <Paper key={field.id} p="sm" withBorder>
              <Stack gap="xs">
                <Group justify="apart">
                  <Title order={5}>Address {index + 1}</Title>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeAddress(index)}
                  >
                    ✕
                  </ActionIcon>
                </Group>

                <Controller
                  control={control}
                  name={`addresses.${index}.line1`}
                  render={({ field: itemField, fieldState }) => (
                    <TextInput
                      label="Line 1"
                      value={itemField.value ?? ''}
                      onChange={itemField.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`addresses.${index}.line2`}
                  render={({ field: itemField }) => (
                    <TextInput
                      label="Line 2"
                      value={itemField.value ?? ''}
                      onChange={itemField.onChange}
                    />
                  )}
                />
                <Group grow>
                  <Controller
                    control={control}
                    name={`addresses.${index}.city`}
                    render={({ field: itemField, fieldState }) => (
                      <TextInput
                        label="City"
                        value={itemField.value ?? ''}
                        onChange={itemField.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`addresses.${index}.state`}
                    render={({ field: itemField }) => (
                      <TextInput
                        label="State"
                        value={itemField.value ?? ''}
                        onChange={itemField.onChange}
                      />
                    )}
                  />
                </Group>
                <Group grow>
                  <Controller
                    control={control}
                    name={`addresses.${index}.postalCode`}
                    render={({ field: itemField }) => (
                      <TextInput
                        label="Postal Code"
                        value={itemField.value ?? ''}
                        onChange={itemField.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`addresses.${index}.country`}
                    render={({ field: itemField }) => (
                      <TextInput
                        label="Country"
                        value={itemField.value ?? ''}
                        onChange={itemField.onChange}
                      />
                    )}
                  />
                </Group>

                <Checkbox
                  label="Primary"
                  checked={primaryAddressId === (field?.id ?? index)}
                  onChange={() => setValue('primaryAddressId', field?.id ?? index)}
                />
              </Stack>
            </Paper>
          ))}

          <Button
            variant="light"
            onClick={() =>
              appendAddress({
                line1: '',
                line2: null,
                city: '',
                state: '',
                postalCode: '',
                country: '',
              })
            }
          >
            Add Address
          </Button>

          <Divider />
          <Title order={4}>Phone Numbers</Title>

          {phoneFields.map((field, index) => (
            <Paper key={field.id} p="sm" withBorder>
              <Group align="flex-end">
                <Controller
                  control={control}
                  name={`phoneNumbers.${index}.number`}
                  render={({ field: itemField, fieldState }) => (
                    <TextInput
                      label="Number"
                      style={{ flex: 1 }}
                      value={itemField.value ?? ''}
                      onChange={itemField.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`phoneNumbers.${index}.type`}
                  render={({ field: itemField }) => (
                    <Select
                      data={['Home', 'Work', 'Mobile', 'Other']}
                      label="Type"
                      style={{ flex: 1 }}
                      value={itemField.value ?? null}
                      onChange={itemField.onChange}
                    />
                  )}
                />
                <Checkbox
                  label="Primary"
                  checked={primaryPhoneNumberId === (field?.id ?? index)}
                  onChange={() => setValue('primaryPhoneNumberId', field?.id ?? index)}
                />
                <ActionIcon color="red" variant="subtle" onClick={() => removePhone(index)}>
                  ✕
                </ActionIcon>
              </Group>
            </Paper>
          ))}

          <Button
            variant="light"
            onClick={() => appendPhone({ number: '', type: 'Mobile' })}
          >
            Add Phone Number
          </Button>

          <Group>
            <Button type="submit">Save</Button>
          </Group>
        </Stack>
      </Paper>
    </form>
  );
}
