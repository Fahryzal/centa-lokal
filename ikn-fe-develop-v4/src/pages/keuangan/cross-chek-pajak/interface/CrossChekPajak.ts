

export interface CrossChekPajakType {
    data:       DatumType[];
    page:       number;
    limit:      number;
    totalData:  number;
    totalPages: number;
}

export interface DatumType {
    id:                string;
    noSpb:             string;
    purchaseOrderId:   string;
    orderNumber:       string;
    date:              Date;
    description:       string;
    franco:            string;
    fileUrl:           null;
    customerName:      string;
    subtotalAmount:    number;
    taxAmount:         null;
    totalAmount:       null;
    isComplete:        string;
    tanggalPengiriman: Date;
    selectionStatus:   string;
    typeSalesSPb:      string;
    createdAt:         Date;
    status:            string;
    deletedAt:         null;
}
