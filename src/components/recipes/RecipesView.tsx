import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe, RecipeIngredient, UnitType } from '../../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  Percent,
  ChefHat,
  Search,
  Scale,
  Sparkles,
} from 'lucide-react';

export const RecipesView: React.FC = () => {
  const {
    recipes,
    dishes,
    ingredients,
    getRecipeCost,
    addRecipe,
    updateRecipe,
    formatMoney,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDishId, setFormDishId] = useState('');
  const [formYield, setFormYield] = useState<number>(10);
  const [formNotes, setFormNotes] = useState('');
  const [formIngredients, setFormIngredients] = useState<RecipeIngredient[]>([]);

  // Ingredient row to add inside modal
  const [tempIngId, setTempIngId] = useState('');
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<UnitType>('kg');

  // Filter recipes
  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingRecipeId(null);
    setFormName('');
    setFormDishId('');
    setFormYield(10);
    setFormNotes('');
    setFormIngredients([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setFormName(recipe.name);
    setFormDishId(recipe.dishId || '');
    setFormYield(recipe.portionsYield || 1);
    setFormNotes(recipe.preparationNotes || '');
    setFormIngredients([...recipe.ingredients]);
    setIsModalOpen(true);
  };

  const handleAddIngredientRow = () => {
    if (!tempIngId || tempQty <= 0) return;
    setFormIngredients((prev) => [
      ...prev,
      {
        ingredientId: tempIngId,
        quantity: Number(tempQty),
        unit: tempUnit,
      },
    ]);
    setTempIngId('');
    setTempQty(1);
  };

  const handleRemoveIngredientRow = (idx: number) => {
    setFormIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || formYield <= 0) return;

    if (editingRecipeId) {
      updateRecipe(editingRecipeId, {
        name: formName,
        dishId: formDishId,
        portionsYield: Number(formYield),
        ingredients: formIngredients,
        preparationNotes: formNotes,
      });
    } else {
      addRecipe({
        name: formName,
        dishId: formDishId,
        portionsYield: Number(formYield),
        ingredients: formIngredients,
        preparationNotes: formNotes,
      });
    }

    setIsModalOpen(false);
  };

  // Calculate live preview cost inside modal
  const modalLiveCost = React.useMemo(() => {
    let total = 0;
    formIngredients.forEach((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (ing) {
        let effQty = item.quantity;
        if (ing.unit === 'kg' && item.unit === 'g') effQty /= 1000;
        if (ing.unit === 'lt' && item.unit === 'ml') effQty /= 1000;
        total += effQty * ing.costPerUnit;
      }
    });
    const costPerPortion = formYield > 0 ? total / formYield : 0;
    return {
      total: Number(total.toFixed(2)),
      costPerPortion: Number(costPerPortion.toFixed(2)),
    };
  }, [formIngredients, formYield, ingredients]);

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Recetario y Costeo de Platillos (CPP)
          </h2>
          <p className="text-xs text-stone-500">
            Fichas técnicas con cantidades e insumos. El costo por porción se actualiza automáticamente
            con el Costo Promedio Ponderado de las compras.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Receta</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar receta por nombre o guisado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.map((recipe) => {
          const { totalCost, costPerPortion } = getRecipeCost(recipe);
          const linkedDish = dishes.find((d) => d.id === recipe.dishId);
          const salePrice = linkedDish ? linkedDish.price : 0;
          const grossProfit = salePrice - costPerPortion;
          const marginPercent = salePrice > 0 ? (grossProfit / salePrice) * 100 : 0;

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              {/* Recipe Top Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-stone-900 leading-snug">
                    {recipe.name}
                  </h3>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleOpenEditModal(recipe)}
                      className="text-stone-400 hover:text-orange-600 p-1"
                      title="Editar receta"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-stone-100 px-2 py-0.5 rounded-md font-semibold text-stone-700">
                    Rinde: {recipe.portionsYield} porciones
                  </span>
                  {linkedDish && (
                    <span className="bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      P.Venta: {formatMoney(salePrice)}
                    </span>
                  )}
                </div>

                {/* Ingredients Breakdown Mini Table */}
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-xs space-y-1.5">
                  <span className="font-bold text-[10px] uppercase text-stone-500 tracking-wider block">
                    Insumos requeridos:
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {recipe.ingredients.map((item, idx) => {
                      const ing = ingredients.find((i) => i.id === item.ingredientId);
                      return (
                        <div key={idx} className="flex justify-between text-stone-700 text-[11px]">
                          <span className="truncate flex-1">
                            • {ing ? ing.name : 'Insumo'}
                          </span>
                          <span className="font-semibold text-stone-900 ml-2 shrink-0">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {recipe.preparationNotes && (
                  <p className="text-[11px] text-stone-500 italic line-clamp-2">
                    «{recipe.preparationNotes}»
                  </p>
                )}
              </div>

              {/* Financial Costing Bar */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-stone-50 p-2 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">
                    Costo Total
                  </span>
                  <span className="font-black text-stone-800">
                    {formatMoney(totalCost)}
                  </span>
                </div>

                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <span className="text-[9px] uppercase font-bold text-amber-700 block">
                    Costo / Porción
                  </span>
                  <span className="font-black text-amber-950">
                    {formatMoney(costPerPortion)}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="text-[9px] uppercase font-bold text-emerald-700 block">
                    Margen Bruto
                  </span>
                  <span className="font-black text-emerald-950">
                    {marginPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Recipe Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 my-auto space-y-4">
            <h3 className="font-extrabold text-base border-b border-stone-200 pb-2">
              {editingRecipeId ? 'Editar Receta' : 'Nueva Receta con Costeo'}
            </h3>

            <form onSubmit={handleSaveRecipe} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Nombre de la Receta:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Pollo en Mole Poblano"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Vincular a Platillo:</label>
                  <select
                    value={formDishId}
                    onChange={(e) => setFormDishId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Sin vincular --</option>
                    {dishes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({formatMoney(d.price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Rendimiento (Porciones):</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formYield}
                  onChange={(e) => setFormYield(Math.max(1, Number(e.target.value)))}
                  className="w-32 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-center"
                />
              </div>

              {/* Add Ingredient Section */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block">
                  Agregar Insumo a la Receta:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={tempIngId}
                    onChange={(e) => {
                      setTempIngId(e.target.value);
                      const found = ingredients.find((i) => i.id === e.target.value);
                      if (found) setTempUnit(found.unit);
                    }}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar insumo --</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (CPP: {formatMoney(ing.costPerUnit)}/{ing.unit})
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      value={tempQty}
                      onChange={(e) => setTempQty(Math.max(0.01, Number(e.target.value)))}
                      placeholder="Cantidad"
                      className="w-20 bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-center font-bold"
                    />

                    <select
                      value={tempUnit}
                      onChange={(e) => setTempUnit(e.target.value as UnitType)}
                      className="bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lt">lt</option>
                      <option value="ml">ml</option>
                      <option value="pza">pza</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddIngredientRow}
                      disabled={!tempIngId}
                      className="bg-orange-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-orange-700 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ingredients in this recipe */}
                <div className="space-y-1.5 pt-2 max-h-36 overflow-y-auto">
                  {formIngredients.map((item, idx) => {
                    const ing = ingredients.find((i) => i.id === item.ingredientId);
                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white p-2 rounded-xl border border-stone-200 text-xs"
                      >
                        <span className="font-semibold text-stone-800">
                          {ing ? ing.name : 'Insumo'}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-stone-900">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredientRow(idx)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {formIngredients.length === 0 && (
                    <p className="text-[11px] text-stone-400 italic text-center py-2">
                      Sin insumos agregados aún.
                    </p>
                  )}
                </div>
              </div>

              {/* Live Cost Preview */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-amber-950 block">Costeo Estimado en Vivo:</span>
                  <span className="text-[10px] text-amber-800">
                    Costo total de la tanda: {formatMoney(modalLiveCost.total)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">
                    Costo por Porción:
                  </span>
                  <span className="text-base font-black text-amber-950">
                    {formatMoney(modalLiveCost.costPerPortion)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Notas de Preparación (Opcional):</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Instrucciones clave para el cocinero..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Action Buttons */}
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
                  Guardar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
