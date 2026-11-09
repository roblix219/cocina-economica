export type UserRole = 'admin' | 'cajero';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
}

export type ShiftType = 'desayuno' | 'comida';

export type UnitType = 'kg' | 'g' | 'lt' | 'ml' | 'pza';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: UnitType;
  stock: number;
  minStock: number;
  costPerUnit: number; // Costo Promedio Ponderado por unidad base
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  deliveryNotes?: string;
}

export interface PurchaseItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  folio: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  total: number;
  paymentMethod: 'efectivo' | 'transferencia';
  registeredBy: string;
  notes?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number; // En la unidad especificada
  unit: UnitType;
}

export type DishCategory =
  | 'paquete_corrida'
  | 'desayuno'
  | 'sopa_entrada'
  | 'plato_fuerte'
  | 'guarnicion'
  | 'bebida'
  | 'postre';

export interface Recipe {
  id: string;
  name: string;
  dishId: string;
  portionsYield: number; // Porciones que rinde
  ingredients: RecipeIngredient[];
  preparationNotes?: string;
}

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  price: number;
  description: string;
  recipeId?: string;
  availablePortions: number; // Porciones disponibles en tiempo real para venta
  active: boolean;
  colorTheme?: string;
}

export interface MenuPlanItem {
  dishId: string;
  plannedPortions: number;
  preparedPortions: number;
  soldPortions: number;
  leftoverPortions: number; // Sobrantes guardados para aprovechamiento posterior
  wastePortions: number;    // Merma o desperdicio
  status: 'planeado' | 'preparado' | 'cerrado';
}

export interface DailyMenu {
  id: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  items: MenuPlanItem[];
  isProductionConfirmed: boolean;
  productionConfirmedAt?: string;
  notes?: string;
}

export type SaleChannel = 'local' | 'llevar';
export type PaymentMethod = 'efectivo' | 'transferencia';

export interface SaleItem {
  dishId: string;
  dishName: string;
  category: DishCategory;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  estimatedCostPerPortion: number; // Costo de receta al momento de la venta
}

export interface Sale {
  id: string;
  folio: string;
  date: string;
  timestamp: number;
  shift: ShiftType;
  shiftId: string;
  channel: SaleChannel;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid?: number; // Para cálculo de cambio en efectivo
  change?: number;
  transferRef?: string;
  userId: string;
  userName: string;
  status: 'completada' | 'cancelada';
  cancellationReason?: string;
}

export interface CashMovement {
  id: string;
  shiftId: string;
  type: 'entrada' | 'salida';
  amount: number;
  reason: string;
  timestamp: number;
  registeredBy: string;
}

export interface CashShift {
  id: string;
  date: string;
  shift: ShiftType;
  status: 'abierto' | 'cerrado';
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  initialCash: number; // Fondo inicial
  cashSalesTotal: number;
  transferSalesTotal: number; // Se muestra por separado, no está en cajón físico
  cashInTotal: number; // Entradas adicionales
  cashOutTotal: number; // Salidas de caja chica
  expectedCash: number; // initialCash + cashSalesTotal + cashInTotal - cashOutTotal
  countedCash?: number; // Lo que cuenta físicamente el cajero
  difference?: number; // countedCash - expectedCash (Sobrante o Faltante)
  notes?: string;
}

export interface OperationalExpense {
  id: string;
  date: string;
  category: 'renta' | 'gas_lp' | 'luz_agua' | 'sueldos_nomina' | 'limpieza' | 'desechables_empaque' | 'hielo' | 'mantenimiento' | 'otros';
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  registeredBy: string;
}

export interface InventoryMovement {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: 'compra' | 'produccion' | 'merma' | 'ajuste';
  quantityChange: number;
  finalStock: number;
  unitCost: number;
  date: string;
  timestamp: number;
  reason: string;
  authorizedBy: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  rfc: string;
  address: string;
  phone: string;
  ticketFooter: string;
  packagePrice: number;
  currency: string;
}
