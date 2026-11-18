// import { NormalBalance, PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import * as bcrypt from 'bcrypt';

// const menus = [
// 	{ name: 'Dashboard', path: '/dashboard', parent: null },
// 	{ name: 'User', path: '/user', parent: null },
// 	{ name: 'User Management', path: '/user-management', parent: 'User' },

// 	{ name: 'Pemasaran (RA)', path: '/pemasaran', parent: null },
// 	{ name: 'Sales Plan (RA)', path: '/sales-plan', parent: 'Pemasaran (RA)' },
// 	{ name: 'Pemesanan (RA)', path: '/po-order-pra', parent: 'Pemasaran (RA)' },
// 	{ name: 'Pengiriman (RA)', path: '/delivery-order-pra', parent: 'Pemasaran (RA)' },
// 	{ name: 'Invoice (RA)', path: '/invoice', parent: 'Pemasaran (RA)' },
// 	{ name: 'Laporan Penjualan (RA)', path: '/laporan-penjualan', parent: 'Pemasaran (RA)' },

// 	{ name: 'Pemasaran (RN)', path: '/pemasaran-prn', parent: null },
// 	{ name: 'Sales Plan (RN)', path: '/sales-plan-rn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Pemesanan (RN)', path: '/po-order-prn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Pengiriman (RN)', path: '/delivery-order-prn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Invoice (RN)', path: '/invoice-rn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Laporan Penjualan (RN)', path: '/laporan-penjualan-rn', parent: 'Pemasaran (RN)' },

// 	{ name: 'Pemasaran (RN Ekspor)', path: '/pemasaran-prn-ekspor', parent: null },
// 	{ name: 'Sales Plan (RN Ekpsor)', path: '/sales-plan-rn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Pemesanan (RN Ekspor)', path: '/po-order-prn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Pengiriman (RN Ekspor)', path: '/delivery-order-prn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Invoice (RN Ekspor)', path: '/invoice-rn-ekspor', parent: 'Pemasaran (RN Ekspor)' },

// 	{ name: 'Akuntansi', path: '/akuntansi', parent: null },
// 	{ name: 'SPB', path: '/spbs', parent: 'Akuntansi' },
// 	{ name: 'Permintaan Pengiriman Barang', path: '/delivery-order-pra-request', parent: 'Akuntansi' },
// 	{ name: 'Opening Balance', path: '/opening-balance', parent: 'Akuntansi' },
// 	{ name: 'Opening Balance Material', path: '/opening-balance-material', parent: 'Akuntansi' },
// 	{ name: 'Trial Balance', path: '/trial-balance', parent: 'Akuntansi' },

// 	{ name: 'Gudang', path: '/gudang', parent: null },
// 	{ name: 'Barang Jadi', path: '/finished-goods', parent: 'Gudang' },
// 	{ name: 'Barang Material (Penerimaan)', path: '/raw-material-receipt', parent: 'Gudang' },
// 	{ name: 'Barang Material (Pengeluaran)', path: '/raw-material-issue', parent: 'Gudang' },

// 	{ name: 'Keuangan', path: '/keuangan', parent: null },
// 	{ name: 'Cek Pajak', path: '/cross-chek-pajak', parent: 'Keuangan' },

// 	{ name: 'Uang Masuk Bank (RP)', path: '/transaction', parent: 'Keuangan' },
// 	{ name: 'Uang Masuk Bank (Dollar)', path: '/transaction-dollar', parent: 'Keuangan' },

// 	{ name: 'KAS Keluar (RP)', path: '/transaction-out', parent: 'Keuangan' },
// 	{ name: 'KAS Keluar Material (RP)', path: '/transaction-out-raw-material', parent: 'Keuangan' },
// 	{ name: 'Invoice', path: '/invoice-keuangan', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus RP)', path: '/jurnal-khusus', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus Dollar)', path: '/jurnal-khusus-dollar', parent: 'Keuangan' },
// 	{ name: 'Jurnal (Umum)', path: '/jurnal-umum', parent: 'Keuangan' },
// 	{ name: 'Buku Rekening', path: '/buku-rekening', parent: 'Keuangan' },
// 	{ name: 'Buku Besar', path: '/buku-besar', parent: 'Keuangan' },
// 	{ name: 'Laporan Keuangan', path: '/saldo', parent: 'Keuangan' },

// 	{ name: 'Master', path: '/master', parent: null },
// 	{ name: 'Unit', path: '/unit', parent: 'Master' },
// 	{ name: 'Satuan', path: '/satuan', parent: 'Master' },
// 	{ name: 'Kategori', path: '/kategori', parent: 'Master' },
// 	{ name: 'Barang Jadi (Master)', path: '/barang-jadi', parent: 'Master' },
// 	{ name: 'Barang Material', path: '/raw-material', parent: 'Master' },
// 	{ name: 'Supplier', path: '/supplier', parent: 'Master' },
// 	{ name: 'Akun Bank', path: '/akun-bank', parent: 'Master' },
// 	{ name: 'Akun', path: '/akun', parent: 'Master' },
// 	{ name: 'Pelanggan', path: '/customer', parent: 'Master' },
// ];

// const menuAKTRn = [
// 	{ name: 'Dashboard', path: '/dashboard', parent: null },

// 	{ name: 'Akuntansi', path: '/akuntansi', parent: null },
// 	{ name: 'SPB', path: '/spbs', parent: 'Akuntansi' },
// 	{ name: 'Permintaan Pengiriman Barang', path: '/delivery-order-pra-request', parent: 'Akuntansi' },
// 	{ name: 'Opening Balance', path: '/opening-balance', parent: 'Akuntansi' },
// 	{ name: 'Trial Balance', path: '/trial-balance', parent: 'Akuntansi' },

// 	{ name: 'Keuangan', path: '/keuangan', parent: null },
// 	{ name: 'Invoice', path: '/invoice-keuangan', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus RP)', path: '/jurnal-khusus', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus Dollar)', path: '/jurnal-khusus-dollar', parent: 'Keuangan' },
// 	{ name: 'Jurnal (Umum)', path: '/jurnal-umum', parent: 'Keuangan' },
// 	{ name: 'Buku Rekening', path: '/buku-rekening', parent: 'Keuangan' },
// 	{ name: 'Laporan Keuangan', path: '/saldo', parent: 'Keuangan' },
// ];

// const menuAKTRa = [
// 	{ name: 'Dashboard', path: '/dashboard', parent: null },

// 	{ name: 'Akuntansi', path: '/akuntansi', parent: null },
// 	{ name: 'SPB', path: '/spbs', parent: 'Akuntansi' },
// 	{ name: 'Permintaan Pengiriman Barang', path: '/delivery-order-pra-request', parent: 'Akuntansi' },
// 	{ name: 'Opening Balance', path: '/opening-balance', parent: 'Akuntansi' },
// 	{ name: 'Trial Balance', path: '/trial-balance', parent: 'Akuntansi' },

// 	{ name: 'Keuangan', path: '/keuangan', parent: null },
// 	{ name: 'Invoice', path: '/invoice-keuangan', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus RP)', path: '/jurnal-khusus', parent: 'Keuangan' },
// 	{ name: 'Jurnal (khusus Dollar)', path: '/jurnal-khusus-dollar', parent: 'Keuangan' },
// 	{ name: 'Jurnal (Umum)', path: '/jurnal-umum', parent: 'Keuangan' },
// 	{ name: 'Buku Rekening', path: '/buku-rekening', parent: 'Keuangan' },
// 	{ name: 'Laporan Keuangan', path: '/saldo', parent: 'Keuangan' },
// ];

// const menusMrktRnEkspor = [
// 	{ name: 'Dashboard', path: '/dashboard', parent: null },

// 	{ name: 'Pemasaran (RN Ekspor)', path: '/pemasaran-prn-ekspor', parent: null },
// 	{ name: 'Sales Plan (RN Ekpsor)', path: '/sales-plan-rn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Pemesanan (RN Ekspor)', path: '/po-order-prn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Pengiriman (RN Ekspor)', path: '/delivery-order-prn-ekspor', parent: 'Pemasaran (RN Ekspor)' },
// 	{ name: 'Invoice (RN Ekspor)', path: '/invoice-rn-ekspor', parent: 'Pemasaran (RN Ekspor)' },

// 	{ name: 'Pemasaran (RN)', path: '/pemasaran-prn', parent: null },
// 	{ name: 'Sales Plan (RN)', path: '/sales-plan-rn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Pemesanan (RN)', path: '/po-order-prn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Pengiriman (RN)', path: '/delivery-order-prn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Invoice (RN)', path: '/invoice-rn', parent: 'Pemasaran (RN)' },
// 	{ name: 'Laporan Penjualan (RN)', path: '/laporan-penjualan-rn', parent: 'Pemasaran (RN)' },
// ];

// const menusRA = [
// 	{ name: 'Dashboard', path: '/dashboard', parent: null },

// 	{ name: 'Pemasaran (RA)', path: '/pemasaran', parent: null },
// 	{ name: 'Sales Plan (RA)', path: '/sales-plan', parent: 'Pemasaran (RA)' },
// 	{ name: 'Pemesanan (RA)', path: '/po-order-pra', parent: 'Pemasaran (RA)' },
// 	{ name: 'Pengiriman (RA)', path: '/delivery-order-pra', parent: 'Pemasaran (RA)' },
// 	{ name: 'Invoice (RA)', path: '/invoice', parent: 'Pemasaran (RA)' },
// 	{ name: 'Laporan Penjualan (RA)', path: '/laporan-penjualan', parent: 'Pemasaran (RA)' },
// ];
// const menuGudangRA = [
// 	{ name: 'Gudang', path: '/gudang', parent: null },
// 	{ name: 'Barang Jadi', path: '/finished-goods', parent: 'Gudang' },
// 	{ name: 'Barang Material (Penerimaan)', path: '/raw-material-receipt', parent: 'Gudang' },
// 	{ name: 'Barang Material (Pengeluaran)', path: '/raw-material-issue', parent: 'Gudang' },
// ];

// const menuGudangRN = [
// 	{ name: 'Gudang', path: '/gudang', parent: null },
// 	{ name: 'Barang Jadi', path: '/finished-goods', parent: 'Gudang' },
// 	{ name: 'Barang Material (Penerimaan)', path: '/raw-material-receipt', parent: 'Gudang' },
// 	{ name: 'Barang Material (Pengeluaran)', path: '/raw-material-issue', parent: 'Gudang' },
// ];

// async function main() {
// 	// Create admin administrator
// 	const adminRole = await prisma.role.upsert({
// 		where: { name: 'administrator' },
// 		update: {},
// 		create: { name: 'administrator' },
// 	});

// 	const parentMenus = new Map<string, number>();

// 	const menuRecords: any[] = [];

// 	for (const menu of menus) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenus.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenu = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenus.set(menu.name, createdMenu.id);
// 		menuRecords.push(createdMenu);
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecords) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRole.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRole.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecords) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRole.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRole.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Create admin marketing RN
// 	const adminRoleMRKT = await prisma.role.upsert({
// 		where: { name: 'mrkt_rn' },
// 		update: {},
// 		create: { name: 'mrkt_rn' },
// 	});

// 	const parentMenusMrktRn = new Map<string, number>();

// 	const menuRecordsMrktRn: any[] = [];

// 	for (const menu of menusMrktRnEkspor) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusMrktRn.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenuMrktRn = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusMrktRn.set(menu.name, createdMenuMrktRn.id);
// 		menuRecordsMrktRn.push(createdMenuMrktRn);
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsMrktRn) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleMRKT.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleMRKT.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsMrktRn) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleMRKT.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleMRKT.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Create admin AKT RN
// 	const adminRoleAKT = await prisma.role.upsert({
// 		where: { name: 'akt_rn' },
// 		update: {},
// 		create: { name: 'akt_rn' },
// 	});

// 	const parentMenusAKT = new Map<string, number>();

// 	const menuRecordsAKT: any[] = [];

// 	for (const menu of menuAKTRn) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusAKT.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenuAKT = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusAKT.set(menu.name, createdMenuAKT.id);
// 		menuRecordsAKT.push(createdMenuAKT);
// 	}
// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsAKT) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleAKT.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleAKT.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Create admin AKT Ra
// 	const adminRoleAKTRA = await prisma.role.upsert({
// 		where: { name: 'akt_rn' },
// 		update: {},
// 		create: { name: 'akt_rn' },
// 	});

// 	const parentMenusAKTRA = new Map<string, number>();

// 	const menuRecordsAKTRA: any[] = [];

// 	for (const menu of menuAKTRa) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusAKTRA.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenuAKTRA = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusAKTRA.set(menu.name, createdMenuAKTRA.id);
// 		menuRecordsAKTRA.push(createdMenuAKTRA);
// 	}
// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsAKTRA) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleAKTRA.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleAKTRA.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	//create admin gudang RA
// 	const adminRoleGudangRA = await prisma.role.upsert({
// 		where: { name: 'gudang_ra' },
// 		update: {},
// 		create: { name: 'gudang_ra' },
// 	});

// 	const parentMenusGudangRA = new Map<string, number>();

// 	const menuRecordsGudangRA: any[] = [];

// 	for (const menu of menuGudangRA) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusGudangRA.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenuGudangRA = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusGudangRA.set(menu.name, createdMenuGudangRA.id);
// 		menuRecordsGudangRA.push(createdMenuGudangRA);
// 	}
// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsGudangRA) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleGudangRA.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleGudangRA.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	//create admin gudang RN
// 	const adminRoleGudangRN = await prisma.role.upsert({
// 		where: { name: 'gudang_rn' },
// 		update: {},
// 		create: { name: 'gudang_rn' },
// 	});

// 	const parentMenusGudangRN = new Map<string, number>();

// 	const menuRecordsGudangRN: any[] = [];

// 	for (const menu of menuGudangRN) {
// 		let parentId: number | undefined;
// 		let nameParent: string | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusGudangRN.get(menu.parent);
// 			nameParent = menu.parent;
// 		}

// 		const createdMenuGudangRN = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 				nameParent,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusGudangRN.set(menu.name, createdMenuGudangRN.id);
// 		menuRecordsGudangRN.push(createdMenuGudangRN);
// 	}
// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsGudangRN) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleGudangRN.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleGudangRN.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	const unitsToCreate = [
// 		{ nama: 'pusat', kode: '0001' },
// 		{ nama: 'Unit RA', kode: '0002' },
// 		{ nama: 'Unit RN', kode: '0003' },
// 		// tambahkan unit lainnya sesuai kebutuhan
// 	];

// 	const createdUnits = await prisma.$transaction(
// 		unitsToCreate.map((unit) =>
// 			prisma.masterUnit.upsert({
// 				where: { nama: unit.nama },
// 				update: {},
// 				create: unit,
// 			})
// 		)
// 	);

// 	console.log('Units berhasil dibuat:', createdUnits);

// 	const unit = await prisma.masterUnit.upsert({
// 		where: { nama: 'pusat' },
// 		update: {},
// 		create: {
// 			nama: 'pusat',
// 			kode: '0001',
// 		},
// 	});

// 	const unitRN = await prisma.masterUnit.upsert({
// 		where: { nama: 'Unit RN' },
// 		update: {},
// 		create: {
// 			nama: 'Unit RN',
// 			kode: '0003',
// 		},
// 	});

// 	const unitRA = await prisma.masterUnit.upsert({
// 		where: { nama: 'Unit RA' },
// 		update: {},
// 		create: {
// 			nama: 'Unit RA',
// 			kode: '0002',
// 		},
// 	});

// 	// Buat user admin
// 	const password = await bcrypt.hash('12345', 10);
// 	const user = await prisma.user.upsert({
// 		where: { email: 'administrator@administrator.com' },
// 		update: {},
// 		create: {
// 			unitId: unit.id,
// 			name: 'administrator',
// 			email: 'administrator@administrator.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'Administrator',
// 			isPusat: true,
// 			roles: {
// 				create: {
// 					roleId: adminRole.id,
// 				},
// 			},
// 		},
// 	});

// 	// Buat user admin RN AKT
// 	await prisma.user.upsert({
// 		where: { email: 'akt_rn@akt_rn.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRN.id,
// 			name: 'akt_rn',
// 			email: 'akt_rn@akt_rn.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleAKT.id,
// 				},
// 			},
// 		},
// 	});

// 	// Buat user admin RA AKT
// 	await prisma.user.upsert({
// 		where: { email: 'akt_ra@akt_ra.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRA.id,
// 			name: 'akt_ra',
// 			email: 'akt_ra@akt_ra.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleAKT.id,
// 				},
// 			},
// 		},
// 	});

// 	// Buat user admin RN MRKT
// 	await prisma.user.upsert({
// 		where: { email: 'mrkt_rn@mrkt_rn.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRN.id,
// 			name: 'mrkt_rn',
// 			email: 'mrkt_rn@mrkt_rn.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleMRKT.id,
// 				},
// 			},
// 		},
// 	});

// 	// Create admin marketing RA
// 	const adminRoleMRKTRA = await prisma.role.upsert({
// 		where: { name: 'mrkt_ra' },
// 		update: {},
// 		create: { name: 'mrkt_ra' },
// 	});

// 	// Buat user admin RA MRKT
// 	await prisma.user.upsert({
// 		where: { email: 'mrkt_ra@mrkt_ra.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRA.id,
// 			name: 'mrkt_ra',
// 			email: 'mrkt_ra@mrkt_ra.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleMRKTRA.id,
// 				},
// 			},
// 		},
// 	});

// 	// Buat user admin RA Gudang
// 	await prisma.user.upsert({
// 		where: { email: 'gudang@gudang_ra.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRA.id,
// 			name: 'gudang_ra',
// 			email: 'gudang_ra@gudang_ra.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleGudangRA.id,
// 				},
// 			},
// 		},
// 	});

// 	// Buat user admin RA Gudang
// 	await prisma.user.upsert({
// 		where: { email: 'gudang@gudang_n.com' },
// 		update: {},
// 		create: {
// 			unitId: unitRN.id,
// 			name: 'gudang_rn',
// 			email: 'gudang_ra@gudang_rn.com',
// 			password: password,
// 			nik: '12345678',
// 			jabatan: 'admin',
// 			roles: {
// 				create: {
// 					roleId: adminRoleGudangRN.id,
// 				},
// 			},
// 		},
// 	});

// 	const parentMenusMrktRa = new Map<string, number>();

// 	const menuRecordsMrktRa: any[] = [];

// 	for (const menu of menusRA) {
// 		let parentId: number | undefined;

// 		if (menu.parent) {
// 			parentId = parentMenusMrktRa.get(menu.parent);
// 		}

// 		const createdMenuMrktRa = await prisma.menu.upsert({
// 			where: { name: menu.name },
// 			update: {},
// 			create: {
// 				name: menu.name,
// 				path: menu.path,
// 				parentId,
// 			},
// 		});

// 		// Simpan id menu untuk child-nya
// 		parentMenusMrktRa.set(menu.name, createdMenuMrktRa.id);
// 		menuRecordsMrktRa.push(createdMenuMrktRa);
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsMrktRa) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleMRKTRA.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleMRKTRA.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	// Hubungkan admin ke semua menu dan permission
// 	for (const menu of menuRecordsMrktRa) {
// 		await prisma.rolePermission.upsert({
// 			where: {
// 				roleId_menuId: {
// 					roleId: adminRoleMRKTRA.id,
// 					// permissionId: perm.id,
// 					menuId: menu.id,
// 				},
// 			},
// 			update: {},
// 			create: {
// 				roleId: adminRoleMRKTRA.id,
// 				// permissionId: perm.id,
// 				menuId: menu.id,
// 				canView: true,
// 				canAdd: true,
// 				canEdit: true,
// 				canDelete: true,
// 				canApprove: true,
// 			},
// 		});
// 	}

// 	const SatuansToCreate = [
// 		{ name: 'KG', kode: '0001', keterangan: 'kg', staffId: user.id },
// 		{ name: 'CM', kode: '0002', keterangan: 'cm', staffId: user.id },
// 		{ name: 'L', kode: '0003', keterangan: 'lt', staffId: user.id },
// 		// tambahkan unit lainnya sesuai kebutuhan
// 	];

// 	await prisma.$transaction(
// 		SatuansToCreate.map((satuan) =>
// 			prisma.masterSatuan.upsert({
// 				where: { kode: satuan.kode },
// 				update: {},
// 				create: satuan,
// 			})
// 		)
// 	);

// 	const KategorisToCreate = [
// 		{ nama: 'Kategori 1', kode: '0001', staffId: user.id },
// 		{ nama: 'Kategori 2', kode: '0002', staffId: user.id },
// 		{ nama: 'Kategori 3', kode: '0003', staffId: user.id },
// 		// tambahkan unit lainnya sesuai kebutuhan
// 	];

// 	await prisma.$transaction(
// 		KategorisToCreate.map((kategori) =>
// 			prisma.masterKategoriBarangJadi.upsert({
// 				where: { kode: kategori.kode },
// 				update: {},
// 				create: kategori,
// 			})
// 		)
// 	);

// 	// Seed data pajak

// 	const types = [
// 		{ name: 'ASSET', code: 'A', normalBalance: NormalBalance.DEBIT, description: 'Aktiva' },
// 		{ name: 'LIABILITY', code: 'L', normalBalance: NormalBalance.CREDIT, description: 'Kewajiban' },
// 		{ name: 'EQUITY', code: 'E', normalBalance: NormalBalance.CREDIT, description: 'Modal' },
// 		{ name: 'REVENUE', code: 'R', normalBalance: NormalBalance.CREDIT, description: 'Pendapatan' },
// 		{ name: 'EXPENSE', code: 'X', normalBalance: NormalBalance.DEBIT, description: 'Beban' },
// 	];

// 	for (const type of types) {
// 		await prisma.accountType.upsert({
// 			where: { name: type.name },
// 			update: {},
// 			create: type,
// 		});
// 	}

// 	const accountTypes = await prisma.accountType.findMany();
// 	const accountTypeMap = Object.fromEntries(accountTypes.map((type) => [type.name, type.id]));

// 	// FIXME: start - ASSET ROOT
// 	const aset = await prisma.account.create({
// 		data: {
// 			code: '1',
// 			name: 'Aset',
// 			staffId: user.id,
// 			accountTypeId: accountTypeMap['ASSET'],
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// Kas
// 	const kas = await prisma.account.create({
// 		data: {
// 			code: '1.01',
// 			name: 'Kas',
// 			staffId: user.id,
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: aset.code,
// 			typeNeraca: 'LABARUGI',
// 		},
// 	});

// 	//TMP
// 	await prisma.account.create({
// 		data: {
// 			code: '8888',
// 			name: 'tmp',
// 			staffId: user.id,
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: null,
// 			typeNeraca: 'LABARUGI',
// 		},
// 	});

// 	await prisma.account.createMany({
// 		data: [
// 			{
// 				code: '1.01.01',
// 				name: 'Kas Besar',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				parentId: kas.code,
// 				staffId: user.id,
// 				typeNeraca: 'LABARUGI',
// 			},
// 			{
// 				code: '1.01.02',
// 				name: 'Kas Kecil',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				parentId: kas.code,
// 				staffId: user.id,
// 				typeNeraca: 'LABARUGI',
// 			},
// 		],
// 	});

// 	// Bank
// 	const bank = await prisma.account.create({
// 		data: {
// 			code: '1.02',
// 			name: 'Bank',
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: aset.code,
// 			staffId: user.id,
// 			typeNeraca: 'LABARUGI',
// 		},
// 	});

// 	await prisma.account.createMany({
// 		data: [
// 			{
// 				code: '1.02.01',
// 				name: 'Bank BCA',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				parentId: bank.code,
// 				staffId: user.id,
// 				typeNeraca: 'LABARUGI',
// 			},
// 			{
// 				code: '1.02.02',
// 				name: 'Bank Mandiri',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				parentId: bank.code,
// 				staffId: user.id,
// 				typeNeraca: 'LABARUGI',
// 			},
// 		],
// 	});

// 	// Piutang Usaha (wajib jika ada penjualan kredit)
// 	await prisma.account.create({
// 		data: {
// 			code: '150.03',
// 			name: 'Piutang Usaha',
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: aset.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '150.03.000',
// 			name: 'Produksi Dalam Proses',
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: aset.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// Cari Piutang Pajak sub akun atau buat kalau belum ada
// 	let piutangPajak = await prisma.account.findFirst({ where: { code: '1.04' } });
// 	if (!piutangPajak) {
// 		piutangPajak = await prisma.account.create({
// 			data: {
// 				code: '1.04',
// 				name: 'Piutang Pajak',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				parentId: aset.code,
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		});
// 	}

// 	await prisma.account.create({
// 		data: {
// 			code: '080',
// 			name: 'KANTOR PUSAT MEDAN ',
// 			accountTypeId: accountTypeMap['ASSET'],
// 			parentId: aset.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// FIXME: end - ASSET ROOT

// 	// EQUITY
// 	const ekuitas = await prisma.account.create({
// 		data: {
// 			code: '3',
// 			name: 'Ekuitas',
// 			accountTypeId: accountTypeMap['EQUITY'],
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '3.01',
// 			name: 'Modal Pemilik',
// 			accountTypeId: accountTypeMap['EQUITY'],
// 			parentId: ekuitas.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// REVENUE
// 	const pendapatan = await prisma.account.create({
// 		data: {
// 			code: '4',
// 			name: 'Pendapatan',
// 			accountTypeId: accountTypeMap['REVENUE'],
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '4.01',
// 			name: 'Pendapatan Penjualan',
// 			accountTypeId: accountTypeMap['REVENUE'],
// 			parentId: pendapatan.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// EXPENSE
// 	const beban = await prisma.account.create({
// 		data: {
// 			code: '5',
// 			name: 'Beban',
// 			accountTypeId: accountTypeMap['EXPENSE'],
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '5.04',
// 			name: 'Biaya Umum & Administrasi',
// 			accountTypeId: accountTypeMap['EXPENSE'],
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.createMany({
// 		data: [
// 			{
// 				code: '5.01',
// 				name: 'Beban Gaji',
// 				accountTypeId: accountTypeMap['EXPENSE'],
// 				parentId: beban.code,
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 			{
// 				code: '5.02',
// 				name: 'Beban Sewa',
// 				accountTypeId: accountTypeMap['EXPENSE'],
// 				parentId: beban.code,
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		],
// 	});

// 	// Beban Operasional Lainnya
// 	await prisma.account.create({
// 		data: {
// 			code: '5.03',
// 			name: 'Beban Operasional Lainnya',
// 			accountTypeId: accountTypeMap['EXPENSE'],
// 			parentId: beban.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	//FIXME: start - kewajiban
// 	// Cari Kewajiban root dulu
// 	let kewajiban = await prisma.account.findFirst({ where: { code: '2' } });
// 	if (!kewajiban) {
// 		kewajiban = await prisma.account.create({
// 			data: {
// 				code: '2',
// 				name: 'Kewajiban',
// 				accountTypeId: accountTypeMap['LIABILITY'],
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		});
// 	}

// 	// Buat sub Pajak Keluaran, kalau belum ada
// 	let pajakKeluaran = await prisma.account.findFirst({ where: { code: '2.02' } });
// 	if (!pajakKeluaran) {
// 		pajakKeluaran = await prisma.account.create({
// 			data: {
// 				code: '2.02',
// 				name: 'Pajak Keluaran',
// 				accountTypeId: accountTypeMap['LIABILITY'],
// 				parentId: kewajiban.code,
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		});
// 	}

// 	await prisma.account.create({
// 		data: {
// 			code: '2.01',
// 			name: 'Hutang Usaha',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: kewajiban.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// PPN Keluaran
// 	await prisma.account.create({
// 		data: {
// 			code: '2.02.01',
// 			name: 'PPN Keluaran',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: pajakKeluaran.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// Akun PPnBM Keluaran
// 	await prisma.account.create({
// 		data: {
// 			code: '2.02.02',
// 			name: 'PPnBM Keluaran',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: pajakKeluaran.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// Buat sub Hutang Pajak, kalau belum ada
// 	let hutangPajak = await prisma.account.findFirst({ where: { code: '2.03' } });
// 	if (!hutangPajak) {
// 		hutangPajak = await prisma.account.create({
// 			data: {
// 				code: '2.03',
// 				name: 'Hutang Pajak',
// 				accountTypeId: accountTypeMap['LIABILITY'],
// 				parentId: kewajiban.code,
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		});
// 	}

// 	// Akun PPh 22
// 	await prisma.account.create({
// 		data: {
// 			code: '2.03.01',
// 			name: 'PPh 22',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: hutangPajak.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '2.03.02',
// 			name: 'PPh 21',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: hutangPajak.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '2.03.03',
// 			name: 'PPh 23',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: hutangPajak.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '08.1',
// 			name: 'KANTOR RA MEDAN ',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: kewajiban.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	await prisma.account.create({
// 		data: {
// 			code: '08.2',
// 			name: 'KANTOR RN MEDAN ',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: kewajiban.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});

// 	// PPh Dipotong (misalnya PPh 23, 21, dll)
// 	await prisma.account.create({
// 		data: {
// 			code: '1.04.01',
// 			name: 'PPh Dipotong',
// 			accountTypeId: accountTypeMap['LIABILITY'],
// 			parentId: piutangPajak.code,
// 			staffId: user.id,
// 			typeNeraca: 'NERACA',
// 		},
// 	});
// 	//gudang
// 	await prisma.account.createMany({
// 		data: [
// 			{
// 				code: '150.24.04',
// 				name: 'supplier',
// 				accountTypeId: accountTypeMap['LIABILITY'],
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 			{
// 				code: '5.10.1',
// 				name: 'Persediaan Bahan Baku',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 			{
// 				code: '5.10.2',
// 				name: 'Persediaan Barang Jadi',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 			{
// 				code: '300.12',
// 				name: 'amonia',
// 				accountTypeId: accountTypeMap['ASSET'],
// 				staffId: user.id,
// 				typeNeraca: 'NERACA',
// 			},
// 		],
// 	});

// 	await prisma.bankAccount.createMany({
// 		data: [
// 			{
// 				accountCode: '1.02.02', // Pastikan ini ada di tabel Account
// 				bankName: 'Bank Mandiri',
// 				currency: 'IDR',
// 				branchAddress: 'Jl. Gatot Subroto No.36, Jakarta',
// 				currencyRate: 0,
// 				bankAccountNumber: '1400012345678',
// 				bankCode: 'MNDR',
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 				staffId: user.id,
// 			},
// 			{
// 				accountCode: '1.02.01', // Pastikan ini ada di tabel Account
// 				bankName: 'Bank Central Asia (BCA)',
// 				currency: 'USD',
// 				branchAddress: 'Jl. MH Thamrin No.1, Jakarta',
// 				currencyRate: 15600.0,
// 				bankCode: 'BCA',
// 				bankAccountNumber: '0123456789',
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 				staffId: user.id,
// 			},
// 		],
// 		skipDuplicates: true, // agar tidak error jika sudah ada datanya
// 	});

// 	await prisma.tax.createMany({
// 		data: [
// 			{
// 				taxType: 'PPN 11%',
// 				taxValue: 0.11,
// 				status: 'VERIFIED',
// 				accountCode: '2.02.01',
// 				isActive: true,
// 				type: 'VAT_OUT',
// 				staffId: user.id,
// 			},
// 			{
// 				taxType: 'PPh 21',
// 				taxValue: 0.05,
// 				status: 'VERIFIED',
// 				accountCode: '2.03.02',
// 				isActive: true,
// 				type: 'SALARY',
// 				staffId: user.id,
// 			},
// 			{
// 				taxType: 'PPh 23',
// 				taxValue: 0.02,
// 				status: 'VERIFIED',
// 				accountCode: '2.03.03',
// 				isActive: true,
// 				type: 'WITHHOLD',
// 				staffId: user.id,
// 			},
// 		],
// 		skipDuplicates: true,
// 	});

// 	await prisma.accountMapping.createMany({
// 		data: [
// 			// DEBIT
// 			{ module: 'SALES', transactionType: 'INVOICE', position: 'DEBIT', usage: 'piutang', accountCode: '8888' },
// 			// PURCHASE
// 			{
// 				module: 'PURCHASE',
// 				transactionType: 'CREDIT',
// 				position: 'DEBIT',
// 				usage: 'persediaan_bahan_baku',
// 				accountCode: '8888',
// 			},
// 			// EXPENSE
// 			{
// 				module: 'EXPENSE',
// 				transactionType: 'CASH',
// 				position: 'DEBIT',
// 				usage: 'biaya_operasional',
// 				accountCode: '8888',
// 			},

// 			{
// 				module: 'FINANCE',
// 				transactionType: 'INVOICE',
// 				position: 'DEBIT',
// 				usage: 'biaya_admin',
// 				accountCode: '8888',
// 			},

// 			{
// 				module: 'FINANCE',
// 				transactionType: 'INVOICE_RN',
// 				position: 'DEBIT',
// 				usage: 'biaya_admin',
// 				accountCode: '8888',
// 			},

// 			//CREDIT
// 			{
// 				module: 'SALES',
// 				transactionType: 'INVOICE',
// 				position: 'CREDIT',
// 				usage: 'pendapatan',
// 				accountCode: '8888',
// 			},
// 			{ module: 'SALES', transactionType: 'INVOICE', position: 'CREDIT', usage: 'ppn', accountCode: '8888' },

// 			{ module: 'PURCHASE', transactionType: 'CREDIT', position: 'CREDIT', usage: 'hutang', accountCode: '8888' },

// 			{ module: 'EXPENSE', transactionType: 'CASH', position: 'CREDIT', usage: 'kas', accountCode: '8888' },

// 			//============ FINANCE RA (Pembayaran Oleh Customer) ===============

// 			{
// 				module: 'FINANCE',
// 				transactionType: 'INVOICE',
// 				position: 'CREDIT',
// 				usage: 'piutang',
// 				accountCode: '8888',
// 			},

// 			//============ FINANCE RN (Pembayaran Oleh Customer) ===============

// 			{
// 				module: 'FINANCE',
// 				transactionType: 'INVOICE_RN',
// 				position: 'CREDIT',
// 				usage: 'piutang',
// 				accountCode: '8888',
// 			},

// 			{
// 				module: 'RECEIPT',
// 				transactionType: 'MATERIAL_RECEIPT',
// 				position: 'CREDIT',
// 				usage: 'piutang',
// 				accountCode: '150.03',
// 			},

// 			{
// 				module: 'ISSUE',
// 				transactionType: 'MATERIAL_ISSUE',
// 				position: 'DEBIT',
// 				usage: 'piutang',
// 				accountCode: '150.03.000',
// 			},

// 			//transaction

// 			{
// 				module: 'PAYMENT',
// 				transactionType: 'TRANSACTON_MIRROR',
// 				position: 'DEBIT',
// 				usage: 'UNIT PUSAT',
// 				accountCode: '080',
// 			},

// 			{
// 				module: 'PAYMENT',
// 				transactionType: 'TRANSACTON_MIRROR',
// 				position: 'CREDIT',
// 				usage: 'piutang',
// 				accountCode: '150.03',
// 			},

// 			//transaction dollar
// 			{
// 				module: 'PAYMENT',
// 				transactionType: 'TRANSACTON_DOLLAR',
// 				position: 'DEBIT',
// 				usage: 'Biaya',
// 				accountCode: '5.04',
// 			},

// 			{
// 				module: 'PAYMENT',
// 				transactionType: 'TRANSACTON_DOLLAR',
// 				position: 'CREDIT',
// 				usage: 'UNIT RN',
// 				accountCode: '08.2',
// 			},
// 		],
// 		skipDuplicates: true, // agar tidak error jika sudah ada datanya
// 	});

// 	await prisma.taxTypeMap.createMany({
// 		data: [
// 			{ name: 'PPN', code: 'ppn', rate: 11, position: 'CREDIT', usage: 'ppn' },
// 			{ name: 'PPh 23', code: 'pph23', rate: 2, position: 'DEBIT', usage: 'pph23' },
// 			{ name: 'PPh 22', code: 'pph22', rate: 1.5, position: 'DEBIT', usage: 'pph22' },
// 			{ name: 'PPnBM', code: 'ppnbm', rate: 20, position: 'CREDIT', usage: 'ppnbm' },
// 		],
// 		skipDuplicates: true,
// 	});
// }

// console.log('✅ berhasil diseed.');

// main()
// 	.catch((e) => {
// 		console.error(e);
// 		process.exit(1);
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});
