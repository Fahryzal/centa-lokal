import { useState } from 'react';
import { Button, Drawer, Space, Form, Card, Row, Col, Tooltip, Input, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Package, Stack, TagChevron, Gauge } from '@phosphor-icons/react';

import ModalBarangJadiIssue from '../ModalBarangJadiIssue/ModalBarangJadiIssue';

interface IssueFormItem {
  finishedGoodId: string;
  kodeBarang: string;
  namaBarang: string;
  kategori?: string;
  quantity: number;
  Satuan: string;
}

interface DrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setDataSourceItems: React.Dispatch<React.SetStateAction<IssueFormItem[]>>;
  formItems: any;
  editingFinishedGoodId: string | null;
  setEditingFinishedGoodId: (id: string | null) => void;
}

export default function DrawerBarangJadiIssue({
  openDrawer,
  setOpenDrawer,
  setDataSourceItems,
  formItems,
  editingFinishedGoodId,
  setEditingFinishedGoodId,
}: DrawerProps) {
  const [openModal, setOpenModal] = useState(false);

  const onClose = () => {
    setOpenDrawer(false);
    setOpenModal(false);
    formItems.resetFields();
    setEditingFinishedGoodId(null);
  };

  const handleRowDoubleClick = (record: any) => {
    formItems.setFieldsValue({
      finishedGoodId: record.finishedGoodId ?? record.id,
      kodeBarang: record.kodeBarang,
      namaBarang: record.namaBarang,
      kategori: record.kategori,
      Satuan: record.satuan ?? record.Satuan ?? '',
    });

    setOpenModal(false);
  };

  const onFinishItems = (values: any) => {
    const newItem: IssueFormItem = {
      finishedGoodId: values.finishedGoodId,
      kodeBarang: values.kodeBarang,
      namaBarang: values.namaBarang,
      kategori: values.kategori,
      quantity: Number(values.quantity),
      Satuan: values.Satuan,
    };

    setDataSourceItems((prev) => {
      // EDIT: ganti item lama dengan item hasil edit.
      if (editingFinishedGoodId) {
        return prev.map((item) => (item.finishedGoodId === editingFinishedGoodId ? newItem : item));
      }

      // ADD: jika barang sudah ada, perbarui baris tersebut.
      const index = prev.findIndex((item) => item.finishedGoodId === newItem.finishedGoodId);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newItem;
        return updated;
      }

      // Tambahkan barang baru.
      return [...prev, newItem];
    });

    formItems.resetFields();
    setEditingFinishedGoodId(null);
    setOpenModal(false);
    setOpenDrawer(false);
  };

  return (
    <>
      <Drawer
        title="Input Item Pengeluaran Barang"
        placement="right"
        width={500}
        onClose={onClose}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={onClose}>Batal</Button>
            <Button type="primary" onClick={() => formItems.submit()}>
              Simpan
            </Button>
          </Space>
        }
      >
        {openModal && (
          <ModalBarangJadiIssue
            open={openModal}
            setOpen={setOpenModal}
            handleRowDoubleClick={handleRowDoubleClick}
          />
        )}

        <Form layout="vertical" form={formItems} name="issueItems" onFinish={onFinishItems}>
          <Card title="Item Barang" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Row gutter={16}>
              <Col xs={24}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item
                    name="finishedGoodId"
                    hidden
                    rules={[
                      {
                        required: true,
                        message: 'Pilih barang terlebih dahulu!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Kode Barang"
                    name="kodeBarang"
                    style={{ flex: 1 }}
                    rules={[
                      {
                        required: true,
                        message: 'Pilih barang terlebih dahulu!',
                      },
                    ]}
                  >
                    <Input prefix={<TagChevron />} disabled placeholder="Kode Barang" />
                  </Form.Item>

                  <Tooltip title="Pilih Barang">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<SearchOutlined />}
                      style={{ marginTop: 30 }}
                      onClick={() => setOpenModal(true)}
                    />
                  </Tooltip>
                </div>

                <Form.Item
                  label="Nama Barang"
                  name="namaBarang"
                  rules={[
                    {
                      required: true,
                      message: 'Pilih barang terlebih dahulu!',
                    },
                  ]}
                >
                  <Input prefix={<Package size={16} />} disabled placeholder="Nama Barang" />
                </Form.Item>

                <Form.Item label="Kategori" name="kategori">
                  <Input disabled placeholder="Kategori" />
                </Form.Item>

                <Form.Item
                  label="Jumlah Dikeluarkan"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: 'Masukkan jumlah barang!',
                    },
                    {
                      validator: (_, value) => {
                        if (value === null || value === undefined || value === '') {
                          return Promise.resolve();
                        }

                        if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
                          return Promise.reject(new Error('Jumlah harus lebih besar dari 0!'));
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    controls={false}
                    style={{ width: '100%' }}
                    prefix={<Stack size={16} />}
                    placeholder="Jumlah Dikeluarkan"
                    decimalSeparator=","
                    step={0.0001}
                    precision={4}
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  label="Satuan"
                  name="Satuan"
                  rules={[
                    {
                      required: true,
                      message: 'Satuan barang belum tersedia!',
                    },
                  ]}
                >
                  <Input prefix={<Gauge size={16} />} disabled placeholder="Satuan" />
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}
            >
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: 150 }}>
                  Simpan Item
                </Button>
              </Form.Item>
            </div>
          </Card>
        </Form>
      </Drawer>
    </>
  );
}
