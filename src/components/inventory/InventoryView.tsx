import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ingredient, PurchaseItem, Supplier, UnitType } from '../../types';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Scale,
  DollarSign,
  History,
  Building,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    ingredients,
    addIngredient,
    updateIngredient,
    adjustInventoryStock,
    inventoryMovements,
    lowStockIngredients,
    suppliers,
    addSupplier,
    purchases,
    registerPurchase,
    generateShoppingList,
    formatMoney,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'insumos' | 'compras' | 'lista' | 'movimientos'>('insumos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewIngModalOpen, setIsNewIngModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustTargetIng, setAdjustTargetIng] = useState<Ingredient | null>(null);
  const [adjustNewStock, setAdjustNewStock] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // New Purchase Form state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Temp purchase row
  const [tempIngId, setTempIngId] = useState('');
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New Ingredient form state
  const [ingName, setIngName] = useState('');
  const [ingCategory, setIngCategory] = useState('Verduras');
  const [ingUnit, setIngUnit] = useState<UnitType>('kg');
  const [ingStock, setIngStock] = useState<number>(10);
  const [ingMinStock, setIngMinStock] = useState<number>(3);
  const [ingInitialCost, setIngInitialCost] = useState<number>(30);

  // Filtered ingredients
  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shoppingList = generateShoppingList();
  const totalShoppingListCost = shoppingList.reduce((acc, item) => acc + item.estimatedCost, 0);

  // Open Adjust Modal
  const handleOpenAdjust = (ing: Ingredient) => {
    setAdjustTargetIng(ing);
    setAdjustNewStock(ing.stock);
    setAdjustReason('');
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetIng) return;
    adjustInventoryStock(
      adjustTargetIng.id,
      Number(adjustNewStock),
      adjustReason,
      currentUser.name
    );
    setIsAdjustModalOpen(false);
    alert('Existencia ajustada con éxito en la bitácora.');
  };

  // Add Item to Purchase Form
  const handleAddPurchaseItem = () => {
    if (!tempIngId || tempQty <= 0 || tempPrice <= 0) return;
    const ing = ingredients.find((i) => i.id === tempIngId);
    if (!ing) return;

    setPurchaseItems((prev) => [
      ...prev,
      {
        ingredientId: ing.id,
        ingredientName: ing.name,
        quantity: Number(tempQty),
        unit: ing.unit,
        unitPrice: Number(tempPrice),
        total: Number((tempQty * tempPrice).toFixed(2)),
      },
    ]);

    setTempIngId('');
    setTempQty(1);
    setTempPrice(0);
  };

  const handleRemovePurchaseItem = (idx: number) => {
    setPurchaseItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Finalize Purchase
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseSupplierId || purchaseItems.length === 0) {
      alert('Por favor selecciona un proveedor y agrega al menos un insumo.');
      return;
    }

    const supplier = suppliers.find((s) => s.id === purchaseSupplierId);
    const purchaseTotal = purchaseItems.reduce((acc, i) => acc + i.total, 0);

    registerPurchase({
      supplierId: purchaseSupplierId,
      supplierName: supplier?.name || 'Proveedor General',
      date: purchaseDate,
      items: purchaseItems,
      total: Number(purchaseTotal.toFixed(2)),
      paymentMethod: purchasePaymentMethod,
      registeredBy: currentUser.name,
      notes: purchaseNotes,
    });

    setIsPurchaseModalOpen(false);
    setPurchaseItems([]);
    setPurchaseNotes('');
    alert('¡Compra registrada con éxito! El Costo Promedio Ponderado (CPP) e inventario se han actualizado.');
  };

  // Save New Ingredient
  const handleSaveNewIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName) return;

    addIngredient({
      name: ingName,
      category: ingCategory,
      unit: ingUnit,
      stock: Number(ingStock),
      minStock: Number(ingMinStock),
      costPerUnit: Number(ingInitialCost),
    });

    setIsNewIngModalOpen(false);
    setIngName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-orange-600" />
            Inventario de Insumos y Compras (CPP)
          </h2>
          <p className="text-xs text-stone-500">
            Control de existencias, compras con Costo Promedio Ponderado y lista de compras sugerida.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsPurchaseModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Registrar Compra (Entrada)</span>
            </button>

            <button
              onClick={() => setIsNewIngModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Insumo</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('insumos')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'insumos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Existencias de Insumos ({ingredients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'lista'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Lista de Compras Sugerida</span>
          {shoppingList.filter((s) => s.toBuy > 0).length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 rounded-full font-black">
              {shoppingList.filter((s) => s.toBuy > 0).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('compras')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'compras'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Historial de Compras ({purchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movimientos')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'movimientos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Bitácora de Movimientos</span>
        </button>
      </div>

      {/* Tab 1: Existencias de Insumos */}
      {activeTab === 'insumos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar ingrediente o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            {lowStockIngredients.length > 0 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockIngredients.length} insumos en nivel crítico
              </span>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Insumo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-right">Existencia Actual</th>
                    <th className="py-3 px-4 text-right">Mínimo</th>
                    <th className="py-3 px-4 text-right">CPP (Costo Promedio)</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {filteredIngredients.map((ing) => {
                    const isLow = ing.stock <= ing.minStock;

                    return (
                      <tr key={ing.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3 px-4 font-bold text-stone-900">{ing.name}</td>
                        <td className="py-3 px-4 text-stone-500">{ing.category}</td>
                        <td className="py-3 px-4 text-right font-black text-sm">
                          {ing.stock} <span className="text-stone-400 text-xs font-normal">{ing.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-stone-500">
                          {ing.minStock} {ing.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-orange-900">
                          {formatMoney(ing.costPerUnit)} / {ing.unit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isLow
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isLow ? 'Bajo Stock' : 'Normal'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => handleOpenAdjust(ing)}
                              className="text-orange-700 hover:text-orange-900 font-bold underline text-[11px]"
                            >
                              Ajustar / Merma
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lista de Compras Sugerida */}
      {activeTab === 'lista' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-amber-700" />
                Insumos a comprar para la producción planificada de hoy
              </h3>
              <p className="text-xs text-amber-800">
                Se calcula comparando las porciones planeadas en el menú con las existencias actuales.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-800 font-bold block">Gasto Estimado:</span>
              <span className="text-xl font-black text-amber-950">
                {formatMoney(totalShoppingListCost)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ingrediente</th>
                    <th className="py-3 px-4 text-right">Necesario para Menú</th>
                    <th className="py-3 px-4 text-right">En Bodega</th>
                    <th className="py-3 px-4 text-right">Comprar (Faltante)</th>
                    <th className="py-3 px-4 text-right">Costo Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {shoppingList.map((item, idx) => (
                    <tr key={idx} className={item.toBuy > 0 ? 'bg-amber-50/40' : ''}>
                      <td className="py-3 px-4 font-bold text-stone-900">{item.ingredient.name}</td>
                      <td className="py-3 px-4 text-right">{item.needed} {item.ingredient.unit}</td>
                      <td className="py-3 px-4 text-right text-stone-500">{item.current} {item.ingredient.unit}</td>
                      <td className="py-3 px-4 text-right font-black text-orange-700">
                        {item.toBuy > 0 ? `${item.toBuy} ${item.ingredient.unit}` : '0 (Cubierto)'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900">
                        {formatMoney(item.estimatedCost)}
                      </td>
                    </tr>
                  ))}
                  {shoppingList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-400">
                        No hay menú activo para calcular la lista de compras.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Historial de Compras */}
      {activeTab === 'compras' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {purchases.map((pur) => (
              <div
                key={pur.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-mono font-bold text-orange-800 text-sm">
                      {pur.folio}
                    </span>
                    <span className="text-stone-500 ml-2">
                      Proveedor: <strong>{pur.supplierName}</strong> · Fecha: {pur.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-stone-900">
                      {formatMoney(pur.total)}
                    </span>
                    <span className="text-[10px] text-stone-500 capitalize ml-2">
                      ({pur.paymentMethod})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-[11px] text-stone-600">
                  {pur.items.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                      <span className="font-bold text-stone-900 block">{item.ingredientName}</span>
                      <span>
                        {item.quantity} {item.unit} @ {formatMoney(item.unitPrice)} = {formatMoney(item.total)}
                      </span>
                    </div>
                  ))}
                </div>

                {pur.notes && (
                  <p className="text-[10px] text-stone-400 italic">Notas: {pur.notes}</p>
                )}
              </div>
            ))}

            {purchases.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs">
                No hay compras registradas aún. Haz clic en "Registrar Compra" para agregar una entrada.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Bitácora de Movimientos */}
      {activeTab === 'movimientos' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Insumo</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-right">Variación</th>
                  <th className="py-3 px-4 text-right">Stock Final</th>
                  <th className="py-3 px-4">Motivo / Justificación</th>
                  <th className="py-3 px-4">Autorizado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {inventoryMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td className="py-3 px-4 text-stone-500">{mov.date}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{mov.ingredientName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mov.type === 'compra'
                            ? 'bg-emerald-100 text-emerald-800'
                            : mov.type === 'produccion'
                            ? 'bg-blue-100 text-blue-800'
                            : mov.type === 'merma'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-black ${
                        mov.quantityChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-800">
                      {mov.finalStock}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">{mov.reason}</td>
                    <td className="py-3 px-4 text-stone-500">{mov.authorizedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Ajustar Stock / Merma */}
      {isAdjustModalOpen && adjustTargetIng && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm border-b border-stone-200 pb-2">
              Ajuste de Existencia / Registro de Merma
            </h3>
            <div>
              <p className="font-bold text-stone-900">{adjustTargetIng.name}</p>
              <p className="text-stone-500 text-[11px]">
                Stock actual en sistema: {adjustTargetIng.stock} {adjustTargetIng.unit}
              </p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Nueva Existencia Física Real:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={adjustNewStock}
                    onChange={(e) => setAdjustNewStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-center"
                  />
                  <span className="font-bold text-stone-600">{adjustTargetIng.unit}</span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Motivo o Justificación:</label>
                <textarea
                  required
                  rows={2}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ej. Merma por descompostura, diferencia en conteo físico semanal..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Compra (Entrada con CPP) */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95 my-auto">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2">
              Registrar Compra de Insumos (Actualización de CPP)
            </h3>

            <form onSubmit={handleSavePurchase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Proveedor:</label>
                  <select
                    required
                    value={purchaseSupplierId}
                    onChange={(e) => setPurchaseSupplierId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar proveedor --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Fecha de Compra:</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Forma de Pago:</label>
                  <select
                    value={purchasePaymentMethod}
                    onChange={(e) => setPurchasePaymentMethod(e.target.value as 'efectivo' | 'transferencia')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              {/* Add item to invoice */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 block">Agregar Insumos Adquiridos:</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <select
                      value={tempIngId}
                      onChange={(e) => {
                        setTempIngId(e.target.value);
                        const found = ingredients.find((i) => i.id === e.target.value);
                        if (found) setTempPrice(found.costPerUnit);
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar insumo --</option>
                      {ingredients.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Cantidad"
                      value={tempQty}
                      onChange={(e) => setTempQty(Math.max(0.1, Number(e.target.value)))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-center font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      placeholder="P. Unit ($)"
                      value={tempPrice === 0 ? '' : tempPrice}
                      onChange={(e) => setTempPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-right font-bold"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddPurchaseItem}
                      disabled={!tempIngId || tempPrice <= 0}
                      className="w-full bg-orange-600 text-white font-bold py-1.5 rounded-xl hover:bg-orange-700 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Items in purchase list */}
                <div className="space-y-1 pt-2 max-h-36 overflow-y-auto">
                  {purchaseItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white p-2 rounded-xl border border-stone-200"
                    >
                      <span className="font-bold text-stone-900">{item.ingredientName}</span>
                      <div className="flex items-center gap-3">
                        <span>
                          {item.quantity} {item.unit} @ {formatMoney(item.unitPrice)} ={' '}
                          <strong>{formatMoney(item.total)}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePurchaseItem(idx)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {purchaseItems.length === 0 && (
                    <p className="text-[11px] text-stone-400 italic text-center py-2">
                      Sin insumos agregados aún a esta compra.
                    </p>
                  )}
                </div>
              </div>

              {/* Total Purchase Bar */}
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-950">Total de la Factura/Nota:</span>
                <span className="text-xl font-black text-emerald-900">
                  {formatMoney(purchaseItems.reduce((acc, i) => acc + i.total, 0))}
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Notas de la compra:</label>
                <input
                  type="text"
                  value={purchaseNotes}
                  onChange={(e) => setPurchaseNotes(e.target.value)}
                  placeholder="Ej. Factura A-1029, entrega a tiempo"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Insumo */}
      {isNewIngModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm border-b border-stone-200 pb-2">
              Registrar Nuevo Insumo / Ingrediente
            </h3>

            <form onSubmit={handleSaveNewIngredient} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Nombre del Insumo:</label>
                <input
                  type="text"
                  required
                  value={ingName}
                  onChange={(e) => setIngName(e.target.value)}
                  placeholder="Ej. Cebolla morada, Ajo pelado"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Categoría:</label>
                  <select
                    value={ingCategory}
                    onChange={(e) => setIngCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold"
                  >
                    <option value="Carnes">Carnes</option>
                    <option value="Verduras">Verduras</option>
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="Lácteos/Huevo">Lácteos/Huevo</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Unidad Base:</label>
                  <select
                    value={ingUnit}
                    onChange={(e) => setIngUnit(e.target.value as UnitType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lt">lt</option>
                    <option value="ml">ml</option>
                    <option value="pza">pza</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-1">Stock Inicial:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={ingStock}
                    onChange={(e) => setIngStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-1.5 text-xs text-center font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Mínimo:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={ingMinStock}
                    onChange={(e) => setIngMinStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-1.5 text-xs text-center font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Costo ($):</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={ingInitialCost}
                    onChange={(e) => setIngInitialCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-1.5 text-xs text-right font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewIngModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
