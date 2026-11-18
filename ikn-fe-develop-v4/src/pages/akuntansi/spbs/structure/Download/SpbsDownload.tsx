import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { pdf } from '@react-pdf/renderer';

import PdfRA from './Pdf/PdfRA';
import PdfRN from './Pdf/PdfRN';
import PdfRNEkspor from './Pdf/PdfRNEkspor';

import * as SpbsAxios from '@pages/akuntansi/spbs/service/SpbsAxios';
import type { SpbsType } from '@pages/akuntansi/spbs/interface/SpbsInterfaces';

interface SpbsDownloadProps {
  id?: string;
}

export default function SpbsDownload({ id }: SpbsDownloadProps) {
  const handlePreview = async () => {
    if (!id) {
      message.error('ID SPBS tidak ditemukan');
      return;
    }

    try {
      message.loading({
        content: 'Menyiapkan PDF...',
        key: 'download-pdf',
      });

      const data: SpbsType | undefined = await SpbsAxios.fetchDataSpbsById(id);

      if (!data) {
        throw new Error('Data SPBS tidak ditemukan');
      }

      let blob: Blob;

      switch (data.typeSalesSPb) {
        case 'RA': {
          blob = await pdf(<PdfRA data={data} />).toBlob();
          break;
        }

        case 'RN': {
          blob = await pdf(<PdfRN data={data} />).toBlob();
          break;
        }

        case 'RN_EKSPOR': {
          blob = await pdf(<PdfRNEkspor data={data} />).toBlob();
          break;
        }

        default:
          throw new Error(`Tipe SPB tidak dikenali: ${data.typeSalesSPb}`);
      }

      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');

      message.success({
        content: 'PDF berhasil dibuat',
        key: 'download-pdf',
      });
    } catch (error) {
      console.error('Gagal membuat PDF:', error);

      message.error({
        content: 'Gagal membuat PDF',
        key: 'download-pdf',
      });
    }
  };

  return (
    <Button type="primary" icon={<DownloadOutlined />} onClick={handlePreview}>
      Download PDF
    </Button>
  );
}
