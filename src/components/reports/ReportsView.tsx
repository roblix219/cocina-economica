import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale, SaleChannel, PaymentMethod } from '../../types';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  Package,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText,
  Utensils,
  CreditCard,
  Scale,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    sales,
    cancelSale,
    expenses,
    dishes,
    recipes,
    getRecipeCost,
    menus,
    formatMoney,
    currentUser,
    selectedDate,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'hoy' | 'todos'>('hoy');
  const [selectedSaleToCancel, setSelectedSaleToCancel] = useState<Sale | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filtered sales
  const relevantSales = useMemo(() => {
    return sales.filter((s) => {
      if (s.status !== 'completada') return false;
      if (dateFilter === 'hoy') return s.date === selectedDate;
      return true;
    });
  }, [sales, dateFilter, selectedDate]);

  // Filtered expenses
  const relevantExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (dateFilter === 'hoy') return e.date === selectedDate;
      return true;
    });
  }, [expenses, dateFilter, selectedDate]);

  // Core Financial Indicators
  const totalSalesNet = useMemo(() => {
    return relevantSales.reduce((acc, s) => acc + s.total, 0);
  }, [relevantSales]);

  // Cost of Goods Sold (COGS) based on sold items * estimated cost per portion
  const totalCOGS = useMemo(() => {
    let cogs = 0;
    relevantSales.forEach((sale) => {
      sale.items.forEach((item) => {
        cogs += item.quantity * item.estimatedCostPerPortion;
      });
    });
    return Number(cogs.toFixed(2));
  }, [relevantSales]);

  const grossProfit = Number((totalSalesNet - totalCOGS).toFixed(2));
  const grossMarginPercent = totalSalesNet > 0 ? (grossProfit / totalSalesNet) * 100 : 0;

  const totalOperatingExpenses = useMemo(() => {
    return relevantExpenses.reduce((acc, e) => acc + e.amount, 0);
  }, [relevantExpenses]);

  const netOperatingProfit = Number((grossProfit - totalOperatingExpenses).toFixed(2));

  // Channel breakdown
  const localSales = relevantSales
    .filter((s) => s.channel === 'local')
    .reduce((acc, s) => acc + s.total, 0);
  const llevarSales = relevantSales
    .filter((s) => s.channel === 'llevar')
    .reduce((acc, s) => acc + s.total, 0);

  // Payment method breakdown
  const cashSales = relevantSales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((acc, s) => acc + s.total, 0);
  const transferSales = relevantSales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((acc, s) => acc + s.total, 0);

  // Top Dishes Sold Ranking
  const topDishesRanking = useMemo(() => {
    const map: Record<
      string,
      { dishName: string; quantity: number; revenue: number; cost: number }
    > = {};

    relevantSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!map[item.dishId]) {
          map[item.dishId] = {
            dishName: item.dishName,
            quantity: 0,
            revenue: 0,
            cost: 0,
          };
        }
        map[item.dishId].quantity += item.quantity;
        map[item.dishId].revenue += item.subtotal;
        map[item.dishId].cost += item.quantity * item.estimatedCostPerPortion;
      });
    });

    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [relevantSales]);

  // Handle Cancel Sale
  const handleConfirmCancelSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleToCancel || !cancelReason) return;

    cancelSale(selectedSaleToCancel.id, cancelReason);
    setSelectedSaleToCancel(null);
    setCancelReason('');
    alert('Venta cancelada. Se han restituido las porciones en el Punto de Venta.');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Reporte de Rentabilidad y Utilidad Operativa
          </h2>
          <p className="text-xs text-stone-500">
            Cálculo transparente: Ventas Netas - Costo de Insumos (COGS) - Gastos Operativos.
          </p>
        </div>

        {/* Date Filter Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setDateFilter('hoy')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              dateFilter === 'hoy'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hoy ({selectedDate})
          </button>
          <button
            onClick={() => setDateFilter('todos')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              dateFilter === 'todos'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todo el Historial
          </button>
        </div>
      </div>

      {/* Primary Financial Waterfall Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-xs">
        {/* 1. Venta Neta */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            (1) Venta Neta Total
          </span>
          <span className="text-xl font-black text-stone-900">
            {formatMoney(totalSalesNet)}
          </span>
          <span className="text-[10px] text-stone-500 block">
            {relevantSales.length} pedidos concluidos
          </span>
        </div>

        {/* 2. Costo de Ventas COGS */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            (-) Costo Insumos (COGS)
          </span>
          <span className="text-xl font-black text-amber-700">
            -{formatMoney(totalCOGS)}
          </span>
          <span className="text-[10px] text-stone-500 block">
            Porciones vendidas × CPP
          </span>
        </div>

        {/* 3. Margen Bruto */}
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block">
            (=) Margen Bruto
          </span>
          <span className="text-xl font-black text-emerald-900">
            {formatMoney(grossProfit)}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 block">
            Margen: {grossMarginPercent.toFixed(1)}%
          </span>
        </div>

        {/* 4. Gastos Operativos */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            (-) Gastos Operativos
          </span>
          <span className="text-xl font-black text-rose-700">
            -{formatMoney(totalOperatingExpenses)}
          </span>
          <span className="text-[10px] text-stone-500 block">
            Renta, gas, luz, sueldos
          </span>
        </div>

        {/* 5. Utilidad Operativa Neta */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1 sm:col-span-2 lg:col-span-1 ${
            netOperatingProfit >= 0
              ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-700'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-emerald-100 block">
            (=) Utilidad Operativa
          </span>
          <span className="text-2xl font-black">
            {formatMoney(netOperatingProfit)}
          </span>
          <span className="text-[10px] text-emerald-100 block">
            Ganancia neta estimada
          </span>
        </div>
      </div>

      {/* Explanatory Accounting Callout */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">ℹ️</span>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">
            ¿Por qué la utilidad operativa no es idéntica al dinero en el cajón de efectivo?
          </h4>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            El cajón refleja únicamente el flujo de dinero físico de hoy (fondo inicial + cobros en
            efectivo - gastos menores). La <strong>Utilidad Operativa</strong>, en cambio, deduce el
            consumo real de insumos que ya estaban en almacén (costeados con CPP) y no suma las
            transferencias al cajón, ofreciendo la ganancia económica verídica del negocio.
          </p>
        </div>
      </div>

      {/* Breakdowns: Channels & Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Canales: Local vs Llevar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-stone-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-orange-600" />
              Ventas por Canal de Servicio
            </span>
            <span className="text-stone-400 text-[11px]">100% de ventas</span>
          </h3>

          <div className="space-y-3 pt-1">
            {/* Local */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Comedor Local (Mesas):</span>
                <span>{formatMoney(localSales)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full"
                  style={{
                    width: `${totalSalesNet > 0 ? (localSales / totalSalesNet) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Para Llevar */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Para Llevar (Empaque):</span>
                <span>{formatMoney(llevarSales)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${totalSalesNet > 0 ? (llevarSales / totalSalesNet) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pago: Efectivo vs Transferencia */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-stone-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Ventas por Método de Pago
            </span>
            <span className="text-stone-400 text-[11px]">Conciliación</span>
          </h3>

          <div className="space-y-3 pt-1">
            {/* Efectivo */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Efectivo (Entra al cajón):</span>
                <span className="text-emerald-800">{formatMoney(cashSales)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${totalSalesNet > 0 ? (cashSales / totalSalesNet) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Transferencia */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Transferencia (En cuenta bancaria):</span>
                <span className="text-blue-800">{formatMoney(transferSales)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{
                    width: `${totalSalesNet > 0 ? (transferSales / totalSalesNet) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Dishes Ranking Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900">
            Platillos Más Vendidos y su Contribución al Margen
          </h3>
          <p className="text-xs text-stone-500">
            Ranking de productos por volumen de venta y utilidad bruta generada.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Platillo</th>
                <th className="py-2.5 px-3 text-right">Porciones Vendidas</th>
                <th className="py-2.5 px-3 text-right">Ingreso Total</th>
                <th className="py-2.5 px-3 text-right">Costo Insumos</th>
                <th className="py-2.5 px-3 text-right">Ganancia Bruta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {topDishesRanking.map((row, idx) => {
                const profit = row.revenue - row.cost;
                return (
                  <tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      {idx + 1}. {row.dishName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black">{row.quantity} pzs</td>
                    <td className="py-2.5 px-3 text-right">{formatMoney(row.revenue)}</td>
                    <td className="py-2.5 px-3 text-right text-stone-500">
                      {formatMoney(row.cost)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {formatMoney(profit)}
                    </td>
                  </tr>
                );
              })}
              {topDishesRanking.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    No hay ventas registradas para este periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Transactions History with Cancellation Option */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Historial de Ventas y Tickets ({relevantSales.length})
            </h3>
            <p className="text-xs text-stone-500">
              Las cancelaciones quedan registradas con motivo y reintegran las porciones vendidas.
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
          {relevantSales.map((sale) => (
            <div
              key={sale.id}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-800">{sale.folio}</span>
                  <span className="text-stone-500">· {sale.date}</span>
                  <span className="capitalize text-stone-600 bg-white px-1.5 py-0.2 rounded border">
                    {sale.channel}
                  </span>
                  <span className="capitalize text-stone-600 font-semibold">
                    ({sale.paymentMethod})
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 pt-0.5 truncate max-w-md">
                  {sale.items.map((i) => `${i.quantity}x ${i.dishName}`).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm font-black text-stone-900">
                  {formatMoney(sale.total)}
                </span>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setSelectedSaleToCancel(sale)}
                    className="text-stone-400 hover:text-rose-600 text-xs font-bold hover:underline"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
          {relevantSales.length === 0 && (
            <div className="text-center py-8 text-stone-400">
              No hay ventas en este periodo.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Cancel Sale */}
      {selectedSaleToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2 text-rose-900">
              Cancelar Venta {selectedSaleToCancel.folio}
            </h3>
            <p className="text-stone-600 leading-snug">
              Esta acción marcará el ticket como cancelado, restará el dinero del corte de caja y
              restituirá las porciones a los platillos.
            </p>

            <form onSubmit={handleConfirmCancelSale} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Motivo de Cancelación:</label>
                <textarea
                  required
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ej. Error de captura del cajero, cliente canceló pedido..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSaleToCancel(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                >
                  Confirmar Cancelación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
