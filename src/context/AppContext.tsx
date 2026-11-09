import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  BusinessConfig,
  CashMovement,
  CashShift,
  DailyMenu,
  Dish,
  Ingredient,
  InventoryMovement,
  OperationalExpense,
  Purchase,
  Recipe,
  Sale,
  ShiftType,
  Supplier,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_DISHES,
  INITIAL_EXPENSES,
  INITIAL_INGREDIENTS,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_MENUS,
  INITIAL_RECIPES,
  INITIAL_SHIFTS,
  INITIAL_SUPPLIERS,
  INITIAL_USERS,
} from '../data/initialData';

export type AppView =
  | 'inicio'
  | 'pos'
  | 'menu'
  | 'recetas'
  | 'inventario'
  | 'caja'
  | 'gastos'
  | 'reportes'
  | 'config';

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Business Config
  config: BusinessConfig;
  updateConfig: (newConfig: Partial<BusinessConfig>) => void;

  // Users & Role
  users: User[];
  currentUser: User;
  switchUser: (userId: string) => boolean;

  // Ingredients & Inventory
  ingredients: Ingredient[];
  addIngredient: (ing: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, ing: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  adjustInventoryStock: (ingredientId: string, newStock: number, reason: string, authorizedBy: string) => void;
  inventoryMovements: InventoryMovement[];
  lowStockIngredients: Ingredient[];
  generateShoppingList: () => Array<{
    ingredient: Ingredient;
    needed: number;
    current: number;
    toBuy: number;
    estimatedCost: number;
  }>;

  // Suppliers & Purchases
  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  purchases: Purchase[];
  registerPurchase: (purchase: Omit<Purchase, 'id' | 'folio'>) => void;

  // Dishes & Recipes
  dishes: Dish[];
  addDish: (dish: Omit<Dish, 'id'>) => void;
  updateDish: (id: string, dish: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  getRecipeCost: (recipe: Recipe) => { totalCost: number; costPerPortion: number };

  // Menu & Production
  menus: DailyMenu[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedShift: ShiftType;
  setSelectedShift: (shift: ShiftType) => void;
  currentMenu: DailyMenu | undefined;
  saveMenuPlan: (menu: DailyMenu) => void;
  duplicateMenu: (sourceDate: string, sourceShift: ShiftType, targetDate: string, targetShift: ShiftType) => boolean;
  confirmProduction: (menuId: string) => { success: boolean; message: string };
  recordLeftoversAndWaste: (
    menuId: string,
    updates: Array<{ dishId: string; leftoverPortions: number; wastePortions: number }>
  ) => void;

  // Cash Shifts
  cashShifts: CashShift[];
  activeShift: CashShift | undefined;
  openShift: (date: string, shift: ShiftType, initialCash: number, openedBy: string) => CashShift;
  closeShift: (shiftId: string, countedCash: number, closedBy: string, notes?: string) => void;
  addCashMovement: (shiftId: string, type: 'entrada' | 'salida', amount: number, reason: string) => void;

  // Sales & POS
  sales: Sale[];
  registerSale: (saleData: Omit<Sale, 'id' | 'folio' | 'timestamp' | 'date' | 'shift' | 'shiftId' | 'status'>) => Sale;
  cancelSale: (saleId: string, reason: string) => boolean;

  // Operational Expenses
  expenses: OperationalExpense[];
  addExpense: (expense: Omit<OperationalExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Utils & Demo Data
  formatMoney: (val: number) => string;
  resetToDemoData: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'mc_config',
  USERS: 'mc_users',
  CURRENT_USER_ID: 'mc_current_user_id',
  INGREDIENTS: 'mc_ingredients',
  SUPPLIERS: 'mc_suppliers',
  PURCHASES: 'mc_purchases',
  DISHES: 'mc_dishes',
  RECIPES: 'mc_recipes',
  MENUS: 'mc_menus',
  SHIFTS: 'mc_shifts',
  SALES: 'mc_sales',
  EXPENSES: 'mc_expenses',
  MOVEMENTS: 'mc_movements',
};

function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage`, err);
    return defaultValue;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('inicio');

  // Business Config
  const [config, setConfig] = useState<BusinessConfig>(() =>
    getStoredOrDefault(STORAGE_KEYS.CONFIG, INITIAL_CONFIG)
  );

  // Users
  const [users] = useState<User[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    getStoredOrDefault(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id)
  );

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, JSON.stringify(target.id));
      return true;
    }
    return false;
  };

  // Ingredients & Movements
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.INGREDIENTS, INITIAL_INGREDIENTS)
  );
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.MOVEMENTS, INITIAL_INVENTORY_MOVEMENTS)
  );

  // Suppliers & Purchases
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS)
  );
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.PURCHASES, [])
  );

  // Dishes & Recipes
  const [dishes, setDishes] = useState<Dish[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.DISHES, INITIAL_DISHES)
  );
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.RECIPES, INITIAL_RECIPES)
  );

  // Menus
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [selectedShift, setSelectedShift] = useState<ShiftType>('comida');
  const [menus, setMenus] = useState<DailyMenu[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.MENUS, INITIAL_MENUS)
  );

  // Cash Shifts
  const [cashShifts, setCashShifts] = useState<CashShift[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS)
  );

  // Sales
  const [sales, setSales] = useState<Sale[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.SALES, [])
  );

  // Expenses
  const [expenses, setExpenses] = useState<OperationalExpense[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
  }, [menus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(cashShifts));
  }, [cashShifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  // Current Menu based on selectedDate and selectedShift
  const currentMenu = useMemo(() => {
    return menus.find((m) => m.date === selectedDate && m.shift === selectedShift);
  }, [menus, selectedDate, selectedShift]);

  // Active open cash shift
  const activeShift = useMemo(() => {
    return cashShifts.find((s) => s.status === 'abierto' && s.date === selectedDate && s.shift === selectedShift) ||
      cashShifts.find((s) => s.status === 'abierto');
  }, [cashShifts, selectedDate, selectedShift]);

  // Low stock alert items
  const lowStockIngredients = useMemo(() => {
    return ingredients.filter((ing) => ing.stock <= ing.minStock);
  }, [ingredients]);

  // Helper: Format Currency (MXN)
  const formatMoney = (val: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  // Helper: Calculate Recipe Cost per portion
  const getRecipeCost = (recipe: Recipe) => {
    let totalCost = 0;
    recipe.ingredients.forEach((item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (ing) {
        // Simple unit conversion:
        // if ingredient is in kg and recipe uses kg -> 1
        // if ingredient is in kg and recipe uses g -> /1000
        // if ingredient is in lt and recipe uses ml -> /1000
        let effectiveQty = item.quantity;
        if (ing.unit === 'kg' && item.unit === 'g') effectiveQty = item.quantity / 1000;
        if (ing.unit === 'lt' && item.unit === 'ml') effectiveQty = item.quantity / 1000;

        totalCost += effectiveQty * ing.costPerUnit;
      }
    });

    const yieldQty = recipe.portionsYield > 0 ? recipe.portionsYield : 1;
    const costPerPortion = Number((totalCost / yieldQty).toFixed(2));
    return { totalCost: Number(totalCost.toFixed(2)), costPerPortion };
  };

  // Update business configuration
  const updateConfig = (newConfig: Partial<BusinessConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Add / Edit / Delete Ingredients
  const addIngredient = (ingData: Omit<Ingredient, 'id'>) => {
    const newIng: Ingredient = {
      ...ingData,
      id: `ing-${Date.now()}`,
    };
    setIngredients((prev) => [...prev, newIng]);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const deleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Manual stock adjustment with audit trail
  const adjustInventoryStock = (
    ingredientId: string,
    newStock: number,
    reason: string,
    authorizedBy: string
  ) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (!ing) return;

    const diff = Number((newStock - ing.stock).toFixed(2));
    const now = new Date();

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      ingredientId: ing.id,
      ingredientName: ing.name,
      type: diff < 0 ? 'merma' : 'ajuste',
      quantityChange: diff,
      finalStock: newStock,
      unitCost: ing.costPerUnit,
      date: now.toISOString().split('T')[0],
      timestamp: Date.now(),
      reason: reason || (diff < 0 ? 'Merma física / Ajuste de inventario' : 'Ajuste manual de existencia'),
      authorizedBy,
    };

    setIngredients((prev) =>
      prev.map((i) => (i.id === ingredientId ? { ...i, stock: newStock } : i))
    );
    setInventoryMovements((prev) => [movement, ...prev]);
  };

  // Register Purchase with Weighted Average Cost (Costo Promedio Ponderado - CPP)
  const registerPurchase = (purchaseData: Omit<Purchase, 'id' | 'folio'>) => {
    const folioNum = purchases.length + 1;
    const folio = `COM-${String(folioNum).padStart(4, '0')}`;
    const newPurchase: Purchase = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
      folio,
    };

    // Update ingredients stock & weighted average unit cost
    const newMovements: InventoryMovement[] = [];
    const updatedIngredients = [...ingredients];

    newPurchase.items.forEach((item) => {
      const idx = updatedIngredients.findIndex((i) => i.id === item.ingredientId);
      if (idx !== -1) {
        const current = updatedIngredients[idx];
        const currentStock = Math.max(0, current.stock);
        const newStock = Number((currentStock + item.quantity).toFixed(2));

        // CPP Formula: ((StockActual * CostoActual) + (QtyComprada * PrecioCompra)) / (StockActual + QtyComprada)
        const currentTotalVal = currentStock * current.costPerUnit;
        const purchaseTotalVal = item.quantity * item.unitPrice;
        const newUnitCost =
          newStock > 0
            ? Number(((currentTotalVal + purchaseTotalVal) / newStock).toFixed(2))
            : item.unitPrice;

        updatedIngredients[idx] = {
          ...current,
          stock: newStock,
          costPerUnit: newUnitCost,
        };

        newMovements.push({
          id: `mov-${Date.now()}-${item.ingredientId}`,
          ingredientId: current.id,
          ingredientName: current.name,
          type: 'compra',
          quantityChange: item.quantity,
          finalStock: newStock,
          unitCost: newUnitCost,
          date: newPurchase.date,
          timestamp: Date.now(),
          reason: `Compra Folio ${folio} - Proveedor: ${newPurchase.supplierName}`,
          authorizedBy: newPurchase.registeredBy,
        });
      }
    });

    setPurchases((prev) => [newPurchase, ...prev]);
    setIngredients(updatedIngredients);
    setInventoryMovements((prev) => [...newMovements, ...prev]);
  };

  // Suppliers
  const addSupplier = (supData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup-${Date.now()}`,
    };
    setSuppliers((prev) => [...prev, newSup]);
  };

  // Dishes & Recipes
  const addDish = (dishData: Omit<Dish, 'id'>) => {
    const newDish: Dish = {
      ...dishData,
      id: `dish-${Date.now()}`,
    };
    setDishes((prev) => [...prev, newDish]);
  };

  const updateDish = (id: string, updates: Partial<Dish>) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDish = (id: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const addRecipe = (recData: Omit<Recipe, 'id'>) => {
    const newRec: Recipe = {
      ...recData,
      id: `rec-${Date.now()}`,
    };
    setRecipes((prev) => [...prev, newRec]);
    if (newRec.dishId) {
      updateDish(newRec.dishId, { recipeId: newRec.id });
    }
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Menu Management
  const saveMenuPlan = (menuToSave: DailyMenu) => {
    setMenus((prev) => {
      const idx = prev.findIndex(
        (m) => m.date === menuToSave.date && m.shift === menuToSave.shift
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = menuToSave;
        return copy;
      }
      return [...prev, menuToSave];
    });
  };

  // Duplicate / Reutilizar menú anterior
  const duplicateMenu = (
    sourceDate: string,
    sourceShift: ShiftType,
    targetDate: string,
    targetShift: ShiftType
  ): boolean => {
    const sourceMenu = menus.find(
      (m) => m.date === sourceDate && m.shift === sourceShift
    );
    if (!sourceMenu) return false;

    const clonedItems = sourceMenu.items.map((item) => ({
      ...item,
      preparedPortions: item.plannedPortions,
      soldPortions: 0,
      leftoverPortions: 0,
      wastePortions: 0,
      status: 'planeado' as const,
    }));

    const newMenu: DailyMenu = {
      id: `menu-${targetDate}-${targetShift}-${Date.now()}`,
      date: targetDate,
      shift: targetShift,
      items: clonedItems,
      isProductionConfirmed: false,
      notes: `Reutilizado de ${sourceDate} (${sourceShift})`,
    };

    saveMenuPlan(newMenu);
    setSelectedDate(targetDate);
    setSelectedShift(targetShift);
    return true;
  };

  // Confirm Production (Descuenta insumos una sola vez y carga porciones disponibles al POS)
  const confirmProduction = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    if (!menu) return { success: false, message: 'Menú no encontrado.' };
    if (menu.isProductionConfirmed) {
      return { success: false, message: 'La producción de este menú ya había sido confirmada previamente.' };
    }

    const updatedIngredients = [...ingredients];
    const newMovements: InventoryMovement[] = [];
    const updatedDishes = [...dishes];

    // For each dish prepared in the menu
    menu.items.forEach((item) => {
      const dish = updatedDishes.find((d) => d.id === item.dishId);
      if (!dish) return;

      const qtyPrepared = item.preparedPortions > 0 ? item.preparedPortions : item.plannedPortions;

      // Update available portions in the POS for this dish
      dish.availablePortions = (dish.availablePortions || 0) + qtyPrepared;

      // If dish has a recipe, deduct raw ingredients
      if (dish.recipeId) {
        const recipe = recipes.find((r) => r.id === dish.recipeId);
        if (recipe && recipe.portionsYield > 0) {
          const multiplier = qtyPrepared / recipe.portionsYield;

          recipe.ingredients.forEach((recIng) => {
            const ingIdx = updatedIngredients.findIndex((i) => i.id === recIng.ingredientId);
            if (ingIdx !== -1) {
              const currentIng = updatedIngredients[ingIdx];
              let effectiveDeduction = recIng.quantity * multiplier;
              if (currentIng.unit === 'kg' && recIng.unit === 'g') effectiveDeduction /= 1000;
              if (currentIng.unit === 'lt' && recIng.unit === 'ml') effectiveDeduction /= 1000;

              const finalStock = Number((currentIng.stock - effectiveDeduction).toFixed(2));
              updatedIngredients[ingIdx] = {
                ...currentIng,
                stock: finalStock,
              };

              newMovements.push({
                id: `mov-prod-${Date.now()}-${currentIng.id}`,
                ingredientId: currentIng.id,
                ingredientName: currentIng.name,
                type: 'produccion',
                quantityChange: -Number(effectiveDeduction.toFixed(2)),
                finalStock,
                unitCost: currentIng.costPerUnit,
                date: menu.date,
                timestamp: Date.now(),
                reason: `Consumo para ${qtyPrepared} porciones de "${dish.name}" (Menú ${menu.shift})`,
                authorizedBy: currentUser.name,
              });
            }
          });
        }
      }
    });

    // Mark menu as confirmed
    const updatedMenu: DailyMenu = {
      ...menu,
      isProductionConfirmed: true,
      productionConfirmedAt: new Date().toISOString(),
      items: menu.items.map((i) => ({
        ...i,
        preparedPortions: i.preparedPortions > 0 ? i.preparedPortions : i.plannedPortions,
        status: 'preparado',
      })),
    };

    setIngredients(updatedIngredients);
    setDishes(updatedDishes);
    setInventoryMovements((prev) => [...newMovements, ...prev]);
    saveMenuPlan(updatedMenu);

    return {
      success: true,
      message: '¡Producción confirmada con éxito! Insumos descontados y porciones cargadas al Punto de Venta.',
    };
  };

  // Record Leftovers and Waste at Shift Closure
  const recordLeftoversAndWaste = (
    menuId: string,
    updates: Array<{ dishId: string; leftoverPortions: number; wastePortions: number }>
  ) => {
    const menu = menus.find((m) => m.id === menuId);
    if (!menu) return;

    const updatedItems = menu.items.map((item) => {
      const match = updates.find((u) => u.dishId === item.dishId);
      if (match) {
        return {
          ...item,
          leftoverPortions: match.leftoverPortions,
          wastePortions: match.wastePortions,
          status: 'cerrado' as const,
        };
      }
      return item;
    });

    const updatedMenu: DailyMenu = {
      ...menu,
      items: updatedItems,
    };

    saveMenuPlan(updatedMenu);
  };

  // Shopping List Generator
  const generateShoppingList = () => {
    if (!currentMenu) return [];

    const neededMap: Record<string, number> = {};

    currentMenu.items.forEach((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);
      if (dish && dish.recipeId) {
        const recipe = recipes.find((r) => r.id === dish.recipeId);
        if (recipe && recipe.portionsYield > 0) {
          const qty = item.plannedPortions || 0;
          const mult = qty / recipe.portionsYield;

          recipe.ingredients.forEach((ri) => {
            let effQty = ri.quantity * mult;
            const ing = ingredients.find((i) => i.id === ri.ingredientId);
            if (ing) {
              if (ing.unit === 'kg' && ri.unit === 'g') effQty /= 1000;
              if (ing.unit === 'lt' && ri.unit === 'ml') effQty /= 1000;
              neededMap[ing.id] = (neededMap[ing.id] || 0) + effQty;
            }
          });
        }
      }
    });

    const list: Array<{
      ingredient: Ingredient;
      needed: number;
      current: number;
      toBuy: number;
      estimatedCost: number;
    }> = [];

    Object.entries(neededMap).forEach(([ingId, neededQty]) => {
      const ing = ingredients.find((i) => i.id === ingId);
      if (ing) {
        const roundedNeeded = Number(neededQty.toFixed(2));
        const deficit = roundedNeeded - ing.stock;
        const toBuy = deficit > 0 ? Number(deficit.toFixed(2)) : 0;
        const estimatedCost = Number((toBuy * ing.costPerUnit).toFixed(2));

        list.push({
          ingredient: ing,
          needed: roundedNeeded,
          current: ing.stock,
          toBuy,
          estimatedCost,
        });
      }
    });

    return list;
  };

  // Cash Shifts (Cortes de Caja)
  const openShift = (
    date: string,
    shift: ShiftType,
    initialCash: number,
    openedBy: string
  ): CashShift => {
    const newShift: CashShift = {
      id: `shift-${date}-${shift}-${Date.now()}`,
      date,
      shift,
      status: 'abierto',
      openedAt: new Date().toISOString(),
      openedBy,
      initialCash: Number(initialCash) || 0,
      cashSalesTotal: 0,
      transferSalesTotal: 0,
      cashInTotal: 0,
      cashOutTotal: 0,
      expectedCash: Number(initialCash) || 0,
    };

    setCashShifts((prev) => [newShift, ...prev]);
    return newShift;
  };

  const closeShift = (
    shiftId: string,
    countedCash: number,
    closedBy: string,
    notes?: string
  ) => {
    setCashShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          const diff = Number((countedCash - s.expectedCash).toFixed(2));
          return {
            ...s,
            status: 'cerrado',
            closedAt: new Date().toISOString(),
            closedBy,
            countedCash,
            difference: diff,
            notes: notes || s.notes,
          };
        }
        return s;
      })
    );
  };

  const addCashMovement = (
    shiftId: string,
    type: 'entrada' | 'salida',
    amount: number,
    reason: string
  ) => {
    const amt = Number(amount) || 0;
    setCashShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          const cashIn = type === 'entrada' ? s.cashInTotal + amt : s.cashInTotal;
          const cashOut = type === 'salida' ? s.cashOutTotal + amt : s.cashOutTotal;
          const expected = s.initialCash + s.cashSalesTotal + cashIn - cashOut;
          return {
            ...s,
            cashInTotal: cashIn,
            cashOutTotal: cashOut,
            expectedCash: expected,
          };
        }
        return s;
      })
    );
  };

  // Sales (POS)
  const registerSale = (
    saleData: Omit<
      Sale,
      'id' | 'folio' | 'timestamp' | 'date' | 'shift' | 'shiftId' | 'status'
    >
  ): Sale => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const folioNum = sales.length + 1;
    const folio = `FOL-${String(folioNum).padStart(5, '0')}`;

    // Target shift
    const shift = activeShift?.shift || selectedShift;
    const shiftId = activeShift?.id || `shift-auto-${Date.now()}`;

    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      folio,
      date: today,
      timestamp: Date.now(),
      shift,
      shiftId,
      status: 'completada',
    };

    // 1. Decrement availablePortions on dishes
    setDishes((prev) =>
      prev.map((dish) => {
        const itemSold = newSale.items.find((si) => si.dishId === dish.id);
        if (itemSold) {
          return {
            ...dish,
            availablePortions: Math.max(0, (dish.availablePortions || 0) - itemSold.quantity),
          };
        }
        return dish;
      })
    );

    // 2. Update soldPortions in active menu if exists
    if (currentMenu) {
      const updatedMenuItems = currentMenu.items.map((mi) => {
        const itemSold = newSale.items.find((si) => si.dishId === mi.dishId);
        if (itemSold) {
          return {
            ...mi,
            soldPortions: (mi.soldPortions || 0) + itemSold.quantity,
          };
        }
        return mi;
      });
      saveMenuPlan({ ...currentMenu, items: updatedMenuItems });
    }

    // 3. Update shift totals
    if (activeShift) {
      setCashShifts((prev) =>
        prev.map((s) => {
          if (s.id === activeShift.id) {
            const isCash = newSale.paymentMethod === 'efectivo';
            const cashTotal = isCash ? s.cashSalesTotal + newSale.total : s.cashSalesTotal;
            const transferTotal = !isCash ? s.transferSalesTotal + newSale.total : s.transferSalesTotal;
            const expected = s.initialCash + cashTotal + s.cashInTotal - s.cashOutTotal;
            return {
              ...s,
              cashSalesTotal: cashTotal,
              transferSalesTotal: transferTotal,
              expectedCash: expected,
            };
          }
          return s;
        })
      );
    }

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  // Cancel Sale with audit trail
  const cancelSale = (saleId: string, reason: string): boolean => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale || sale.status === 'cancelada') return false;

    // Restore availablePortions in dishes
    setDishes((prev) =>
      prev.map((dish) => {
        const itemSold = sale.items.find((si) => si.dishId === dish.id);
        if (itemSold) {
          return {
            ...dish,
            availablePortions: (dish.availablePortions || 0) + itemSold.quantity,
          };
        }
        return dish;
      })
    );

    // Revert shift totals if possible
    if (sale.shiftId) {
      setCashShifts((prev) =>
        prev.map((s) => {
          if (s.id === sale.shiftId) {
            const isCash = sale.paymentMethod === 'efectivo';
            const cashTotal = isCash ? Math.max(0, s.cashSalesTotal - sale.total) : s.cashSalesTotal;
            const transferTotal = !isCash ? Math.max(0, s.transferSalesTotal - sale.total) : s.transferSalesTotal;
            const expected = s.initialCash + cashTotal + s.cashInTotal - s.cashOutTotal;
            return {
              ...s,
              cashSalesTotal: cashTotal,
              transferSalesTotal: transferTotal,
              expectedCash: expected,
            };
          }
          return s;
        })
      );
    }

    setSales((prev) =>
      prev.map((s) =>
        s.id === saleId
          ? {
              ...s,
              status: 'cancelada',
              cancellationReason: reason,
            }
          : s
      )
    );

    return true;
  };

  // Expenses
  const addExpense = (expenseData: Omit<OperationalExpense, 'id'>) => {
    const newExp: OperationalExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setConfig(INITIAL_CONFIG);
    setIngredients(INITIAL_INGREDIENTS);
    setInventoryMovements(INITIAL_INVENTORY_MOVEMENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchases([]);
    setDishes(INITIAL_DISHES);
    setRecipes(INITIAL_RECIPES);
    setMenus(INITIAL_MENUS);
    setCashShifts(INITIAL_SHIFTS);
    setSales([]);
    setExpenses(INITIAL_EXPENSES);
    setCurrentUserId(INITIAL_USERS[0].id);
    localStorage.clear();
  };

  // Export / Import Backup
  const exportBackup = (): string => {
    const data = {
      config,
      ingredients,
      inventoryMovements,
      suppliers,
      purchases,
      dishes,
      recipes,
      menus,
      cashShifts,
      sales,
      expenses,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.config) setConfig(data.config);
      if (data.ingredients) setIngredients(data.ingredients);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.dishes) setDishes(data.dishes);
      if (data.recipes) setRecipes(data.recipes);
      if (data.menus) setMenus(data.menus);
      if (data.cashShifts) setCashShifts(data.cashShifts);
      if (data.sales) setSales(data.sales);
      if (data.expenses) setExpenses(data.expenses);
      return true;
    } catch (e) {
      console.error('Error importing backup JSON', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        config,
        updateConfig,
        users,
        currentUser,
        switchUser,
        ingredients,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        adjustInventoryStock,
        inventoryMovements,
        lowStockIngredients,
        generateShoppingList,
        suppliers,
        addSupplier,
        purchases,
        registerPurchase,
        dishes,
        addDish,
        updateDish,
        deleteDish,
        recipes,
        addRecipe,
        updateRecipe,
        getRecipeCost,
        menus,
        selectedDate,
        setSelectedDate,
        selectedShift,
        setSelectedShift,
        currentMenu,
        saveMenuPlan,
        duplicateMenu,
        confirmProduction,
        recordLeftoversAndWaste,
        cashShifts,
        activeShift,
        openShift,
        closeShift,
        addCashMovement,
        sales,
        registerSale,
        cancelSale,
        expenses,
        addExpense,
        deleteExpense,
        formatMoney,
        resetToDemoData,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
