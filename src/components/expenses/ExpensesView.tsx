import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OperationalExpense } from '../../types';
import {
  Receipt,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Layers,
  PieChart,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES: Array<{ id: OperationalExpense['category']; label: string }> = [
  { id: 'gas_lp', label: 'Gas LP' },
  { id: 'luz_agua', label: 'Luz y Agua' },
  { id: 'renta', label: 'Renta del Local' },
  { id: 'sueldos_nomina', label: 'Sueldos / Nómina' },
  { id: 'desechables_empaque', label: 'Desechables y Empaque' },
  { id: 'hielo', label: 'Hielo para Aguas' },
  { id: 'limpieza', label: 'Limpieza e Higiene' },
  { id: 'mantenimiento', label: 'Mantenimiento de Equipo' },
  { id: 'otros', label: 'Otros Gastos' },
];

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    addExpense,
    deleteExpense,
    formatMoney,
    currentUser,
    selectedDate,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // Form State
  const [amount, setAmount] = useState<number>(100);
  const [category, setCategory] = useState<OperationalExpense['category']>('gas_lp');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);

  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center max-w-md mx-auto my-12 space-y-3">
        <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Acceso Restringido</h3>
        <p className="text-xs text-stone-500">
          Solo el Administrador puede registrar o consultar los Gastos Operativos del negocio.
        </p>
      </div>
    );
  }

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) =>
    filterCategory === 'todos' ? true : e.category === filterCategory
  );

  const totalFilteredAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) return;

    addExpense({
      date,
      category,
      amount: Number(amount),
      paymentMethod,
      description,
      registeredBy: currentUser.name,
    });

    setIsModalOpen(false);
    setAmount(100);
    setDescription('');
    alert('Gasto operativo registrado con éxito.');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600" />
            Gastos Operativos (Exclusivo Administrador)
          </h2>
          <p className="text-xs text-stone-500">
            Registro de costos fijos y operativos (renta, gas, luz, sueldos). No duplica las compras
            de ingredientes del inventario.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Gasto</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Total Gastos Filtrados
          </span>
          <span className="text-2xl font-black text-rose-700">
            {formatMoney(totalFilteredAmount)}
          </span>
          <span className="text-[10px] text-stone-500 block">
            {filteredExpenses.length} registros en total
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Gastos de Hoy ({selectedDate})
          </span>
          <span className="text-2xl font-black text-stone-900">
            {formatMoney(
              expenses.filter((e) => e.date === selectedDate).reduce((acc, e) => acc + e.amount, 0)
            )}
          </span>
          <span className="text-[10px] text-stone-500 block">
            Afectan la utilidad operativa diaria
          </span>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
          <span>🛡️</span>
          <p className="leading-snug">
            <strong>Diferenciación contable:</strong> Las compras de carne y verdura aumentan el
            inventario y se costean por porción en las recetas. Los gastos aquí capturados son
            operativos y van directo al estado de resultados.
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('todos')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterCategory === 'todos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              filterCategory === cat.id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Descripción / Concepto</th>
                <th className="py-3 px-4">Forma de Pago</th>
                <th className="py-3 px-4">Registrado por</th>
                <th className="py-3 px-4 text-right">Monto ($)</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-4 text-stone-500">{exp.date}</td>
                  <td className="py-3 px-4 font-bold text-stone-900 capitalize">
                    {exp.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-stone-700 max-w-sm truncate">
                    {exp.description}
                  </td>
                  <td className="py-3 px-4 text-stone-500 capitalize">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 text-stone-500">{exp.registeredBy}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-700 text-sm">
                    {formatMoney(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este registro de gasto?')) {
                          deleteExpense(exp.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No hay gastos operativos registrados en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nuevo Gasto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2">
              Registrar Gasto Operativo
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Categoría del Gasto:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OperationalExpense['category'])}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Monto Pagado ($):</label>
                <input
                  type="number"
                  step="5"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center font-bold text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Fecha del Gasto:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Método de Pago:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'efectivo' | 'transferencia')}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold capitalize"
                  >
                    <option value="efectivo">Efectivo (Caja)</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Descripción / Proveedor del Servicio:</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Carga de tanque de gas, recibo CFE bimestre..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
