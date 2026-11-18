import React, { useEffect, useState } from 'react';
import * as GeneralLedgerAxios from '@pages/akuntansi/general-ledger/service/GeneralLedgerAxios';
import { showNotification } from '@/contexts/services/notificationService';
import * as UnitAxios from '@pages/master/unit/service/UnitAxios';
import { useDebounce, useFetchOptions } from '@/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { TrialBalance } from './structture/Components/TrialBalance';
const maxPeriod = dayjs().format('YYYY-MM');

type Account = {
  accountCode: string;
  accountName: string;
  neracaAwal: { debit: number; credit: number };
  saldoAwal: { debit: number; credit: number };
  mutasi: { debit: number; credit: number };
  saldoAkhir: { debit: number; credit: number };
};

export function groupAccountsByFirstDigit(data: Account[]) {
  const grouped: Record<
    string,
    {
      group: string;
      neracaAwal: { debit: number; credit: number };
      saldoAwal: { debit: number; credit: number };
      mutasi: { debit: number; credit: number };
      saldoAkhir: { debit: number; credit: number };
      accounts: Account[];
    }
  > = {};

  data.forEach((acc) => {
    const groupKey = acc.accountCode.split('.')[0]; // ambil angka pertama sebelum titik
    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        group: groupKey,
        neracaAwal: { debit: 0, credit: 0 },
        saldoAwal: { debit: 0, credit: 0 },
        mutasi: { debit: 0, credit: 0 },
        saldoAkhir: { debit: 0, credit: 0 },
        accounts: [],
      };
    }

    grouped[groupKey].neracaAwal.debit += acc.neracaAwal.debit;
    grouped[groupKey].neracaAwal.credit += acc.neracaAwal.credit;

    grouped[groupKey].saldoAwal.debit += acc.saldoAwal.debit;
    grouped[groupKey].saldoAwal.credit += acc.saldoAwal.credit;

    grouped[groupKey].mutasi.debit += acc.mutasi.debit;
    grouped[groupKey].mutasi.credit += acc.mutasi.credit;

    grouped[groupKey].saldoAkhir.debit += acc.saldoAkhir.debit;
    grouped[groupKey].saldoAkhir.credit += acc.saldoAkhir.credit;

    grouped[groupKey].accounts.push(acc);
  });

  return Object.values(grouped).sort((a, b) => {
    const aStr = a.group.replace(/\s+/g, '');
    const bStr = b.group.replace(/\s+/g, '');

    const aNum = Number(aStr);
    const bNum = Number(bStr);

    const aLeading = aStr.length > 1 && aStr.startsWith('0');
    const bLeading = bStr.length > 1 && bStr.startsWith('0');

    // 1. Prioritas: leading zero lebih dulu
    if (aLeading && !bLeading) return -1;
    if (!aLeading && bLeading) return 1;

    // 2. Kalau dua-duanya leading zero → bandingkan numerik
    if (aLeading && bLeading) {
      if (aNum !== bNum) return aNum - bNum;
      return aStr.length - bStr.length; // kalau angka sama, lebih pendek dulu
    }

    // 3. Kalau dua-duanya normal → bandingkan numerik biasa
    return aNum - bNum;
  });
}

const GeneralEdger: React.FC = () => {
  const [dataTrialBalance, setDataTrialBalance] = useState([]);
  const [periode, setPeriode] = useState<Dayjs>(maxPeriod as any);
  const [maxPeriode, setMaxPeriode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    dataUnit: [],
  });

  useFetchOptions(unit, setUnit, UnitAxios.fetchDataUnit, [unit.dataUnit]);

  const onSearchUnit = useDebounce((searchText: string) => {
    setUnit((prev) => ({ ...prev, nama: searchText }));
  }, 1000);

  useEffect(() => {
    if (unit.dataUnit && periode) {
      fetchDataTrialBalance(unit.dataUnit, periode);
    }
  }, [unit, periode]);

  const fetchDataTrialBalance = async (unitId: string[], periode: Dayjs) => {
    try {
      setLoading(true);

      const data = await GeneralLedgerAxios.fetchDataTrialBalance(
        unitId,
        dayjs(periode).format('YYYY-MM')
      );
      setDataTrialBalance(data || []);
      setLoading(false);
    } catch (e) {
      showNotification('error', 'Gagal', 'gagal mendapatkan data');
      setLoading(false);
    }
  };

  const fetchDataMaxPeriode = async (unitId: string[]) => {
    try {
      const data = await GeneralLedgerAxios.fetchDataMaxPeriode(unitId);
      setPeriode(data?.period || maxPeriod);
      setMaxPeriode(data?.period || maxPeriod);
    } catch (e) {
      showNotification('error', 'Gagal', 'gagal mendapatkan data');
    }
  };

  useEffect(() => {
    if (unit.dataUnit) {
      fetchDataMaxPeriode(unit.dataUnit);
    }
  }, [unit]);

  return (
    <TrialBalance
      setUnit={setUnit}
      loading={loading}
      periode={periode}
      setPeriode={setPeriode}
      unit={unit as any}
      onSearchUnit={onSearchUnit}
      maxPeriode={maxPeriode}
      data={groupAccountsByFirstDigit(dataTrialBalance) as any}
    />
  );
};

export default GeneralEdger;
