import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { DragEndEvent, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { Button, Table, DatePicker, Select } from 'antd';
import type { TableProps } from 'antd'; // pastikan ini di-import

import { Card } from 'antd';
import { Database, Plus } from '@phosphor-icons/react';
import { NavLink } from 'react-router';
import { FileExcelOutlined } from '@ant-design/icons';
import { ButtonFile } from '../button/buttonCardGroups';
const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  address: string;
}

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface BodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: 'left' | 'right';
}

const DragIndexContext = createContext<DragIndexState>({
  active: -1,
  over: -1,
});

const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  // drag active style
  let style: React.CSSProperties = {};
  if (active && active === id) {
    style = { backgroundColor: 'gray', opacity: 0.5 };
  }
  // dragover dashed style
  else if (over && id === over && active !== over) {
    style =
      direction === 'right'
        ? { borderRight: '1px dashed gray' }
        : { borderLeft: '1px dashed gray' };
  }
  return style;
};

const TableBodyCell: React.FC<BodyCellProps> = (props) => {
  const dragState = useContext<DragIndexState>(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: props.id,
  });
  const style: React.CSSProperties = {
    ...props.style,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999, userSelect: 'none' } : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

interface MappingAccount {
  id: string;
  module: string;
  transactionType: string;
  position: string;
  usage: string;
  accountCode: string;
  deletedAt: string | null;
}
interface GroupedData {
  key: string;
  module: string;
  transactionType: string;
  children: MappingAccount[];
}

export default function TableDragDrop({
  baseColumns,
  dataSource,
  loading,
  titleCard,
  linkAdd,
  scroll,
  handleTableChange,
  handleChangeRangeDate,
  handleDownloadPDF,
  handleDownloadExcel,
  handleChangeJurnal,
  Notifikasi,
  Other,
  expandable,
  onRow,
  rowClassName,
}: Readonly<{
  baseColumns: any;
  dataSource: any;
  loading: boolean;
  titleCard?: string;
  linkAdd?: string | null;
  scroll?: any;
  handleTableChange?: any;
  handleChangeRangeDate?: Function;
  handleDownloadPDF?: Function;
  handleDownloadExcel?: Function;
  handleChangeJurnal?: Function;
  Notifikasi?: ReactNode;
  Other?: ReactNode;
  expandable?: TableProps<GroupedData>['expandable'];
  onRow?: any;
  rowClassName?: (record: any, index: number) => string;
}>) {
  const [dragIndex, setDragIndex] = useState<DragIndexState>({
    active: -1,
    over: -1,
  });

  const [columns, setColumns] = useState(() =>
    baseColumns.map((column: any, i: number) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({ id: `${i}` }),
      onCell: () => ({ id: `${i}` }),
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setColumns((prevState: any) => {
        const activeIndex = prevState.findIndex((i: any) => i.key === active?.id);
        const overIndex = prevState.findIndex((i: any) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = columns.findIndex((i: any) => i.key === active.id);
    const overIndex = columns.findIndex((i: any) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? 'right' : 'left',
    });
  };

  return (
    <Card
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      title={
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <Database /> {titleCard}
        </div>
      }
      extra={
        <div
          style={{
            display: 'flex',
            gap: 5,
            alignItems: 'center',
          }}
        >
          {Other}

          {linkAdd && (
            <NavLink to={linkAdd}>
              <Button type="primary" icon={<Plus />}>
                Tambah
              </Button>
            </NavLink>
          )}

          {typeof handleChangeRangeDate === 'function' && (
            <RangePicker onChange={(e) => handleChangeRangeDate?.(e)} />
          )}

          {typeof handleChangeJurnal === 'function' && (
            <Select
              defaultValue="all"
              style={{ width: 180 }}
              onChange={(e) => handleChangeJurnal?.(e)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'penjualan', label: 'Jurnal Penjualan' },
                { value: 'penerimaan', label: 'Jurnal Pembayaran' },
              ]}
            />
          )}

          {typeof handleDownloadExcel === 'function' && (
            <ButtonFile
              onClick={() => handleDownloadExcel?.()}
              icon={<FileExcelOutlined />}
              text="Excle"
            />
          )}
          {typeof handleDownloadPDF === 'function' && (
            <ButtonFile color="danger" onClick={() => handleDownloadPDF?.()} />
          )}
          {Notifikasi}
        </div>
      }
    >
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={columns.map((i: any) => i.key)}
          strategy={horizontalListSortingStrategy}
        >
          <DragIndexContext.Provider value={dragIndex}>
            <Table<DataType>
              rowKey="key"
              scroll={scroll}
              bordered={true}
              columns={columns}
              dataSource={dataSource}
              components={{
                header: { cell: TableHeaderCell },
                body: { cell: TableBodyCell },
              }}
              expandable={expandable as any}
              loading={loading}
              onChange={handleTableChange}
              pagination={false}
              rowClassName={(record, index) => {
                const baseClass = index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
                const customClass = rowClassName ? rowClassName(record, index) : '';
                return `${baseClass} ${customClass}`.trim();
              }}
              onRow={onRow}
            />
          </DragIndexContext.Provider>
        </SortableContext>
        <DragOverlay>
          <th style={{ backgroundColor: 'gray', padding: 16 }}>
            {
              columns[columns.findIndex((i: any) => i.key === dragIndex.active)]
                ?.title as React.ReactNode
            }
          </th>
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
