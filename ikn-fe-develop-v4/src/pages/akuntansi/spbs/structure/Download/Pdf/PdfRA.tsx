import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { SpbsType } from '@pages/akuntansi/spbs/interface/SpbsInterfaces';

interface PdfRAProps {
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
    width: '297mm',
    height: '210mm',
    paddingTop: '6mm',
    paddingRight: '7mm',
    paddingBottom: '4mm',
    paddingLeft: '7mm',
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    color: '#111111',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '13mm',
  },

  companyWrapper: {
    width: '34%',
  },

  company: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 1,
  },

  titleWrapper: {
    width: '42%',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    textAlign: 'center',
  },

  rightHeader: {
    width: '24%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 0,
  },

  raText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -1,
  },

  codeWrapper: {
    alignItems: 'flex-end',
  },

  documentCode: {
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 1.05,
    textAlign: 'right',
  },

  factoryBox: {
    width: '36%',
    height: '9mm',
    borderWidth: 1.3,
    borderColor: '#111111',
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: '-1mm',
    marginBottom: '3mm',
    justifyContent: 'center',
  },

  factoryWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '-1mm',
    marginBottom: '3mm',
  },

  factoryNumber: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: '2mm',
  },

  factoryNumberText: {
    fontSize: 12,
  },

  factoryLeft: {
    width: '60%',
    justifyContent: 'center',
  },

  factoryRight: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  factoryText: {
    fontSize: 12,
  },

  infoWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: '17mm',
  },

  infoLeft: {
    width: '55%',
    paddingRight: '8mm',
  },

  infoRight: {
    width: '45%',
    paddingLeft: '2mm',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '5.5mm',
  },

  infoLabelLeft: {
    width: '31mm',
    fontSize: 12,
  },

  infoLabelRight: {
    width: '20mm',
    fontSize: 12,
  },

  infoValueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  infoValue: {
    fontSize: 12,
    color: '#111111',
    marginRight: 2,
  },

  infoValueLine: {
    flex: 1,
    height: '5mm',
    borderBottomWidth: 0.6,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
  },

  separatorWrapper: {
    width: '100%',
    height: '2.5mm',
    justifyContent: 'space-between',
    marginBottom: '0.5mm',
    marginTop: '1mm',
  },

  separatorLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#111111',
  },

  goodsTable: {
    width: '100%',
  },

  tableRow: {
    flexDirection: 'row',
    width: '100%',
  },

  tableHeader: {
    height: '15mm',
    borderWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: 9,
    lineHeight: 1,
    textAlign: 'center',
  },

  numberCell: {
    height: '4.5mm',
    borderWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9.5,
    textAlign: 'center',
  },

  dataCell: {
    height: '5.7mm',
    borderWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: 9.5,
  },

  colCode: {
    width: '14%',
    textAlign: 'left',
  },

  colName: {
    width: '23%',
    textAlign: 'left',
  },

  colUnit: {
    width: '8%',
    textAlign: 'center',
  },

  colShipped: {
    width: '9%',
    textAlign: 'center',
  },

  colReceived: {
    width: '9%',
    textAlign: 'center',
  },

  colPrice: {
    width: '10%',
    textAlign: 'center',
  },

  colTotal: {
    width: '12%',
    textAlign: 'center',
  },

  colProof: {
    width: '10%',
    textAlign: 'center',
  },

  colLast: {
    width: '5%',
    textAlign: 'center',
  },

  totalCell: {
    height: '9mm',
    borderWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 12,
    letterSpacing: 4,
    textAlign: 'center',
  },

  bottomSeparator: {
    width: '100%',
    height: '2.5mm',
    justifyContent: 'space-between',
  },

  bottomLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#111111',
  },

  bottomSection: {
    flexDirection: 'row',
    height: '33mm',
  },

  shippingSection: {
    width: '40%',
    height: '33mm',
    paddingTop: '1.5mm',
    paddingRight: '5mm',
    paddingBottom: 0,
    paddingLeft: '5mm',
    borderRightWidth: 0.8,
    borderRightColor: '#111111',
  },

  receivedSection: {
    width: '30%',
    paddingTop: '1.5mm',
    paddingRight: '5mm',
    paddingBottom: 0,
    paddingLeft: '5mm',
    borderRightWidth: 0.8,
    borderRightColor: '#111111',
  },

  dateValue: {
    fontSize: 11,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '5mm',
  },

  dateLabel: {
    fontSize: 11,
    marginRight: 4,
  },

  dateLine: {
    flex: 1,
    height: '4mm',
    borderBottomWidth: 0.6,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
  },

  leftSignature: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  leftSignatureLine: {
    width: '55%',
    borderBottomWidth: 0.6,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
    marginTop: '0.5mm',
  },

  signatureName: {
    fontSize: 9,
    textAlign: 'center',
  },

  rightSignature: {
    position: 'absolute',
    bottom: '1mm',
    alignItems: 'flex-start',
    marginRight: 4,
  },

  signatureText: {
    fontSize: 10,
  },

  note: {
    marginTop: '1mm',
    fontSize: 9,
    lineHeight: 1.35,
  },

  noteFirstRow: {
    flexDirection: 'row',
  },

  noteTitle: {
    width: '13mm',
  },

  noteContent: {
    flex: 1,
  },

  noteRow: {
    flexDirection: 'row',
    marginLeft: '13mm',
  },

  noteNumber: {
    width: '13mm',
  },

  noteText: {
    flex: 1,
  },

  footer: {
    marginTop: '0.5mm',
    fontSize: 10,
    fontWeight: 'bold',
  },

  infoColon: {
    width: '5mm',
    fontSize: 12,
    textAlign: 'center',
  },

  securitySection: {
    width: '30%',
    paddingTop: '1.5mm',
    paddingRight: '5mm',
    paddingBottom: 0,
    paddingLeft: '5mm',
    justifyContent: 'space-between',
  },

  securityTitle: {
    alignItems: 'flex-start',
  },

  securitySignature: {
    marginTop: '18mm',
  },
});

export default function PdfRA({ data }: PdfRAProps) {
  const namaAtasan = data.itemsSPB?.[0]?.namaAtasan || '';
  const jabatanAtasan = data.itemsSPB?.[0]?.jabatanAtasan || '';
  const dikirimDengan = data.itemsSPB?.[0]?.dikirimDengan || '';

  const formatDate = (value?: Date | string | null) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('id-ID');
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyWrapper}>
            <Text style={styles.company}>PT. INDUSTRI KARET NUSANTARA</Text>
          </View>

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>SURAT PENGANTAR BARANG</Text>
          </View>

          <View style={styles.rightHeader}>
            <View style={styles.codeWrapper}>
              <Text style={styles.documentCode}>AU - 53 A</Text>

              <Text style={styles.documentCode}>A S L I</Text>
            </View>
          </View>
        </View>

        <View style={styles.factoryWrapper}>
          <View style={styles.factoryBox}>
            <Text style={styles.factoryText}>Kebun / Pabrik : PRTRA</Text>
          </View>

          <View style={styles.factoryNumber}>
            <Text style={styles.factoryNumberText}>No. : {data.noSpb || ''}</Text>
          </View>
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.infoLeft}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabelLeft}>Kepada</Text>

              <Text style={styles.infoColon}>:</Text>

              <View style={styles.infoValueWrapper}>
                {data.customerName ? (
                  <Text style={styles.infoValue}>{data.customerName}</Text>
                ) : (
                  <View style={styles.infoValueLine} />
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabelLeft}>Permintaan No.</Text>

              <Text style={styles.infoColon}>:</Text>

              <View style={styles.infoValueWrapper}>
                <Text style={styles.infoValue}>{data.orderNumber || ' '}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabelLeft}>Dikirim dengan</Text>
              <Text style={styles.infoColon}>:</Text>
              <View style={styles.infoValueWrapper}>
                <Text style={styles.infoValue}>{dikirimDengan || ' '}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRight}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabelRight}>Dari</Text>

              <Text style={styles.infoColon}>:</Text>

              <View style={styles.infoValueWrapper}>
                <Text style={styles.infoValue}>Gudang PRA</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabelRight}>Tgl.</Text>

              <Text style={styles.infoColon}>:</Text>

              <View style={styles.infoValueWrapper}>
                {data.tanggalPengiriman ? (
                  <Text style={styles.infoValue}>{formatDate(data.tanggalPengiriman)}</Text>
                ) : (
                  <View style={styles.infoValueLine} />
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.separatorWrapper}>
          <View style={styles.separatorLine} />
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.goodsTable}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, styles.colCode]}>
              <Text>No.</Text>
              <Text>Kode /</Text>
              <Text>Barang</Text>
            </View>

            <View style={[styles.tableHeader, styles.colName]}>
              <Text>N a m a B a r a n g</Text>
            </View>

            <View style={[styles.tableHeader, styles.colUnit]}>
              <Text>Satuan</Text>
            </View>

            <View style={[styles.tableHeader, styles.colShipped]}>
              <Text>Banyaknya</Text>
              <Text>dikirim</Text>
            </View>

            <View style={[styles.tableHeader, styles.colReceived]}>
              <Text>Banyaknya</Text>
              <Text>diterima</Text>
            </View>

            <View style={[styles.tableHeader, styles.colPrice]}>
              <Text>Harga</Text>
              <Text>Satuan</Text>
            </View>

            <View style={[styles.tableHeader, styles.colTotal]}>
              <Text>Jumlah</Text>
              <Text>Harga</Text>
            </View>

            <View style={[styles.tableHeader, styles.colProof]}>
              <Text>No.</Text>
              <Text>Bukti</Text>
              <Text>Penerimaan</Text>
            </View>

            <View style={[styles.tableHeader, styles.colLast]}>
              <Text />
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.numberCell, styles.colCode]}>
              <Text>1</Text>
            </View>

            <View style={[styles.numberCell, styles.colName]}>
              <Text>2</Text>
            </View>

            <View style={[styles.numberCell, styles.colUnit]}>
              <Text>3</Text>
            </View>

            <View style={[styles.numberCell, styles.colShipped]}>
              <Text>4</Text>
            </View>

            <View style={[styles.numberCell, styles.colReceived]}>
              <Text>5</Text>
            </View>

            <View style={[styles.numberCell, styles.colPrice]}>
              <Text>6</Text>
            </View>

            <View style={[styles.numberCell, styles.colTotal]}>
              <Text>7</Text>
            </View>

            <View style={[styles.numberCell, styles.colProof]}>
              <Text>8</Text>
            </View>

            <View style={[styles.numberCell, styles.colLast]}>
              <Text>9</Text>
            </View>
          </View>

          {data.itemsSPB.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={[styles.dataCell, styles.colCode]}>
                <Text>{item.kodeBarangProduct || ''}</Text>
              </View>

              <View style={[styles.dataCell, styles.colName]}>
                <Text>{item.namabarangProductInvoice || ''}</Text>
              </View>

              <View style={[styles.dataCell, styles.colUnit]}>
                <Text>{item.satuanProduct || ''}</Text>
              </View>

              <View style={[styles.dataCell, styles.colShipped]}>
                <Text>
                  {item.quantity !== null && item.quantity !== undefined
                    ? item.quantity.toLocaleString('id-ID')
                    : ''}
                </Text>
              </View>

              <View style={[styles.dataCell, styles.colReceived]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colPrice]}>
                <Text>
                  {item.priceProduct !== null && item.priceProduct !== undefined
                    ? item.priceProduct.toLocaleString('id-ID')
                    : ''}
                </Text>
              </View>

              <View style={[styles.dataCell, styles.colTotal]}>
                <Text>
                  {item.priceProduct !== null &&
                  item.priceProduct !== undefined &&
                  item.quantity !== null &&
                  item.quantity !== undefined
                    ? (item.priceProduct * item.quantity).toLocaleString('id-ID')
                    : ''}
                </Text>
              </View>

              <View style={[styles.dataCell, styles.colProof]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colLast]}>
                <Text />
              </View>
            </View>
          ))}

          {Array.from({
            length: Math.max(0, 10 - data.itemsSPB.length),
          }).map((_, index) => (
            <View style={styles.tableRow} key={`empty-${index}`}>
              <View style={[styles.dataCell, styles.colCode]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colName]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colUnit]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colShipped]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colReceived]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colPrice]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colTotal]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colProof]}>
                <Text />
              </View>

              <View style={[styles.dataCell, styles.colLast]}>
                <Text />
              </View>
            </View>
          ))}

          <View style={styles.tableRow}>
            <View style={[styles.totalCell, styles.colCode]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colName]}>
              <Text style={styles.totalLabel}>J u m l a h</Text>
            </View>

            <View style={[styles.totalCell, styles.colUnit]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colShipped]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colReceived]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colPrice]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colTotal]}>
              <Text>
                {data.subtotalAmount !== null && data.subtotalAmount !== undefined
                  ? data.subtotalAmount.toLocaleString('id-ID')
                  : ''}
              </Text>
            </View>

            <View style={[styles.totalCell, styles.colProof]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colLast]}>
              <Text />
            </View>
          </View>
        </View>

        <View style={styles.bottomSeparator}>
          <View style={styles.bottomLine} />
          <View style={styles.bottomLine} />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.shippingSection}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Dikirim tgl.</Text>

              <Text style={styles.dateValue}>{formatDateLong(data.tanggalPengiriman)}</Text>
            </View>

            <View style={styles.leftSignature}>
              <Text style={styles.signatureName}>{namaAtasan || ' '}</Text>
              <View style={styles.leftSignatureLine} />
              <Text style={styles.signatureName}>{jabatanAtasan || ' '}</Text>
            </View>
          </View>

          <View style={styles.receivedSection}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Diterima tgl.</Text>

              <Text style={styles.dateValue}>......................................</Text>
            </View>

            <View style={styles.rightSignature}>
              <Text style={styles.signatureText}>({data.customerName})</Text>
            </View>
          </View>

          <View style={styles.securitySection}>
            <View style={styles.securityTitle}>
              <Text style={styles.signatureText}>Keamanan</Text>
            </View>

            <View style={styles.securitySignature}>
              <Text style={styles.signatureText}>(Keamanan)</Text>
            </View>
          </View>
        </View>

        <View style={styles.note}>
          <View style={styles.noteFirstRow}>
            <Text style={styles.noteTitle}>Note</Text>

            <Text style={styles.noteContent}>Lajur 1 s/d 4 diisi bah. Gudang sipengirim</Text>
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteNumber}>5 s/d 8</Text>

            <Text style={styles.noteText}>diisi bah. Pembukuan sipenerima</Text>
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteNumber}>6 s/d 7</Text>

            <Text style={styles.noteText}>diisi bah. Pembukuan sipengirim</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>PT. IKNAU 53 A</Text>
        </View>
      </Page>
    </Document>
  );
}
