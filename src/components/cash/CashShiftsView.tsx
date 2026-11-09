import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CashShift, ShiftType } from '../../types';
import {
  CircleDollarSign,
  Lock,
  Unlock,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const CashShiftsView: React.FC = () => {
  const {
    cashShifts,
    activeShift,
    openShift,
    closeShift,
    addCashMovement,
    selectedDate,
    selectedShift,
    formatMoney,
    currentUser,
    config,
  } = useApp();

  // Modals state
  const [isOpenShiftModalOpen, setIsOpenShiftModalOpen] = useState(false);
  const [initialCashInput, setInitialCashInput] = useState<number>(500);

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [countedCashInput, setCountedCashInput] = useState<number>(0);
  const [closeNotesInput, setCloseNotesInput] = useState('');

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'entrada' | 'salida'>('salida');
  const [movementAmount, setMovementAmount] = useState<number>(50);
  const [movementReason, setMovementReason] = useState('');

  // Selected shift to view corte printable
  const [selectedShiftForPrint, setSelectedShiftForPrint] = useState<CashShift | null>(null);

  // Handle open shift
  const handleConfirmOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(selectedDate, selectedShift, Number(initialCashInput), currentUser.name);
    setIsOpenShiftModalOpen(false);
    alert(`Turno de ${selectedShift.toUpperCase()} abierto exitosamente con fondo de ${formatMoney(initialCashInput)}.`);
  };

  // Open close modal
  const handleOpenCloseModal = () => {
    if (!activeShift) return;
    setCountedCashInput(activeShift.expectedCash);
    setCloseNotesInput('');
    setIsCloseModalOpen(true);
  };

  const handleConfirmCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    closeShift(activeShift.id, Number(countedCashInput), currentUser.name, closeNotesInput);
    setIsCloseModalOpen(false);
    alert('Corte de caja finalizado exitosamente.');
  };

  // Handle Cash Movement
  const handleConfirmCashMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift || movementAmount <= 0) return;
    addCashMovement(activeShift.id, movementType, movementAmount, movementReason);
    setIsMovementModalOpen(false);
    setMovementReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-orange-600" />
            Caja y Cortes de Turno (Desayuno y Comida)
          </h2>
          <p className="text-xs text-stone-500">
            Control físico de cajón: fondo inicial, ventas en efectivo, entradas/salidas y conciliación
            de arqueo sin mezclar transferencias.
          </p>
        </div>

        {/* Action Button depending on shift status */}
        <div className="flex flex-wrap gap-2">
          {!activeShift ? (
            <button
              onClick={() => {
                setInitialCashInput(500);
                setIsOpenShiftModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Abrir Turno de {selectedShift.toUpperCase()}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setMovementType('salida');
                  setMovementAmount(50);
                  setMovementReason('');
                  setIsMovementModalOpen(true);
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold px-3 py-2 rounded-xl text-xs transition"
              >
                + Movimiento de Efectivo
              </button>

              <button
                onClick={handleOpenCloseModal}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Hacer Corte y Cerrar Turno</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Active Shift Live Cockpit Card */}
      {activeShift ? (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
          {/* Header of Active Shift */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 capitalize">
                  Turno Activo: {activeShift.shift} ({activeShift.date})
                </h3>
                <p className="text-xs text-stone-500">
                  Abierto a las {activeShift.openedAt.split('T')[1]?.slice(0, 5) || '08:00'} por {activeShift.openedBy}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-stone-400 block">
                EFECTIVO ESPERADO EN CAJÓN:
              </span>
              <span className="text-2xl font-black text-orange-700 font-mono">
                {formatMoney(activeShift.expectedCash)}
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {/* Box 1: Fondo Inicial */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Fondo Inicial (Caja)
              </span>
              <span className="text-lg font-black text-stone-900">
                {formatMoney(activeShift.initialCash)}
              </span>
              <span className="text-[10px] text-stone-400 block">Cambio disponible</span>
            </div>

            {/* Box 2: Ventas Efectivo */}
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                + Ventas en Efectivo
              </span>
              <span className="text-lg font-black text-emerald-900">
                +{formatMoney(activeShift.cashSalesTotal)}
              </span>
              <span className="text-[10px] text-emerald-700 block">En cajón físico</span>
            </div>

            {/* Box 3: Entradas adicionales */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                + Entradas de Efectivo
              </span>
              <span className="text-lg font-black text-stone-900">
                +{formatMoney(activeShift.cashInTotal)}
              </span>
              <span className="text-[10px] text-stone-400 block">Aportes / Reposición</span>
            </div>

            {/* Box 4: Salidas de efectivo */}
            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">
                - Salidas de Efectivo
              </span>
              <span className="text-lg font-black text-rose-900">
                -{formatMoney(activeShift.cashOutTotal)}
              </span>
              <span className="text-[10px] text-rose-700 block">Pagos de caja menor</span>
            </div>

            {/* Box 5: Transferencias (Apartadas) */}
            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">
                Ventas Transferencia
              </span>
              <span className="text-lg font-black text-blue-900">
                {formatMoney(activeShift.transferSalesTotal)}
              </span>
              <span className="text-[10px] text-blue-700 block font-medium">
                En cuenta bancaria
              </span>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="text-base shrink-0">💡</span>
            <p className="leading-snug">
              <strong>Control de arqueo:</strong> Al realizar el corte, cuenta físicamente los
              billetes y monedas de tu cajón. El sistema comparará tu conteo contra el Efectivo
              Esperado ({formatMoney(activeShift.expectedCash)}) y calculará si hay sobrante,
              faltante o si está cuadrado exacto.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-stone-50 rounded-3xl border border-dashed border-stone-300 p-8 text-center space-y-3">
          <Clock className="w-10 h-10 mx-auto text-stone-400" />
          <h3 className="text-base font-bold text-stone-800">
            No hay turno de caja abierto para {selectedShift.toUpperCase()}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Abre el turno indicando con cuánto fondo en efectivo inicias el servicio para registrar
            ventas y cobros.
          </p>
          <button
            onClick={() => {
              setInitialCashInput(500);
              setIsOpenShiftModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95 inline-flex items-center gap-1.5"
          >
            <Unlock className="w-4 h-4" />
            <span>Abrir Turno de {selectedShift.toUpperCase()}</span>
          </button>
        </div>
      )}

      {/* History of Past Shifts (Cortes Realizados) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900">
          Historial de Cortes de Caja Anteriores
        </h3>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Fecha / Turno</th>
                  <th className="py-3 px-4">Horario</th>
                  <th className="py-3 px-4 text-right">Fondo Inicial</th>
                  <th className="py-3 px-4 text-right">Venta Efectivo</th>
                  <th className="py-3 px-4 text-right">Venta Transf.</th>
                  <th className="py-3 px-4 text-right">Esperado</th>
                  <th className="py-3 px-4 text-right">Contado</th>
                  <th className="py-3 px-4 text-center">Diferencia</th>
                  <th className="py-3 px-4 text-center">Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {cashShifts.map((shift) => {
                  const isClosed = shift.status === 'cerrado';
                  const diff = shift.difference || 0;

                  return (
                    <tr key={shift.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block">{shift.date}</span>
                        <span className="text-[10px] uppercase font-bold text-orange-700">
                          {shift.shift}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {shift.openedAt.split('T')[1]?.slice(0, 5)} -{' '}
                        {shift.closedAt ? shift.closedAt.split('T')[1]?.slice(0, 5) : 'En curso'}
                      </td>
                      <td className="py-3 px-4 text-right">{formatMoney(shift.initialCash)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-800">
                        {formatMoney(shift.cashSalesTotal)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-800">
                        {formatMoney(shift.transferSalesTotal)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-800">
                        {formatMoney(shift.expectedCash)}
                      </td>
                      <td className="py-3 px-4 text-right font-black">
                        {isClosed ? formatMoney(shift.countedCash || 0) : 'Pendiente'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isClosed ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              diff === 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : diff > 0
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {diff === 0
                              ? 'Cuadrado $0'
                              : diff > 0
                              ? `Sobrante +${formatMoney(diff)}`
                              : `Faltante ${formatMoney(diff)}`}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">Abierto</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedShiftForPrint(shift)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          title="Ver comprobante de corte"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Abrir Turno */}
      {isOpenShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-emerald-600" />
              Apertura de Turno de Caja
            </h3>
            <p className="text-stone-600">
              Inicia el turno de <strong className="capitalize">{selectedShift}</strong> para la fecha{' '}
              <strong>{selectedDate}</strong>.
            </p>

            <form onSubmit={handleConfirmOpenShift} className="space-y-4">
              <div>
                <label className="font-bold block mb-1">
                  Fondo Inicial en Efectivo (Billetes y monedas para cambio):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={initialCashInput}
                    onChange={(e) => setInitialCashInput(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-base font-bold text-stone-900 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenShiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Confirmar Apertura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cerrar Turno / Arqueo */}
      {isCloseModalOpen && activeShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2 flex items-center gap-2 text-orange-950">
              <Lock className="w-5 h-5 text-orange-600" />
              Arqueo y Cierre de Turno de Caja
            </h3>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex justify-between">
                <span>Efectivo Teórico Esperado:</span>
                <span className="font-bold text-sm text-stone-900">
                  {formatMoney(activeShift.expectedCash)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Ventas Transferencia (banco):</span>
                <span>{formatMoney(activeShift.transferSalesTotal)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmCloseShift} className="space-y-4">
              <div>
                <label className="font-bold block mb-1">
                  Efectivo Contado Físicamente en Cajón ($):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={countedCashInput}
                    onChange={(e) => setCountedCashInput(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-lg font-bold text-stone-900 text-center"
                  />
                </div>
              </div>

              {/* Variance Indicator */}
              {(() => {
                const diff = Number((countedCashInput - activeShift.expectedCash).toFixed(2));
                return (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      diff === 0
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : diff > 0
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    <span>Diferencia de Caja:</span>
                    <span className="text-sm font-black font-mono">
                      {diff === 0
                        ? '✓ Cuadrado Exacto ($0.00)'
                        : diff > 0
                        ? `Sobrante +${formatMoney(diff)}`
                        : `Faltante ${formatMoney(diff)}`}
                    </span>
                  </div>
                );
              })()}

              <div>
                <label className="font-bold block mb-1">Observaciones / Notas del Cierre:</label>
                <textarea
                  rows={2}
                  value={closeNotesInput}
                  onChange={(e) => setCloseNotesInput(e.target.value)}
                  placeholder="Ej. Se dejaron $500 de fondo para el turno de comida..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-md"
                >
                  Confirmar y Cerrar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Movimiento de Efectivo (Entrada o Salida) */}
      {isMovementModalOpen && activeShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm border-b border-stone-200 pb-2">
              Registrar Movimiento de Efectivo en Cajón
            </h3>

            <form onSubmit={handleConfirmCashMovement} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMovementType('salida')}
                  className={`py-2 px-3 rounded-xl border font-bold ${
                    movementType === 'salida'
                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  - Salida (Caja Chica)
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('entrada')}
                  className={`py-2 px-3 rounded-xl border font-bold ${
                    movementType === 'entrada'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  + Entrada (Aporte)
                </button>
              </div>

              <div>
                <label className="font-bold block mb-1">Monto en Efectivo ($):</label>
                <input
                  type="number"
                  step="5"
                  min="1"
                  required
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Motivo o Concepto:</label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder="Ej. Compra de bolsa de hielo, cambio de monedas..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Comprobante Formal de Corte de Caja */}
      {selectedShiftForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 my-auto space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-orange-800">
                Reporte de Corte de Caja
              </span>
              <button
                onClick={() => setSelectedShiftForPrint(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {/* Thermal ticket style box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-dashed border-stone-300 font-mono text-xs text-stone-800 space-y-2">
              <div className="text-center space-y-0.5">
                <h4 className="font-black text-sm uppercase">{config.name}</h4>
                <p className="text-[10px] text-stone-500">CORTE DE CAJA - TURNO {selectedShiftForPrint.shift.toUpperCase()}</p>
                <p className="text-[10px] text-stone-500">Fecha: {selectedShiftForPrint.date}</p>
              </div>

              <div className="border-t border-dashed border-stone-300 my-2" />

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Apertura:</span>
                  <span>{selectedShiftForPrint.openedAt.split('T')[1]?.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cierre:</span>
                  <span>{selectedShiftForPrint.closedAt?.split('T')[1]?.slice(0, 5) || 'Abierto'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Responsable:</span>
                  <span>{selectedShiftForPrint.closedBy || selectedShiftForPrint.openedBy}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-stone-300 my-2" />

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Fondo Inicial:</span>
                  <span>{formatMoney(selectedShiftForPrint.initialCash)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>(+) Ventas Efectivo:</span>
                  <span>{formatMoney(selectedShiftForPrint.cashSalesTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>(+) Entradas Caja:</span>
                  <span>{formatMoney(selectedShiftForPrint.cashInTotal)}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>(-) Salidas Caja:</span>
                  <span>-{formatMoney(selectedShiftForPrint.cashOutTotal)}</span>
                </div>

                <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                  <span>ESPERADO CAJÓN:</span>
                  <span>{formatMoney(selectedShiftForPrint.expectedCash)}</span>
                </div>

                {selectedShiftForPrint.status === 'cerrado' && (
                  <>
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>CONTADO FÍSICO:</span>
                      <span>{formatMoney(selectedShiftForPrint.countedCash || 0)}</span>
                    </div>

                    <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-300">
                      <span>DIFERENCIA:</span>
                      <span>
                        {(selectedShiftForPrint.difference || 0) === 0
                          ? '$0.00 (EXACTO)'
                          : formatMoney(selectedShiftForPrint.difference || 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-dashed border-stone-300 my-2" />

              {/* Transfers summary */}
              <div className="text-[10px] text-stone-600 bg-stone-200/50 p-2 rounded">
                <div className="flex justify-between font-bold">
                  <span>Ventas Transferencia:</span>
                  <span>{formatMoney(selectedShiftForPrint.transferSalesTotal)}</span>
                </div>
                <p className="text-[9px] text-stone-400 mt-0.5">
                  *Verificado en banco. No afecta cajón físico.
                </p>
              </div>

              {selectedShiftForPrint.notes && (
                <p className="text-[10px] text-stone-500 italic pt-1">
                  Nota: {selectedShiftForPrint.notes}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Corte</span>
              </button>
              <button
                onClick={() => setSelectedShiftForPrint(null)}
                className="flex-1 py-2 rounded-xl border border-stone-300 font-bold text-xs text-stone-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
