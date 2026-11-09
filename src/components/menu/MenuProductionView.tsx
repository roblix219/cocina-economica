import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyMenu, MenuPlanItem, ShiftType } from '../../types';
import {
  CalendarDays,
  Copy,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  Package,
  Layers,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MenuProductionView: React.FC = () => {
  const {
    menus,
    currentMenu,
    saveMenuPlan,
    duplicateMenu,
    confirmProduction,
    recordLeftoversAndWaste,
    dishes,
    recipes,
    ingredients,
    selectedDate,
    setSelectedDate,
    selectedShift,
    setSelectedShift,
    formatMoney,
    currentUser,
    getRecipeCost,
  } = useApp();

  // State for cloning / reusing previous menu modal
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [sourceDate, setSourceDate] = useState(selectedDate);
  const [sourceShift, setSourceShift] = useState<ShiftType>('comida');

  // State for adding a dish to current menu
  const [selectedDishToAdd, setSelectedDishToAdd] = useState('');
  const [portionsToPlan, setPortionsToPlan] = useState(25);

  // State for leftovers and waste modal
  const [showLeftoversModal, setShowLeftoversModal] = useState(false);
  const [leftoversData, setLeftoversData] = useState<
    Array<{ dishId: string; leftoverPortions: number; wastePortions: number }>
  >([]);

  // Calculate ingredients needed for planned production of this menu
  const ingredientRequirements = useMemo(() => {
    if (!currentMenu) return [];

    const reqMap: Record<string, number> = {};

    currentMenu.items.forEach((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);
      if (dish?.recipeId) {
        const recipe = recipes.find((r) => r.id === dish.recipeId);
        if (recipe && recipe.portionsYield > 0) {
          const qty = item.preparedPortions > 0 ? item.preparedPortions : item.plannedPortions;
          const mult = qty / recipe.portionsYield;

          recipe.ingredients.forEach((ri) => {
            let effQty = ri.quantity * mult;
            const ing = ingredients.find((i) => i.id === ri.ingredientId);
            if (ing) {
              if (ing.unit === 'kg' && ri.unit === 'g') effQty /= 1000;
              if (ing.unit === 'lt' && ri.unit === 'ml') effQty /= 1000;
              reqMap[ing.id] = (reqMap[ing.id] || 0) + effQty;
            }
          });
        }
      }
    });

    return Object.entries(reqMap).map(([ingId, requiredQty]) => {
      const ing = ingredients.find((i) => i.id === ingId);
      return {
        ingredient: ing!,
        requiredQty: Number(requiredQty.toFixed(2)),
        currentStock: ing?.stock ?? 0,
        hasDeficit: (ing?.stock ?? 0) < requiredQty,
      };
    }).filter((r) => Boolean(r.ingredient));
  }, [currentMenu, dishes, recipes, ingredients]);

  // Handle adding dish to plan
  const handleAddDishToMenu = () => {
    if (!selectedDishToAdd) return;
    const dish = dishes.find((d) => d.id === selectedDishToAdd);
    if (!dish) return;

    let targetMenu = currentMenu;
    if (!targetMenu) {
      targetMenu = {
        id: `menu-${selectedDate}-${selectedShift}-${Date.now()}`,
        date: selectedDate,
        shift: selectedShift,
        items: [],
        isProductionConfirmed: false,
      };
    }

    const existingItem = targetMenu.items.find((i) => i.dishId === dish.id);
    let updatedItems: MenuPlanItem[];

    if (existingItem) {
      updatedItems = targetMenu.items.map((i) =>
        i.dishId === dish.id
          ? {
              ...i,
              plannedPortions: i.plannedPortions + portionsToPlan,
              preparedPortions: i.plannedPortions + portionsToPlan,
            }
          : i
      );
    } else {
      updatedItems = [
        ...targetMenu.items,
        {
          dishId: dish.id,
          plannedPortions: portionsToPlan,
          preparedPortions: portionsToPlan,
          soldPortions: 0,
          leftoverPortions: 0,
          wastePortions: 0,
          status: 'planeado',
        },
      ];
    }

    saveMenuPlan({
      ...targetMenu,
      items: updatedItems,
    });

    setSelectedDishToAdd('');
  };

  // Update planned portions directly
  const handleUpdateItemPortions = (dishId: string, planned: number) => {
    if (!currentMenu) return;
    const updatedItems = currentMenu.items.map((i) =>
      i.dishId === dishId
        ? {
            ...i,
            plannedPortions: planned,
            preparedPortions: planned,
          }
        : i
    );
    saveMenuPlan({ ...currentMenu, items: updatedItems });
  };

  // Remove dish from menu
  const handleRemoveItem = (dishId: string) => {
    if (!currentMenu) return;
    const updatedItems = currentMenu.items.filter((i) => i.dishId !== dishId);
    saveMenuPlan({ ...currentMenu, items: updatedItems });
  };

  // Open Leftovers and Waste modal
  const handleOpenLeftoversModal = () => {
    if (!currentMenu) return;
    setLeftoversData(
      currentMenu.items.map((i) => ({
        dishId: i.dishId,
        leftoverPortions: i.leftoverPortions || 0,
        wastePortions: i.wastePortions || 0,
      }))
    );
    setShowLeftoversModal(true);
  };

  // Save leftovers & waste
  const handleSaveLeftovers = () => {
    if (!currentMenu) return;
    recordLeftoversAndWaste(currentMenu.id, leftoversData);
    setShowLeftoversModal(false);
    alert('Sobrantes y mermas registradas exitosamente.');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-600" />
              Planificación y Producción de Menú
            </h2>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 capitalize">
              Turno {selectedShift}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Define las porciones para hoy, revisa los insumos necesarios y confirma la preparación
            para descontar ingredientes sin duplicar en ventas.
          </p>
        </div>

        {/* Action Button: Reutilizar / Duplicar Menú Anterior */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowDuplicateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition border border-stone-300 active:scale-95"
            >
              <Copy className="w-4 h-4 text-orange-600" />
              <span>Reutilizar Menú Anterior</span>
            </button>
          )}

          {currentMenu && currentMenu.isProductionConfirmed && (
            <button
              onClick={handleOpenLeftoversModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition active:scale-95"
            >
              <span>Registrar Sobrantes / Mermas</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Dishes in Menu, Right Requirements Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Dish Planner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add Dish Bar (Admin only) */}
          {currentUser.role === 'admin' && (!currentMenu || !currentMenu.isProductionConfirmed) && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-orange-600" />
                Agregar Platillo al Menú de Hoy
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedDishToAdd}
                  onChange={(e) => setSelectedDishToAdd(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Seleccionar platillo o guisado --</option>
                  {dishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} ({formatMoney(dish.price)})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      step="5"
                      value={portionsToPlan}
                      onChange={(e) => setPortionsToPlan(Math.max(1, Number(e.target.value)))}
                      placeholder="Porciones"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-center text-stone-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    onClick={handleAddDishToMenu}
                    disabled={!selectedDishToAdd}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Current Menu Dishes Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Platillos en el Menú ({currentMenu?.items.length || 0})
                </h3>
                <p className="text-xs text-stone-500">
                  Estado:{' '}
                  {currentMenu?.isProductionConfirmed ? (
                    <strong className="text-emerald-700 font-bold">
                      ✓ Producción Confirmada y Cargada al POS
                    </strong>
                  ) : (
                    <strong className="text-amber-600 font-bold">
                      Pendiente de Confirmar en Cocina
                    </strong>
                  )}
                </p>
              </div>

              {/* Confirm Production Big Button */}
              {currentMenu && !currentMenu.isProductionConfirmed && (
                <button
                  onClick={() => {
                    const res = confirmProduction(currentMenu.id);
                    alert(res.message);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>Confirmar Producción</span>
                </button>
              )}
            </div>

            {currentMenu && currentMenu.items.length > 0 ? (
              <div className="space-y-2.5">
                {currentMenu.items.map((item, idx) => {
                  const dish = dishes.find((d) => d.id === item.dishId);
                  if (!dish) return null;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-stone-900 text-sm">{dish.name}</p>
                          <p className="text-[10px] text-stone-500">
                            Precio de Venta: {formatMoney(dish.price)} · Categoría: {dish.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Portions input if not confirmed */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-500">Planeadas:</span>
                          {!currentMenu.isProductionConfirmed && currentUser.role === 'admin' ? (
                            <input
                              type="number"
                              min="1"
                              value={item.plannedPortions}
                              onChange={(e) =>
                                handleUpdateItemPortions(
                                  item.dishId,
                                  Math.max(1, Number(e.target.value))
                                )
                              }
                              className="w-16 text-center font-bold bg-white border border-stone-300 rounded-lg py-1 px-1 text-xs"
                            />
                          ) : (
                            <span className="font-bold text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-200">
                              {item.preparedPortions || item.plannedPortions} pzs
                            </span>
                          )}
                        </div>

                        {/* Sold badge */}
                        <div className="text-right">
                          <span className="text-emerald-700 font-bold block">
                            {item.soldPortions} vendidas
                          </span>
                          {item.leftoverPortions > 0 && (
                            <span className="text-stone-400 text-[10px] block">
                              {item.leftoverPortions} sobrantes
                            </span>
                          )}
                        </div>

                        {/* Delete button */}
                        {!currentMenu.isProductionConfirmed && currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleRemoveItem(item.dishId)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 space-y-2 text-xs">
                <CalendarDays className="w-8 h-8 mx-auto text-stone-300" />
                <p>No hay platillos en el menú de hoy para el turno de {selectedShift}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Raw Ingredients Requirements for Production (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-600" />
              Insumos Necesarios para esta Producción
            </h3>
            <p className="text-xs text-stone-500">
              Cálculo automático de ingredientes según recetas y porciones planificadas.
            </p>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {ingredientRequirements.map((req, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs gap-2 ${
                  req.hasDeficit
                    ? 'bg-rose-50/80 border-rose-300'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="truncate flex-1">
                  <p className="font-bold text-stone-900 truncate">
                    {req.ingredient.name}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Stock actual: {req.currentStock} {req.ingredient.unit} · CPP: {formatMoney(req.ingredient.costPerUnit)}/{req.ingredient.unit}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-stone-900 block">
                    {req.requiredQty} {req.ingredient.unit}
                  </span>
                  {req.hasDeficit ? (
                    <span className="text-[10px] font-bold text-rose-600">
                      Faltan {(req.requiredQty - req.currentStock).toFixed(2)} {req.ingredient.unit}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700">
                      Suficiente
                    </span>
                  )}
                </div>
              </div>
            ))}

            {ingredientRequirements.length === 0 && (
              <div className="text-center py-8 text-stone-400 text-xs">
                No hay ingredientes calculados. Agrega platillos con recetas al menú.
              </div>
            )}
          </div>

          {/* Explanation note */}
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
            💡 <strong>Regla de oro:</strong> Al confirmar la producción, el sistema descuenta
            los insumos anteriores del inventario de forma definitiva. Al cobrar en caja,
            solo se descuentan las porciones ya cocinadas.
          </div>
        </div>
      </div>

      {/* Duplicate / Reutilizar Menu Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-extrabold text-stone-900 border-b border-stone-200 pb-2">
              Reutilizar Menú Anterior
            </h3>
            <p className="text-stone-600">
              Copia la lista de platillos y porciones de un día previo para cargarlo en la fecha
              seleccionada sin tener que capturar todo desde cero.
            </p>

            <div className="space-y-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div>
                <label className="font-bold block mb-1">Copiar desde la fecha:</label>
                <input
                  type="date"
                  value={sourceDate}
                  onChange={(e) => setSourceDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Turno de origen:</label>
                <select
                  value={sourceShift}
                  onChange={(e) => setSourceShift(e.target.value as ShiftType)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                >
                  <option value="desayuno">Desayuno</option>
                  <option value="comida">Comida</option>
                </select>
              </div>

              <div className="pt-1 text-[11px] text-stone-500">
                Se duplicará hacia:{' '}
                <strong>
                  {selectedDate} ({selectedShift})
                </strong>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const ok = duplicateMenu(sourceDate, sourceShift, selectedDate, selectedShift);
                  if (ok) {
                    alert('¡Menú duplicado con éxito!');
                    setShowDuplicateModal(false);
                  } else {
                    alert('No se encontró ningún menú guardado para la fecha y turno seleccionados.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
              >
                Duplicar Menú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leftovers & Waste Modal */}
      {showLeftoversModal && currentMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs text-stone-900 animate-in fade-in zoom-in-95 my-auto">
            <h3 className="text-sm font-extrabold text-stone-900 border-b border-stone-200 pb-2">
              Registro de Sobrantes y Mermas por Platillo
            </h3>
            <p className="text-stone-600">
              Registra qué porciones quedaron sobrantes (comestibles para refrigeración) y cuáles
              representaron merma o desperdicio al cerrar el servicio.
            </p>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {leftoversData.map((row, idx) => {
                const dish = dishes.find((d) => d.id === row.dishId);
                const menuItem = currentMenu.items.find((i) => i.dishId === row.dishId);
                if (!dish || !menuItem) return null;

                const prepared = menuItem.preparedPortions || menuItem.plannedPortions;
                const sold = menuItem.soldPortions || 0;

                return (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>{dish.name}</span>
                      <span className="text-stone-500 font-normal">
                        Prep: {prepared} | Vendidas: {sold}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-stone-600 font-bold block mb-0.5">
                          Sobrante (Aprovechable):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row.leftoverPortions}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            setLeftoversData((prev) =>
                              prev.map((r) => (r.dishId === row.dishId ? { ...r, leftoverPortions: val } : r))
                            );
                          }}
                          className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-center font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-rose-700 font-bold block mb-0.5">
                          Merma / Desperdicio:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row.wastePortions}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            setLeftoversData((prev) =>
                              prev.map((r) => (r.dishId === row.dishId ? { ...r, wastePortions: val } : r))
                            );
                          }}
                          className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-center font-bold text-rose-700"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowLeftoversModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveLeftovers}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
              >
                Guardar Cierre de Producción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
