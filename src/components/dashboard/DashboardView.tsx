import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Flame,
  Receipt,
  CircleDollarSign,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChefHat,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    sales,
    expenses,
    currentMenu,
    activeShift,
    selectedDate,
    selectedShift,
    lowStockIngredients,
    setCurrentView,
    formatMoney,
    currentUser,
    confirmProduction,
    dishes,
  } = useApp();

  // Filter sales for today
  const todaySales = sales.filter(
    (s) => s.date === selectedDate && s.status === 'completada'
  );
  const totalSalesAmount = todaySales.reduce((acc, s) => acc + s.total, 0);
  const cashSalesAmount = todaySales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((acc, s) => acc + s.total, 0);
  const transferSalesAmount = todaySales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((acc, s) => acc + s.total, 0);

  // Expenses of today
  const todayExpenses = expenses.filter((e) => e.date === selectedDate);
  const totalExpensesAmount = todayExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Menu stats
  const totalPlannedPortions =
    currentMenu?.items.reduce((acc, it) => acc + it.plannedPortions, 0) || 0;
  const totalPreparedPortions =
    currentMenu?.items.reduce((acc, it) => acc + (it.preparedPortions || 0), 0) || 0;
  const totalSoldPortions =
    currentMenu?.items.reduce((acc, it) => acc + (it.soldPortions || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Banner / Hero Greeting */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <ChefHat className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Turno actual: <strong className="capitalize">{selectedShift}</strong> · {selectedDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Panel de Operación Diaria
          </h1>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Monitorea en tiempo real tus ventas, porciones disponibles en cocina corrida,
            insumos y estado del cajón de dinero.
          </p>

          {/* Quick Action Bar inside Hero */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('pos')}
              className="bg-white text-orange-800 hover:bg-amber-50 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <span>Abrir Punto de Venta (Cobrar)</span>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('menu')}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 backdrop-blur-md transition flex items-center gap-2 active:scale-95"
              >
                <CalendarCheck className="w-4 h-4 text-amber-200" />
                <span>Planear Menú & Producción</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Ventas del día */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ventas de Hoy</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {formatMoney(totalSalesAmount)}
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between pt-1">
            <span>{todaySales.length} pedidos</span>
            <span className="text-emerald-700 font-semibold">
              Efec: {formatMoney(cashSalesAmount)}
            </span>
          </div>
        </div>

        {/* KPI 2: Producción & Porciones */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Producción Menú</span>
            <div className="p-2 bg-orange-50 text-orange-700 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {totalSoldPortions}{' '}
            <span className="text-xs font-medium text-stone-400">
              / {totalPreparedPortions || totalPlannedPortions} servidas
            </span>
          </div>
          <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between">
            <span className="capitalize">Turno {selectedShift}</span>
            {currentMenu?.isProductionConfirmed ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Confirmada
              </span>
            ) : (
              <span className="text-amber-600 font-bold">Por confirmar</span>
            )}
          </div>
        </div>

        {/* KPI 3: Estado de Caja */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Efectivo en Cajón</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {activeShift ? formatMoney(activeShift.expectedCash) : '$0.00'}
          </div>
          <div className="text-[11px] text-stone-500 pt-1 flex justify-between">
            <span>Fondo: {activeShift ? formatMoney(activeShift.initialCash) : '$0'}</span>
            <span className="font-semibold text-blue-700">
              Transf: {formatMoney(transferSalesAmount)}
            </span>
          </div>
        </div>

        {/* KPI 4: Gastos Operativos Registrados */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gastos de Hoy</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {formatMoney(totalExpensesAmount)}
          </div>
          <div className="text-[11px] text-stone-500 pt-1 flex justify-between">
            <span>{todayExpenses.length} gastos op.</span>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('gastos')}
                className="text-orange-700 font-bold hover:underline"
              >
                + Registrar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Operational Alerts & Actionable Notices */}
      <div className="space-y-3">
        {/* Notice 1: Production unconfirmed */}
        {currentMenu && !currentMenu.isProductionConfirmed && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  Producción pendiente de confirmación para {selectedShift.toUpperCase()}
                </h4>
                <p className="text-xs text-amber-800 leading-snug">
                  Al confirmar la preparación de hoy se descontarán los insumos del inventario
                  y se actualizarán las porciones disponibles en el Punto de Venta.
                </p>
              </div>
            </div>
            {currentUser.role === 'admin' ? (
              <button
                onClick={() => {
                  const res = confirmProduction(currentMenu.id);
                  alert(res.message);
                }}
                className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition active:scale-95"
              >
                Confirmar Producción Ahora
              </button>
            ) : (
              <span className="text-xs font-semibold text-amber-700 italic">
                (Requiere confirmación del Administrador)
              </span>
            )}
          </div>
        )}

        {/* Notice 2: Low Stock Ingredients */}
        {lowStockIngredients.length > 0 && currentUser.role === 'admin' && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-950">
                  {lowStockIngredients.length} ingredientes con existencia baja
                </h4>
                <p className="text-xs text-rose-800 leading-snug">
                  {lowStockIngredients
                    .slice(0, 3)
                    .map((i) => `${i.name} (${i.stock} ${i.unit})`)
                    .join(', ')}
                  {lowStockIngredients.length > 3 && ' y más...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('inventario')}
              className="shrink-0 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              Ver Lista de Compras
            </button>
          </div>
        )}
      </div>

      {/* Two-Column Section: Menu of the Day & Live POS preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu of the day breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                Menú Planificado para Hoy ({selectedShift.toUpperCase()})
              </h3>
              <p className="text-xs text-stone-500">
                Control de porciones planeadas, preparadas y vendidas
              </p>
            </div>
            <button
              onClick={() => setCurrentView('menu')}
              className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              <span>Editar Menú</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentMenu && currentMenu.items.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {currentMenu.items.map((item, idx) => {
                const dish = dishes.find((d) => d.id === item.dishId);
                if (!dish) return null;

                const remaining = (dish.availablePortions || 0);

                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 leading-tight">{dish.name}</p>
                        <p className="text-[11px] text-stone-500">
                          Precio: {formatMoney(dish.price)} · Prep: {item.preparedPortions || item.plannedPortions} porciones
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-extrabold text-stone-900 text-sm">
                          {item.soldPortions}
                        </span>
                        <span className="text-[10px] text-stone-400 block leading-none">
                          Vendidas
                        </span>
                      </div>
                      <div className="bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                        <span
                          className={`font-black text-xs ${
                            remaining <= 5 ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {remaining} disp.
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs space-y-2">
              <CalendarCheck className="w-8 h-8 mx-auto text-stone-300" />
              <p>No hay menú programado para este turno ({selectedShift}).</p>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('menu')}
                  className="bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs hover:bg-orange-700 transition"
                >
                  Crear o Reutilizar Menú
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Quick Status & Cash Shift */}
        <div className="space-y-4">
          {/* Shift Box */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Arqueo de Turno</span>
              <span className="capitalize text-stone-800 font-bold">{selectedShift}</span>
            </h4>

            {activeShift ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Fondo Inicial:</span>
                  <span className="font-semibold text-stone-800">
                    {formatMoney(activeShift.initialCash)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">+ Ventas Efectivo:</span>
                  <span className="font-semibold text-emerald-700">
                    +{formatMoney(activeShift.cashSalesTotal)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Ventas Transferencia:</span>
                  <span className="font-semibold text-blue-700">
                    {formatMoney(activeShift.transferSalesTotal)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-stone-900">
                  <span>Esperado en Cajón:</span>
                  <span className="text-orange-700">
                    {formatMoney(activeShift.expectedCash)}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentView('caja')}
                  className="w-full mt-2 bg-stone-900 hover:bg-stone-800 text-white py-2 rounded-xl font-bold text-xs transition"
                >
                  Hacer Corte / Arqueo de Caja
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-stone-500 space-y-2">
                <Clock className="w-6 h-6 mx-auto text-stone-300" />
                <p>No hay turno de caja abierto para este turno.</p>
                <button
                  onClick={() => setCurrentView('caja')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  Abrir Turno de Caja
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block">
              Accesos Rápidos
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentView('pos')}
                className="p-2.5 bg-white border border-amber-200 rounded-xl font-bold text-stone-800 hover:bg-amber-100/50 text-left"
              >
                🛒 Cobrar Pedido
              </button>
              <button
                onClick={() => setCurrentView('caja')}
                className="p-2.5 bg-white border border-amber-200 rounded-xl font-bold text-stone-800 hover:bg-amber-100/50 text-left"
              >
                💵 Corte de Caja
              </button>
              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => setCurrentView('inventario')}
                    className="p-2.5 bg-white border border-amber-200 rounded-xl font-bold text-stone-800 hover:bg-amber-100/50 text-left"
                  >
                    📦 Compras & CPP
                  </button>
                  <button
                    onClick={() => setCurrentView('reportes')}
                    className="p-2.5 bg-white border border-amber-200 rounded-xl font-bold text-stone-800 hover:bg-amber-100/50 text-left"
                  >
                    📊 Ver Rentabilidad
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
