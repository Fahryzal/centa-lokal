import { Card, Typography } from 'antd';
import { useCallback, useState } from 'react';

import { StockTable } from './structure/StockTable';
import { StockMovementChartWithFilter } from './structure/StockMovementChartWithFilter';
import { StockStockTableProductTable } from './structure/StockTableProduct';

import { FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';

const { Title } = Typography;

type ExportHandler = (() => Promise<void>) | null;

interface WarehouseDashboardProps {
  unitId: string;
  rawMaterialUnitIds?: string;
}

export const WarehouseDashboard = ({ unitId, rawMaterialUnitIds }: WarehouseDashboardProps) => {
  // Handler Barang Jadi
  const [exportProductExcelHandler, setExportProductExcelHandler] = useState<ExportHandler>(null);

  const [exportProductPDFHandler, setExportProductPDFHandler] = useState<ExportHandler>(null);

  // Handler Barang Mentah
  const [exportExcelHandler, setExportExcelHandler] = useState<ExportHandler>(null);

  const [exportPDFHandler, setExportPDFHandler] = useState<ExportHandler>(null);

  const handleProductExcelReady = useCallback((handler: ExportHandler) => {
    setExportProductExcelHandler(() => handler);
  }, []);

  const handleProductPDFReady = useCallback((handler: ExportHandler) => {
    setExportProductPDFHandler(() => handler);
  }, []);

  const handleExportExcelReady = useCallback((handler: ExportHandler) => {
    setExportExcelHandler(() => handler);
  }, []);

  const handleExportPDFReady = useCallback((handler: ExportHandler) => {
    setExportPDFHandler(() => handler);
  }, []);

  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>
        📦 Dashboard Gudang
      </Title>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        {/* BARANG JADI */}
        <Card
          title="📑 Daftar Stok Barang Jadi"
          style={{ width: '100%' }}
          extra={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ButtonFile
                color="green"
                icon={<FileExcelOutlined />}
                text="Cetak Excel"
                onClick={() => {
                  void exportProductExcelHandler?.();
                }}
              />

              <ButtonFile
                color="danger"
                icon={<FilePdfOutlined />}
                text="Cetak PDF"
                onClick={() => {
                  void exportProductPDFHandler?.();
                }}
              />
            </div>
          }
        >
          <StockStockTableProductTable
            unitId={unitId}
            onExportReady={handleProductExcelReady}
            onExportPDFReady={handleProductPDFReady}
          />
        </Card>

        {/* BARANG MENTAH */}
        <Card
          title="📑 Daftar Master Barang Mentah"
          style={{ width: '100%' }}
          extra={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ButtonFile
                color="green"
                icon={<FileExcelOutlined />}
                text="Cetak Excel"
                onClick={() => {
                  void exportExcelHandler?.();
                }}
              />

              <ButtonFile
                color="danger"
                icon={<FilePdfOutlined />}
                text="Cetak PDF"
                onClick={() => {
                  void exportPDFHandler?.();
                }}
              />
            </div>
          }
        >
          <StockTable
            unitId={rawMaterialUnitIds ?? unitId}
            onExportReady={handleExportExcelReady}
            onExportPDFReady={handleExportPDFReady}
          />
        </Card>

        {/* GRAFIK */}
        <Card title="📈 Grafik Barang Masuk & Keluar Barang Jadi" style={{ width: '100%' }}>
          <StockMovementChartWithFilter unitId={unitId} />
        </Card>
      </div>
    </>
  );
};
