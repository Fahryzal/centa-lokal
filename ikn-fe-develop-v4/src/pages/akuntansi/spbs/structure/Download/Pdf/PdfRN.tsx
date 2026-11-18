import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { SpbsType } from '@pages/akuntansi/spbs/interface/SpbsInterfaces';

interface PdfRNProps {
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
    width: '210mm',
    height: '297mm',
    paddingTop: '7mm',
    paddingRight: '8mm',
    paddingBottom: '5mm',
    paddingLeft: '8mm',
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    color: '#111111',
  },

  headerTopCode: {
    height: '5mm',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  headerTopCodeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    width: '100%',
    height: '18mm',
  },

  companyBox: {
    width: '30%',
    height: '18mm',
    borderWidth: 0.8,
    borderColor: '#111111',
    paddingTop: '2mm',
    paddingLeft: '2mm',
    paddingRight: '2mm',
    justifyContent: 'center',
  },

  companyName: {
    fontSize: 8.5,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.05,
  },

  factoryName: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.05,
    marginTop: 2,
  },

  titleBox: {
    width: '31%',
    height: '18mm',
    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
  },

  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rightHeader: {
    width: '39%',
    height: '18mm',
    borderWidth: 0.8,
    borderColor: '#111111',
    flexDirection: 'column',
    position: 'relative',
  },

  rightHeaderTop: {
    height: '7mm',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5mm',
    paddingRight: '2mm',
  },

  rightHeaderLabel: {
    width: '15mm',
    fontSize: 9,
    fontWeight: 'bold',
  },

  rightHeaderColon: {
    width: '4mm',
    fontSize: 9,
    fontWeight: 'bold',
  },

  rightHeaderLine: {
    flex: 1,
    height: '4mm',
    borderBottomWidth: 0.5,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
  },

  documentNumber: {
    position: 'absolute',
    right: '3mm',
    top: '-5mm',
    fontSize: 10,
    color: '#9b3d45',
    fontWeight: 'bold',
  },

  infoSection: {
    width: '100%',
    height: '20mm',
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: '#111111',
    paddingTop: '2mm',
    paddingLeft: '2mm',
    paddingRight: '2mm',
  },

  infoRow: {
    flexDirection: 'row',
    height: '8mm',
    alignItems: 'center',
  },

  infoLeft: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '5mm',
  },

  infoRight: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5mm',
  },

  infoLabel: {
    fontSize: 10,
    width: '27mm',
  },

  infoLabelRight: {
    fontSize: 10,
    width: '29mm',
  },

  infoColon: {
    width: '4mm',
    fontSize: 10,
  },

  infoDotted: {
    flex: 1,
    height: '4mm',
    borderBottomWidth: 0.6,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
  },

  infoValue: {
    flex: 1,
    fontSize: 10,
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
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: 8,
    lineHeight: 1,
    textAlign: 'center',
  },

  tableHeaderLast: {
    borderRightWidth: 0.7,
  },

  numberCell: {
    height: '5mm',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9,
    textAlign: 'center',
  },

  numberCellLast: {
    borderRightWidth: 0.7,
  },

  dataCell: {
    height: '6.2mm',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: 9,
    textAlign: 'center',
  },

  dataCellLast: {
    borderRightWidth: 0.7,
  },

  colCode: {
    width: '8%',
  },

  colName: {
    width: '30%',
  },

  colUnit: {
    width: '7%',
  },

  colShipped: {
    width: '8%',
  },

  colReceived: {
    width: '8%',
  },

  colPrice: {
    width: '10%',
  },

  colProof: {
    width: '16%',
  },

  colDescription: {
    width: '13%',
  },

  totalCell: {
    height: '9mm',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  totalCellLast: {
    borderRightWidth: 0.7,
  },

  totalLabel: {
    fontSize: 11,
    letterSpacing: 3,
    textAlign: 'center',
  },

  bottomSection: {
    width: '100%',
    marginTop: '0.5mm',
  },

  bottomTopRow: {
    flexDirection: 'row',
    width: '100%',
    height: '10mm',
  },

  bottomCell: {
    borderLeftWidth: 0.7,
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    paddingTop: '1mm',
    paddingLeft: '1.5mm',
    paddingRight: '1.5mm',
  },

  bottomCellLast: {
    borderRightWidth: 0.7,
  },

  bottomTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    lineHeight: 1.05,
    textAlign: 'center',
  },

  bottomLine: {
    flex: 1,
    height: '4mm',
    borderBottomWidth: 0.5,
    borderBottomColor: '#111111',
    borderBottomStyle: 'dotted',
    marginLeft: 3,
  },

  bottomColumn1: {
    width: '30%',
  },

  bottomColumn2: {
    width: '22%',
  },

  bottomColumn3: {
    width: '27%',
  },

  bottomColumn4: {
    width: '21%',
  },

  bottomSecondRow: {
    flexDirection: 'row',
    width: '100%',
    height: '25mm',
  },

  warehouseCell: {
    width: '30%',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '1mm',
  },

  warehouseText: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  blankBottomCell: {
    width: '22%',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
  },

  blankBottomCell2: {
    width: '27%',
    borderLeftWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
  },

  blankBottomCell3: {
    width: '21%',
    borderLeftWidth: 0.7,
    borderRightWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#111111',
  },

  note: {
    marginTop: '2mm',
    paddingLeft: '3mm',
    fontSize: 9,
    lineHeight: 1.35,
  },

  noteTitle: {
    fontWeight: 'bold',
  },

  noteRow: {
    flexDirection: 'row',
  },

  noteLabel: {
    width: '30mm',
  },

  footerLine: {
    marginTop: '2mm',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
  },

  footer: {
    marginTop: '1mm',
    fontSize: 8,
  },
});

export default function PdfRN({ data }: PdfRNProps) {
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.headerTopCode}>
          <Text style={styles.headerTopCodeText}>AU-58.02</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.companyBox}>
            <Text style={styles.companyName}>PT. INDUSTRI KARET NUSANTARA</Text>

            <Text style={styles.factoryName}>(IKN)</Text>

            <Text style={styles.factoryName}>PABRIK RESIPRENE SEI BAMBAN</Text>
          </View>

          <View style={styles.titleBox}>
            <Text style={styles.title}>SURAT PENGANTAR BARANG</Text>
          </View>

          <View style={styles.rightHeader}>
            <View style={styles.rightHeaderTop}>
              <Text style={styles.rightHeaderLabel}>A</Text>

              <Text style={styles.rightHeaderColon}>:</Text>

              <View style={styles.rightHeaderLine} />
            </View>

            <View style={styles.rightHeaderTop}>
              <Text style={styles.rightHeaderLabel}>Tanggal</Text>

              <Text style={styles.rightHeaderColon}>:</Text>

              {data.tanggalPengiriman ? (
                <Text style={{ fontSize: 9 }}>{formatDateLong(data.tanggalPengiriman)}</Text>
              ) : (
                <View style={styles.rightHeaderLine} />
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>Kepada</Text>

              <Text style={styles.infoColon}>:</Text>

              {data.customerName ? (
                <Text style={styles.infoValue}>{data.customerName}</Text>
              ) : (
                <View style={styles.infoDotted} />
              )}
            </View>

            <View style={styles.infoRight}>
              <Text style={styles.infoLabelRight}>Permintaan No.</Text>

              <Text style={styles.infoColon}>:</Text>

              <Text style={styles.infoValue}>
                {data.orderNumber || '........................................................'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>Dikirim dengan</Text>

              <Text style={styles.infoColon}>:</Text>

              <Text style={styles.infoValue}>
                {data.itemsSPB?.[0]?.dikirimDengan ||
                  '........................................................'}
              </Text>
            </View>

            <View style={styles.infoRight}>
              <Text style={styles.infoLabelRight}>Dari</Text>

              <Text style={styles.infoColon}>:</Text>

              <Text style={styles.infoValue}>PT. INDUSTRI KARET NUSANTARA</Text>
            </View>
          </View>
        </View>

        <View style={styles.goodsTable}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, styles.colCode]}>
              <Text>No.</Text>
              <Text>Gol</Text>
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

            <View style={[styles.tableHeader, styles.colProof]}>
              <Text>No.</Text>
              <Text>Bukti</Text>
              <Text>Penerimaan</Text>
            </View>

            <View style={[styles.tableHeader, styles.colDescription, styles.tableHeaderLast]}>
              <Text>Keterangan</Text>
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
              <Text />
            </View>

            <View style={[styles.numberCell, styles.colProof]}>
              <Text>6</Text>
            </View>

            <View style={[styles.numberCell, styles.colDescription, styles.numberCellLast]}>
              <Text>7</Text>
            </View>
          </View>

          {Array.from({
            length: Math.max(data.itemsSPB?.length || 0, 10),
          }).map((_, index) => {
            const item = data.itemsSPB?.[index];

            return (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.dataCell, styles.colCode]}>
                  <Text>{item?.kodeBarangProduct || ''}</Text>
                </View>

                <View style={[styles.dataCell, styles.colName]}>
                  <Text>{item?.namabarangProductInvoice || ''}</Text>
                </View>

                <View style={[styles.dataCell, styles.colUnit]}>
                  <Text>{item?.satuanProduct || ''}</Text>
                </View>

                <View style={[styles.dataCell, styles.colShipped]}>
                  <Text>
                    {item?.quantity !== null && item?.quantity !== undefined
                      ? item.quantity.toLocaleString('id-ID')
                      : ''}
                  </Text>
                </View>

                <View style={[styles.dataCell, styles.colReceived]}>
                  <Text />
                </View>

                <View style={[styles.dataCell, styles.colPrice]}>
                  <Text>
                    {item?.priceProduct !== null && item?.priceProduct !== undefined
                      ? item.priceProduct.toLocaleString('id-ID')
                      : ''}
                  </Text>
                </View>

                <View style={[styles.dataCell, styles.colProof]}>
                  <Text />
                </View>

                <View style={[styles.dataCell, styles.colDescription, styles.dataCellLast]}>
                  <Text>{item?.namabarangProductInvoice || ''}</Text>
                </View>
              </View>
            );
          })}

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

            <View style={[styles.totalCell, styles.colProof]}>
              <Text />
            </View>

            <View style={[styles.totalCell, styles.colDescription, styles.totalCellLast]}>
              <Text />
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.bottomTopRow}>
            <View style={[styles.bottomCell, styles.bottomColumn1]}>
              <Text style={styles.bottomTitle}>
                Dikirim Tgl. : {formatDateLong(data.tanggalPengiriman)}
              </Text>
            </View>

            <View style={[styles.bottomCell, styles.bottomColumn2]}>
              <Text style={styles.bottomTitle}>Nama supir Pengangkut/</Text>

              <Text style={styles.bottomTitle}>pembawa barang</Text>
            </View>

            <View style={[styles.bottomCell, styles.bottomColumn3]}>
              <Text style={styles.bottomTitle}>
                Diterima Tgl. : ......................................
              </Text>
            </View>

            <View style={[styles.bottomCell, styles.bottomColumn4, styles.bottomCellLast]}>
              <Text style={styles.bottomTitle}>Diperiksa Bagian terkait</Text>
            </View>
          </View>

          <View style={styles.bottomSecondRow}>
            <View style={styles.warehouseCell}>
              <Text style={styles.warehouseText}>{data.itemsSPB?.[0]?.namaAtasan || ''}</Text>
              <Text style={styles.warehouseText}>
                {data.itemsSPB?.[0]?.jabatanAtasan || 'Kep. Gudang'}
              </Text>
            </View>

            <View style={styles.blankBottomCell} />

            <View style={styles.blankBottomCell2} />

            <View style={styles.blankBottomCell3} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text>PTPN.3.AU58.02. @ 5lbr</Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Note :</Text>

          <View style={styles.noteRow}>
            <Text style={styles.noteLabel}>Lajur 1 s/d 5</Text>

            <Text>diisi Bah. Gudang sipengirim</Text>
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteLabel}>Lajur 5 s/d 6</Text>

            <Text>diisi Bah. Gudang sipenerima</Text>
          </View>

          <View style={styles.noteRow}>
            <Text style={styles.noteLabel}>Lajur 6 dan 7</Text>

            <Text>diisi Bah. Pembukuan sipengirim</Text>
          </View>
        </View>

        <View style={styles.footerLine} />
      </Page>
    </Document>
  );
}
