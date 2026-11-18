import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { SpbsType } from '@pages/akuntansi/spbs/interface/SpbsInterfaces';

interface PdfRNEksporProps {
  data: SpbsType;
}

const formatDateLong = (date: Date | string | null | undefined) => {
  if (!date) return '';

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const d = new Date(date);

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const styles = StyleSheet.create({
  page: {
    width: '595.28pt',
    height: '841.89pt',
    padding: 0,
    margin: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 8,
    position: 'relative',
  },

  companyName: {
    position: 'absolute',
    left: 27,
    top: 18,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },

  factoryName: {
    position: 'absolute',
    left: 27,
    top: 31,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },

  title: {
    position: 'absolute',
    left: 222,
    top: 51,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
  },

  infoLabel: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  infoColon: {
    position: 'absolute',
    fontSize: 8,
  },

  dotText: {
    position: 'absolute',
    fontSize: 8,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
  },

  kontrakLabel: {
    left: 27,
    top: 81,
  },

  kontrakColon: {
    left: 95,
    top: 81,
  },

  kontrakDots: {
    left: 105,
    top: 79,
    width: 202,
  },

  kontainerLabel: {
    left: 27,
    top: 95,
  },

  kontainerColon: {
    left: 95,
    top: 95,
  },

  kontainerDots: {
    left: 105,
    top: 93,
    width: 202,
  },

  motorLabel: {
    left: 27,
    top: 109,
  },

  motorColon: {
    left: 95,
    top: 109,
  },

  motorDots: {
    left: 105,
    top: 107,
    width: 202,
  },

  penerimaLabel: {
    left: 27,
    top: 123,
  },

  penerimaColon: {
    left: 95,
    top: 123,
  },

  penerimaDots: {
    left: 105,
    top: 121,
    width: 195,
  },

  atNoLabel: {
    left: 320,
    top: 81,
  },

  atNoColon: {
    left: 365,
    top: 81,
  },

  atNoDots: {
    left: 376,
    top: 79,
    width: 170,
  },

  exPerKapalLabel: {
    left: 320,
    top: 95,
  },

  exPerKapalColon: {
    left: 390,
    top: 95,
  },

  exPerKapalDots: {
    left: 401,
    top: 93,
    width: 145,
  },

  tanggalLabel: {
    left: 320,
    top: 109,
  },

  tanggalColon: {
    left: 365,
    top: 109,
  },

  tanggalDots: {
    left: 376,
    top: 107,
    width: 170,
  },

  gudangLabel: {
    left: 320,
    top: 123,
  },

  gudangColon: {
    left: 365,
    top: 123,
  },

  gudangDots: {
    left: 376,
    top: 121,
    width: 170,
  },

  table: {
    position: 'absolute',
    left: 26,
    top: 134,
    width: 548,
    height: 140,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },

  tableLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  tableHeader: {
    position: 'absolute',
    left: 0,
    top: 40,
    width: 548,
    height: 1,
    backgroundColor: '#000000',
  },

  vertical1: {
    position: 'absolute',
    left: 32,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical2: {
    position: 'absolute',
    left: 181,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical3: {
    position: 'absolute',
    left: 224,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical4: {
    position: 'absolute',
    left: 337,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical5: {
    position: 'absolute',
    left: 407,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical6: {
    position: 'absolute',
    left: 470,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  vertical7: {
    position: 'absolute',
    left: 548,
    top: 0,
    width: 1,
    height: 140,
    backgroundColor: '#000000',
  },

  noRekg1: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 32,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  noRekg2: {
    position: 'absolute',
    left: 0,
    top: 19,
    width: 32,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  namaBarang: {
    position: 'absolute',
    left: 32,
    top: 14,
    width: 149,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  satuan: {
    position: 'absolute',
    left: 181,
    top: 14,
    width: 43,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  jumlahPengiriman: {
    position: 'absolute',
    left: 224,
    top: 4,
    width: 113,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  shipmentHeaderDivider: {
    position: 'absolute',
    left: 224,
    top: 17,
    width: 113,
    height: 1,
    backgroundColor: '#000000',
  },

  shipmentDivider: {
    position: 'absolute',
    left: 280,
    top: 17,
    width: 1,
    height: 23,
    backgroundColor: '#000000',
  },

  shipmentDataDivider: {
    position: 'absolute',
    left: 280,
    top: 40,
    width: 1,
    height: 100,
    backgroundColor: '#000000',
  },

  dikirim1: {
    position: 'absolute',
    left: 224,
    top: 19,
    width: 56,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  kg1: {
    position: 'absolute',
    left: 224,
    top: 29,
    width: 56,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  dikirim2: {
    position: 'absolute',
    left: 280,
    top: 19,
    width: 57,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  kg2: {
    position: 'absolute',
    left: 280,
    top: 29,
    width: 57,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  harga1: {
    position: 'absolute',
    left: 337,
    top: 8,
    width: 70,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  harga2: {
    position: 'absolute',
    left: 337,
    top: 19,
    width: 70,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  jumlah1: {
    position: 'absolute',
    left: 407,
    top: 8,
    width: 63,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  jumlah2: {
    position: 'absolute',
    left: 407,
    top: 19,
    width: 63,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  ket: {
    position: 'absolute',
    left: 470,
    top: 14,
    width: 78,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  konsenLabel: {
    position: 'absolute',
    left: 38,
    top: 125,
    fontSize: 8,
  },

  konsenDots: {
    position: 'absolute',
    left: 94,
    top: 123,
    fontSize: 8,
    letterSpacing: 0.5,
  },

  beratLabel: {
    position: 'absolute',
    left: 73,
    top: 278,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  beratDots: {
    position: 'absolute',
    left: 100,
    top: 278,
    fontSize: 8,
  },

  beratKg: {
    position: 'absolute',
    left: 140,
    top: 278,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  beratBottomLine: {
    position: 'absolute',
    left: 26,
    top: 294,
    width: 548,
    height: 1,
    backgroundColor: '#000000',
  },

  tandaTanganSupir: {
    position: 'absolute',
    left: 26,
    top: 301,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  supirKenek: {
    position: 'absolute',
    left: 26,
    top: 312,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  tandaTanganPenerima: {
    position: 'absolute',
    left: 260,
    top: 301,
    width: 100,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  penerimaText: {
    position: 'absolute',
    left: 260,
    top: 312,
    width: 100,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  seiBamban: {
    position: 'absolute',
    left: 408,
    top: 301,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  seiBambanDots: {
    position: 'absolute',
    left: 467,
    top: 299,
    fontSize: 8,
    letterSpacing: 0.5,
  },

  tglLabel: {
    position: 'absolute',
    left: 26,
    top: 330,
    fontSize: 8,
  },

  tglColon: {
    position: 'absolute',
    left: 49,
    top: 330,
    fontSize: 8,
  },

  tglDots: {
    position: 'absolute',
    left: 58,
    top: 328,
    fontSize: 8,
    letterSpacing: 0.5,
  },

  jamLabel: {
    position: 'absolute',
    left: 26,
    top: 345,
    fontSize: 8,
  },

  jamColon: {
    position: 'absolute',
    left: 49,
    top: 345,
    fontSize: 8,
  },

  jamDots: {
    position: 'absolute',
    left: 58,
    top: 343,
    fontSize: 8,
    letterSpacing: 0.5,
  },

  companyBottom: {
    position: 'absolute',
    left: 424,
    top: 321,
    width: 150,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  factoryBottom: {
    position: 'absolute',
    left: 424,
    top: 332,
    width: 150,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  signatureLine: {
    position: 'absolute',
    left: 432,
    top: 391,
    width: 128,
    height: 1,
    backgroundColor: '#000000',
  },

  namaAtasan: {
    position: 'absolute',
    left: 450,
    top: 380,
    width: 128,
  },

  jabatanAtasan: {
    position: 'absolute',
    left: 450,
    top: 394,
    width: 128,
  },

  legend: {
    position: 'absolute',
    left: 26,
    top: 365,
  },

  legendRow: {
    height: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendLabel: {
    width: 34,
    fontSize: 8,
  },

  legendColon: {
    width: 9,
    fontSize: 8,
  },

  legendText: {
    fontSize: 8,
  },

  tableDataCode: {
    position: 'absolute',
    left: 0,
    width: 32,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataName: {
    position: 'absolute',
    left: 32,
    top: 0,
    width: 149,
    fontSize: 8,
    textAlign: 'left',
    paddingLeft: 5,
  },

  tableDataUnit: {
    position: 'absolute',
    left: 181,
    width: 43,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataShipped: {
    position: 'absolute',
    left: 224,
    width: 56,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataReceived: {
    position: 'absolute',
    left: 280,
    width: 57,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataPrice: {
    position: 'absolute',
    left: 337,
    width: 70,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataTotal: {
    position: 'absolute',
    left: 407,
    width: 63,
    fontSize: 8,
    textAlign: 'center',
  },

  tableDataKet: {
    position: 'absolute',
    left: 470,
    width: 78,
    fontSize: 8,
    textAlign: 'center',
  },
});

export default function PdfRNEkspor({ data }: PdfRNEksporProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.companyName}>PT. INDUSTRI KARET NUSANTARA</Text>

        <Text style={styles.factoryName}>PABRIK RESIPRENE SEI BAMBAN</Text>

        <Text style={styles.title}>SURAT PENGANTAR BARANG</Text>

        <Text style={[styles.infoLabel, styles.kontrakLabel]}>Kontrak No.</Text>

        <Text style={[styles.infoColon, styles.kontrakColon]}>:</Text>

        <Text style={[styles.dotText, styles.kontrakDots]}>{data.orderNumber || ''}</Text>

        <Text style={[styles.infoLabel, styles.kontainerLabel]}>Kontainer No.</Text>

        <Text style={[styles.infoColon, styles.kontainerColon]}>:</Text>

        <Text style={[styles.dotText, styles.kontainerDots]}>
          ........................................................................
        </Text>

        <Text style={[styles.infoLabel, styles.motorLabel]}>Motor BK.</Text>

        <Text style={[styles.infoColon, styles.motorColon]}>:</Text>

        <Text style={[styles.dotText, styles.motorDots]}>
          {data.itemsSPB?.[0]?.dikirimDengan ||
            '........................................................................'}
        </Text>

        <Text style={[styles.infoLabel, styles.penerimaLabel]}>Penerima</Text>

        <Text style={[styles.infoColon, styles.penerimaColon]}>:</Text>

        <Text style={[styles.dotText, styles.penerimaDots, { letterSpacing: 0 }]}>
          {data.customerName || '........................................................'}
        </Text>

        <Text style={[styles.infoLabel, styles.atNoLabel]}>At No.</Text>

        <Text style={[styles.infoColon, styles.atNoColon]}>:</Text>

        <Text style={[styles.dotText, styles.atNoDots]}>
          ........................................
        </Text>

        <Text style={[styles.infoLabel, styles.exPerKapalLabel]}>Ex/Per.Kapal</Text>

        <Text style={[styles.infoColon, styles.exPerKapalColon]}>:</Text>

        <Text style={[styles.dotText, styles.exPerKapalDots]}>
          ........................................
        </Text>

        <Text style={[styles.infoLabel, styles.tanggalLabel]}>Tgl.</Text>

        <Text style={[styles.infoColon, styles.tanggalColon]}>:</Text>

        <Text style={[styles.dotText, styles.tanggalDots, { letterSpacing: 0 }]}>
          {data.tanggalPengiriman
            ? formatDateLong(data.tanggalPengiriman)
            : '........................................'}
        </Text>

        <Text style={[styles.infoLabel, styles.gudangLabel]}>Gudang</Text>

        <Text style={[styles.infoColon, styles.gudangColon]}>:</Text>

        <Text style={[styles.dotText, styles.gudangDots]}>Gudang PRN</Text>

        <View style={styles.table}>
          <View style={styles.tableLeftBorder} />
          <View style={styles.tableHeader} />

          <View style={styles.vertical1} />
          <View style={styles.vertical2} />
          <View style={styles.vertical3} />
          <View style={styles.vertical4} />
          <View style={styles.vertical5} />
          <View style={styles.vertical6} />
          <View style={styles.vertical7} />

          <Text style={styles.noRekg1}>No.</Text>

          <Text style={styles.noRekg2}>Rekg.</Text>

          <Text style={styles.namaBarang}>Nama Barang</Text>

          <Text style={styles.satuan}>Satuan</Text>

          <Text style={styles.jumlahPengiriman}>Jumlah Pengiriman</Text>

          <View style={styles.shipmentHeaderDivider} />

          <View style={styles.shipmentDivider} />
          <View style={styles.shipmentDataDivider} />

          <Text style={styles.dikirim1}>Dikirim</Text>

          <Text style={styles.kg1}>Kg.</Text>

          <Text style={styles.dikirim2}>Dikirim</Text>

          <Text style={styles.kg2}>Kg.</Text>

          <Text style={styles.harga1}>Harga</Text>

          <Text style={styles.harga2}>Satuan</Text>

          <Text style={styles.jumlah1}>Jumlah</Text>

          <Text style={styles.jumlah2}>Harga</Text>

          <Text style={styles.ket}>Ket. / LL</Text>

          {data.itemsSPB?.map((item, index) => {
            const top = 47 + index * 11;

            return [
              <Text key={`code-${item.id}`} style={[styles.tableDataCode, { top }]}>
                {item.kodeBarangProduct || ''}
              </Text>,

              <Text key={`name-${item.id}`} style={[styles.tableDataName, { top }]}>
                {item.namabarangProductInvoice || ''}
              </Text>,

              <Text key={`unit-${item.id}`} style={[styles.tableDataUnit, { top }]}>
                {item.satuanProduct || ''}
              </Text>,

              <Text key={`shipped-${item.id}`} style={[styles.tableDataShipped, { top }]}>
                {item.quantity !== null && item.quantity !== undefined
                  ? item.quantity.toLocaleString('id-ID')
                  : ''}
              </Text>,

              <Text key={`received-${item.id}`} style={[styles.tableDataReceived, { top }]}>
                {item.quantity !== null && item.quantity !== undefined
                  ? item.quantity.toLocaleString('id-ID')
                  : ''}
              </Text>,

              <Text key={`price-${item.id}`} style={[styles.tableDataPrice, { top }]}>
                {item.priceProduct !== null && item.priceProduct !== undefined
                  ? item.priceProduct.toLocaleString('id-ID')
                  : ''}
              </Text>,

              <Text key={`total-${item.id}`} style={[styles.tableDataTotal, { top }]}>
                {item.priceProduct !== null &&
                item.priceProduct !== undefined &&
                item.quantity !== null &&
                item.quantity !== undefined
                  ? (item.priceProduct * item.quantity).toLocaleString('id-ID')
                  : ''}
              </Text>,

              <Text key={`ket-${item.id}`} style={[styles.tableDataKet, { top }]}>
                {item.namabarangProductInvoice || ''}
              </Text>,
            ];
          })}

          <Text style={styles.konsenLabel}>Konsen No.</Text>

          <Text style={styles.konsenDots}>.............................</Text>
        </View>

        <Text style={styles.beratLabel}>Berat</Text>

        <Text style={styles.beratDots}>
          {data.itemsSPB
            ?.reduce((total, item) => total + (item.quantity || 0), 0)
            .toLocaleString('id-ID')}
        </Text>

        <Text style={styles.beratKg}>Kg</Text>

        <View style={styles.beratBottomLine} />

        <Text style={styles.tandaTanganSupir}>Tanda Tangan</Text>

        <Text style={styles.supirKenek}>Supir / Kenek</Text>

        <Text style={styles.tandaTanganPenerima}>Tanda Tangan</Text>

        <Text style={styles.penerimaText}>Penerima</Text>

        <Text style={styles.seiBamban}>Sei Bamban,</Text>

        <Text style={styles.seiBambanDots}>........................................</Text>

        <Text style={styles.tglLabel}>Tgl</Text>

        <Text style={styles.tglColon}>:</Text>

        <Text style={styles.tglDots}>....................................................</Text>

        <Text style={styles.jamLabel}>Jam</Text>

        <Text style={styles.jamColon}>:</Text>

        <Text style={styles.jamDots}>....................................................</Text>

        <Text style={styles.companyBottom}>PT. INDUSTRI KARET NUSANTARA</Text>

        <Text style={styles.factoryBottom}>PABRIK RESIPRENE SEI BAMBAN</Text>

        <Text style={styles.namaAtasan}>
          {data.itemsSPB?.[0]?.namaAtasan || 'Tidak ada Nama atasan'}
        </Text>
        <Text style={styles.jabatanAtasan}>
          {data.itemsSPB?.[0]?.jabatanAtasan || 'Tidak ada jabatan atasan'}
        </Text>
        <View style={styles.signatureLine} />

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>Asli</Text>

            <Text style={styles.legendColon}>:</Text>

            <Text style={styles.legendText}>Putih - Ybs</Text>
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>Lbr. 2</Text>

            <Text style={styles.legendColon}>:</Text>

            <Text style={styles.legendText}>Kuning - Pembukuan</Text>
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>Lbr. 3</Text>

            <Text style={styles.legendColon}>:</Text>

            <Text style={styles.legendText}>Merah - Ktr. KTU</Text>
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>Lbr. 4</Text>

            <Text style={styles.legendColon}>:</Text>

            <Text style={styles.legendText}>Biru - Gudang</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
