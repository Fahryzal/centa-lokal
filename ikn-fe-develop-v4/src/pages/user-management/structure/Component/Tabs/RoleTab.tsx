import { Popconfirm, Table, Tooltip } from 'antd';
import { useState } from 'react';
import * as RoleInterfaces from '@pages/user-management/interface/RoleInterfaces';
import { useRoles, useDeleteRole } from '@pages/user-management/hooks/useRoles';
import { Button, Card, Pagination, Space, type TableColumnsType } from 'antd';

import { useAccess } from '@/contexts/AccessContext';
import { Plus } from '@phosphor-icons/react';
import { NavLink, useNavigate } from 'react-router';
import { hasAccessButton } from '@/utils/helper';
import { DeleteOutlined } from '@ant-design/icons';
import { ButtonEditGroup } from '@/components/atoms/button/buttonTableGroups';

export default function RoleTab() {
  const { access } = useAccess();
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({
    page: 1,
    limit: 10,
  });

  // Hooks
  const { data: roleData, isLoading: loadingData } = useRoles(params);
  const deleteRoleMutation = useDeleteRole();

  const handleEdit = (record: RoleInterfaces.DatumType) => {
    navigate(`/user-management/roles/edit/${record.id}`);
  };

  const handleDelete = (id: string) => {
    deleteRoleMutation.mutate(id);
  };

  const columns = (acc: any): TableColumnsType<RoleInterfaces.DatumType> => [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <ButtonEditGroup
              disabled={!hasAccessButton(acc, '/user-management', 'edit')}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            okText="Ya"
            cancelText="Batal"
            onConfirm={() => handleDelete(record.id.toString())}
          >
            <Button
              disabled={
                !hasAccessButton(acc, '/user-management', 'edit') || deleteRoleMutation.isPending
              }
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <NavLink to="/user-management/roles/add">
          <Button
            type="primary"
            icon={<Plus size={18} />}
            disabled={!hasAccessButton(access, '/user-management', 'add')}
          >
            Tambah Data
          </Button>
        </NavLink>
      </div>
      <Table
        columns={columns(access)}
        dataSource={roleData?.data || []}
        loading={loadingData || deleteRoleMutation.isPending}
        pagination={false}
        scroll={{ x: 1000 }}
        rowKey="id"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          current={params.page}
          pageSize={params.limit}
          total={roleData?.total || 0}
          onChange={(page, pageSize) =>
            setParams((prev: any) => ({ ...prev, page, limit: pageSize }))
          }
          showSizeChanger
        />
      </div>
    </Card>
  );
}
