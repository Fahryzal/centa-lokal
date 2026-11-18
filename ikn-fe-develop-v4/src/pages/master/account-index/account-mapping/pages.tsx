import { Card, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Input, Popconfirm } from 'antd';
import React from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as AccountMappingAxios from '@/pages/master/account-index/account-mapping/service/AccountMappingAxios';
import { showNotification } from '@/contexts/services/notificationService';
import * as AccountAxios from '@pages/master/account-index/account/service/AccountAxios';

interface MappingAccount {
  id: string;
  module: string;
  transactionType: string;
  position: string;
  usage: string;
  accountCode: string;
  deletedAt: string | null;
}

export default function AccountMappingPage() {
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    kode: null,
    nama: null,
    total: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await AccountMappingAxios.fetchDataAccountMapping(dataTable as any);

      setTable((prev) => ({
        ...prev,
        data: res?.data.data.data as any,
        loading: false,
        total: res?.data.data.totalData,
      }));
    };
    fetch();
  }, [dataTable.page, dataTable.nama, dataTable.kode]);

  const [editingKey, setEditingKey] = useState<string>('');
  const [form] = Form.useForm();
  const [accountOptions, setAccountOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await AccountAxios.fetchDataAccount(dataTable as any);
      const convertRes = res?.data.data.data.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));

      setAccountOptions(convertRes);
    };
    fetch();
  }, []);

  const isEditing = (record: MappingAccount) => record.id === editingKey;

  const edit = (record: MappingAccount) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: string) => {
    try {
      const row = await form.validateFields();
      await AccountMappingAxios.updateAccountMapping(id, row); // update ke backend
      setTable((prev: any) => ({
        ...prev,
        data: prev.data.map((parent: any) => ({
          ...parent,
          children: parent.children.map((child: any) =>
            child.id === id ? { ...child, ...row } : child
          ),
        })),
      }));
      setEditingKey('');
      showNotification('success', 'Berhasil', 'Data Berhasil di Ubah');
    } catch (err) {
      showNotification('error', 'Gagal', 'Data Gagal di Ubah');
    }
  };

  const EditableCell: React.FC<any> = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
  }) => {
    let inputNode;
    if (inputType === 'select') {
      inputNode = <Select options={accountOptions} />;
    } else {
      inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please input ${title}!` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const childColumns = [
    { title: 'Position', dataIndex: 'position' },
    { title: 'Usage', dataIndex: 'usage' },
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      editable: true,
      inputType: 'select',
    },
    {
      title: 'Actions',
      render: (_: any, record: MappingAccount) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Batal edit?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedChildColumns = childColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: MappingAccount) => ({
        record,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const mainColumns: ColumnsType<any> = [
    {
      title: 'Module - Tipe Transaksi',
      dataIndex: 'key',
    },
  ];

  return (
    <>
      <Table
        columns={mainColumns}
        expandable={{
          expandedRowRender: (record) => (
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                columns={mergedChildColumns}
                dataSource={record.children}
                rowKey="id"
                pagination={false}
              />
            </Form>
          ),

          rowExpandable: (record) => record.children?.length > 0,
        }}
        dataSource={dataTable.data}
        rowKey="key"
      />

      <Card
        style={{
          backgroundColor: 'white',
          padding: 0,
          textAlign: 'center',
          marginTop: 10,
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      ></Card>
    </>
  );
}
