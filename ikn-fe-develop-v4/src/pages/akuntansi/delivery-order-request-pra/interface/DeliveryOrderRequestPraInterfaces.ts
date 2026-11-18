
export interface DeliveryOrderPraType {
    data:       DatumType[];
    page:       number;
    limit:      number;
    totalData:  number;
    totalPages: number;
}

export interface DatumType {
    id:                string;
    purchaseOrderId:   string;
    au58Id:            null;
    shippedAt:         null;
    deliveredAt:       null;
    typeSalesDelivery: string;
    status:            string;
    selectionStatus:   string;
    deletedAt:         null;
    createdAt:         Date;
    purchaseOrder:     PurchaseOrderType;
}

export interface PurchaseOrderType {
    id:                     string;
    customerId:             string;
    staffId:                string;
    orderNumber:            string;
    date:                   Date;
    description:            string;
    franco:                 string;
    fileUrl:                string;
    approvedFile:           null;
    customerName:           string;
    address: string
    subtotalAmount:         number;
    taxAmount:              number | null;
    totalAmount:            number;
    status:                 string;
    typePo:                 string;
    createdAt:              Date;
    updatedAt:              Date;
    postedAt:               null;
    deletedAt:              null;
    fileUrlSigned:          null;
    isCekPajak:             boolean;
    selectionStatus:        string;
    selectionStatusInvoice: string;
    customer:               CustomerType;
    items:                  ItemType[];
}

export interface CustomerType {
    id:            string;
    code:          string;
    name:          string;
    address:       string;
    unit:          string;
    email:         string;
    phone:         string;
    country:       string;
    continent:     string;
    regional_type: string;
    deletedAt:     null;
    createdAt:     Date;
}

export interface ItemType {
    id:                 string;
    purchaseOrderId:    string;
    itemCode:           null;
    itemName:           null;
    unit:               null;
    quantity:           number;
    unitPrice:          null;
    total:              number;
    stockProduct:       number;
    priceProduct:       number;
    kodeBarangProduct:  string;
    namabarangProduct:  string;
    spesifikasiProduct: string;
    beratproduct:       number;
    kategoriProduct:    string;
    satuanProduct:      string;
    unitProduct:        string;
    createdAt:          Date;
    updatedAt:          Date;
    deletedAt:          null;
    productId:          string;
    product:            ProductType;
}

export interface ProductType {
    id:          string;
    kodeBarang:  string;
    namaBarang:  string;
    satuan:      string;
    Unit:        string;
    kategori:    string;
    nilaiSatuan: number;
    createdAt:   Date;
    updatedAt:   Date;
    deletedAt:   null;
}
