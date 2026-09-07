import { Table } from '@mantine/core';
import type { JSX, ReactNode } from 'react';

export type Row = Record<string, { value: ReactNode; link?: string }>;
export type Head = string[];
export type Body<T extends Row = Row> = T[];

export interface Props<T extends Row = Row> {
  head: Head;
  body: Body<T>;
}

export function DataTable<T extends Row = Row>({ head, body }: Props<T>): JSX.Element {
  const rows = body.map((row, rowIndex) => (
    <Table.Tr key={rowIndex}>
      {Object.entries(row).map(([columnKey, cell]) => (
        <Table.Td key={columnKey}>
          {cell.link ? <a href={cell.link}>{cell.value}</a> : cell.value}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          {head.map((label) => (<Table.Th key={label}>{label}</Table.Th>))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
