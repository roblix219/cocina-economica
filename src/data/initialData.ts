import {
  BusinessConfig,
  CashShift,
  DailyMenu,
  Dish,
  Ingredient,
  InventoryMovement,
  OperationalExpense,
  Recipe,
  Supplier,
  User,
} from '../types';

export const INITIAL_CONFIG: BusinessConfig = {
  name: 'Cocina Doña Lupe',
  tagline: 'Sabor casero y comida corrida de tradición',
  rfc: 'GAML850420-AB1',
  address: 'Calle Hidalgo #142, Col. Centro, CDMX',
  phone: '55 5678 1234',
  ticketFooter: '¡Buen provecho! Gracias por su preferencia.',
  packagePrice: 85,
  currency: 'MXN',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Guadalupe Ramírez (Dueña / Admin)',
    role: 'admin',
    pin: '1234',
  },
  {
    id: 'u-2',
    name: 'Carlos Mendoza (Cajero)',
    role: 'cajero',
    pin: '0000',
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Pollería y Carnes La Central',
    contact: 'Don Jaime González',
    phone: '55 1122 3344',
    address: 'Mercado Central Local 48',
    deliveryNotes: 'Entrega lunes, miércoles y viernes a las 7:00 AM',
  },
  {
    id: 'sup-2',
    name: 'Frutas y Verduras Don Mateo',
    contact: 'Mateo Morales',
    phone: '55 9988 7766',
    address: 'Central de Abastos Nave B-12',
    deliveryNotes: 'Verdura fresca del día, pago semanal',
  },
  {
    id: 'sup-3',
    name: 'Abarrotes y Cremería El Zócalo',
    contact: 'Sra. Irma Delgado',
    phone: '55 4433 2211',
    address: 'Av. Juárez 310',
    deliveryNotes: 'Aceites, arroz, frijol, lácteos y especias',
  },
  {
    id: 'sup-4',
    name: 'Tortillería La Providencia',
    contact: 'Pedro Santos',
    phone: '55 6655 4433',
    address: 'Esq. Calle Morelos',
    deliveryNotes: 'Entrega diaria a las 8:30 AM (Tortilla caliente)',
  },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', name: 'Pechuga de pollo fresca', category: 'Carnes', unit: 'kg', stock: 18.5, minStock: 6, costPerUnit: 98.0 },
  { id: 'ing-2', name: 'Bistec de res para milanesa', category: 'Carnes', unit: 'kg', stock: 12.0, minStock: 5, costPerUnit: 165.0 },
  { id: 'ing-3', name: 'Pierna de cerdo en trozo', category: 'Carnes', unit: 'kg', stock: 10.0, minStock: 4, costPerUnit: 92.0 },
  { id: 'ing-4', name: 'Carne molida de res 80/20', category: 'Carnes', unit: 'kg', stock: 8.5, minStock: 4, costPerUnit: 130.0 },
  { id: 'ing-5', name: 'Jitomate guaje/bola', category: 'Verduras', unit: 'kg', stock: 24.0, minStock: 8, costPerUnit: 26.0 },
  { id: 'ing-6', name: 'Cebolla blanca', category: 'Verduras', unit: 'kg', stock: 16.0, minStock: 5, costPerUnit: 22.0 },
  { id: 'ing-7', name: 'Papa blanca', category: 'Verduras', unit: 'kg', stock: 20.0, minStock: 7, costPerUnit: 28.0 },
  { id: 'ing-8', name: 'Chile poblano fresco', category: 'Verduras', unit: 'kg', stock: 9.0, minStock: 3, costPerUnit: 42.0 },
  { id: 'ing-9', name: 'Tomate verde (miltomate)', category: 'Verduras', unit: 'kg', stock: 12.0, minStock: 4, costPerUnit: 24.0 },
  { id: 'ing-10', name: 'Chile serrano', category: 'Verduras', unit: 'kg', stock: 3.5, minStock: 1, costPerUnit: 35.0 },
  { id: 'ing-11', name: 'Zanahoria', category: 'Verduras', unit: 'kg', stock: 14.0, minStock: 4, costPerUnit: 18.0 },
  { id: 'ing-12', name: 'Calabacita tierna', category: 'Verduras', unit: 'kg', stock: 8.0, minStock: 3, costPerUnit: 25.0 },
  { id: 'ing-13', name: 'Arroz súper extra', category: 'Abarrotes', unit: 'kg', stock: 25.0, minStock: 10, costPerUnit: 24.0 },
  { id: 'ing-14', name: 'Frijol negro michoacano', category: 'Abarrotes', unit: 'kg', stock: 22.0, minStock: 8, costPerUnit: 34.0 },
  { id: 'ing-15', name: 'Pasta de fideo #2 (200g)', category: 'Abarrotes', unit: 'pza', stock: 30.0, minStock: 10, costPerUnit: 9.5 },
  { id: 'ing-16', name: 'Aceite vegetal puro', category: 'Abarrotes', unit: 'lt', stock: 15.0, minStock: 5, costPerUnit: 38.0 },
  { id: 'ing-17', name: 'Huevo blanco fresco', category: 'Lácteos/Huevo', unit: 'kg', stock: 14.0, minStock: 5, costPerUnit: 44.0 },
  { id: 'ing-18', name: 'Queso panela de canasto', category: 'Lácteos/Huevo', unit: 'kg', stock: 6.5, minStock: 2, costPerUnit: 95.0 },
  { id: 'ing-19', name: 'Queso Oaxaca / hebra', category: 'Lácteos/Huevo', unit: 'kg', stock: 5.0, minStock: 2, costPerUnit: 135.0 },
  { id: 'ing-20', name: 'Crema de vaca espesa', category: 'Lácteos/Huevo', unit: 'lt', stock: 6.0, minStock: 2, costPerUnit: 48.0 },
  { id: 'ing-21', name: 'Tortillas de maíz recién hechas', category: 'Abarrotes', unit: 'kg', stock: 12.0, minStock: 5, costPerUnit: 22.0 },
  { id: 'ing-22', name: 'Pasta de mole poblano artesanal', category: 'Abarrotes', unit: 'kg', stock: 4.5, minStock: 1.5, costPerUnit: 110.0 },
  { id: 'ing-23', name: 'Concentrado / Polvo de Horchata', category: 'Bebidas', unit: 'lt', stock: 10.0, minStock: 3, costPerUnit: 42.0 },
  { id: 'ing-24', name: 'Flor de Jamaica selecta', category: 'Bebidas', unit: 'kg', stock: 3.5, minStock: 1, costPerUnit: 120.0 },
  { id: 'ing-25', name: 'Azúcar estándar', category: 'Abarrotes', unit: 'kg', stock: 18.0, minStock: 6, costPerUnit: 28.0 },
  { id: 'ing-26', name: 'Pan telera / bolillo', category: 'Panadería', unit: 'pza', stock: 35.0, minStock: 10, costPerUnit: 3.5 },
  { id: 'ing-27', name: 'Refresco embotellado 355ml', category: 'Bebidas', unit: 'pza', stock: 48.0, minStock: 12, costPerUnit: 14.0 },
  { id: 'ing-28', name: 'Café de grano con canela', category: 'Bebidas', unit: 'kg', stock: 4.0, minStock: 1, costPerUnit: 150.0 },
];

export const INITIAL_DISHES: Dish[] = [
  // Paquete Comida Corrida Completa
  {
    id: 'dish-pkg',
    name: 'Comida Corrida Completa',
    category: 'paquete_corrida',
    price: 85,
    description: 'Menú del día: Sopa o consomé + Arroz o frijoles + Guisado a elegir + Tortillas + Vaso de agua fresca',
    availablePortions: 65,
    active: true,
    colorTheme: 'bg-amber-500',
  },
  // Desayunos
  {
    id: 'dish-1',
    name: 'Chilaquiles verdes con pollo y crema',
    category: 'desayuno',
    price: 75,
    description: 'Totopos bañados en salsa verde, pechuga deshebrada, crema, queso panela y frijoles refritos',
    recipeId: 'rec-1',
    availablePortions: 25,
    active: true,
    colorTheme: 'bg-emerald-600',
  },
  {
    id: 'dish-2',
    name: 'Huevos al gusto (con frijoles y tortillas)',
    category: 'desayuno',
    price: 60,
    description: 'A la mexicana, estrellados o con jamón, acompañados de frijoles refritos y tortillas',
    recipeId: 'rec-2',
    availablePortions: 30,
    active: true,
    colorTheme: 'bg-amber-600',
  },
  {
    id: 'dish-3',
    name: 'Molletes clásicos con pico de gallo',
    category: 'desayuno',
    price: 55,
    description: '2 mitades de telera con frijoles refritos, queso gratinado y pico de gallo fresco',
    recipeId: 'rec-3',
    availablePortions: 20,
    active: true,
    colorTheme: 'bg-orange-600',
  },
  // Sopas y Entradas
  {
    id: 'dish-4',
    name: 'Sopa de fideo casera',
    category: 'sopa_entrada',
    price: 30,
    description: 'Tradicional sopa caldosa de fideo doradito con jitomate, cebolla y toque de cilantro',
    recipeId: 'rec-4',
    availablePortions: 40,
    active: true,
    colorTheme: 'bg-red-500',
  },
  {
    id: 'dish-5',
    name: 'Consomé de pollo con arroz y verduras',
    category: 'sopa_entrada',
    price: 35,
    description: 'Caldo de pollo sazonado con arroz rojo, calabacita, zanahoria y garbanzo',
    recipeId: 'rec-5',
    availablePortions: 35,
    active: true,
    colorTheme: 'bg-amber-400',
  },
  // Platos Fuertes / Guisados
  {
    id: 'dish-6',
    name: 'Pollo en mole poblano con ajonjolí',
    category: 'plato_fuerte',
    price: 75,
    description: 'Pieza de pollo bañada en mole poblano espeso y aromático, decorado con ajonjolí',
    recipeId: 'rec-6',
    availablePortions: 25,
    active: true,
    colorTheme: 'bg-stone-800',
  },
  {
    id: 'dish-7',
    name: 'Milanesa de res empanizada con papas',
    category: 'plato_fuerte',
    price: 80,
    description: 'Fina milanesa de res crujiente servida con papas a la francesa y ensaladita',
    recipeId: 'rec-7',
    availablePortions: 22,
    active: true,
    colorTheme: 'bg-yellow-700',
  },
  {
    id: 'dish-8',
    name: 'Chiles rellenos de queso en caldillo',
    category: 'plato_fuerte',
    price: 75,
    description: 'Chile poblano capeado relleno de queso panela bañado en salsa de jitomate sazonada',
    recipeId: 'rec-8',
    availablePortions: 20,
    active: true,
    colorTheme: 'bg-green-700',
  },
  {
    id: 'dish-9',
    name: 'Cerdo en salsa verde con calabacitas',
    category: 'plato_fuerte',
    price: 70,
    description: 'Trocitos de cerdo suaves cocinados en salsa verde de tomate con calabacitas tiernas',
    recipeId: 'rec-9',
    availablePortions: 20,
    active: true,
    colorTheme: 'bg-lime-700',
  },
  // Guarniciones
  {
    id: 'dish-10',
    name: 'Arroz rojo mexicano',
    category: 'guarnicion',
    price: 25,
    description: 'Arroz sazonado con jitomate, zanahoria picada y chícharo',
    recipeId: 'rec-10',
    availablePortions: 50,
    active: true,
    colorTheme: 'bg-orange-500',
  },
  {
    id: 'dish-11',
    name: 'Frijoles refritos caseros',
    category: 'guarnicion',
    price: 25,
    description: 'Frijoles negros de la olla refritos con toque de manteca/aceite y queso espolvoreado',
    recipeId: 'rec-11',
    availablePortions: 50,
    active: true,
    colorTheme: 'bg-neutral-800',
  },
  // Bebidas
  {
    id: 'dish-12',
    name: 'Agua fresca de Horchata (1 Lt)',
    category: 'bebida',
    price: 30,
    description: 'Agua fresca tradicional con leche, canela y toque de vainilla bien fría',
    recipeId: 'rec-12',
    availablePortions: 40,
    active: true,
    colorTheme: 'bg-stone-200 text-stone-800',
  },
  {
    id: 'dish-13',
    name: 'Agua fresca de Jamaica (1 Lt)',
    category: 'bebida',
    price: 30,
    description: 'Agua fresca de flor de Jamaica natural, ligeramente endulzada y refrescante',
    recipeId: 'rec-13',
    availablePortions: 40,
    active: true,
    colorTheme: 'bg-rose-900',
  },
  {
    id: 'dish-14',
    name: 'Refresco embotellado 355ml',
    category: 'bebida',
    price: 25,
    description: 'Coca-Cola, Jarritos, Boing o Squirt frío',
    availablePortions: 48,
    active: true,
    colorTheme: 'bg-red-600',
  },
  {
    id: 'dish-15',
    name: 'Café de olla con piloncillo',
    category: 'bebida',
    price: 20,
    description: 'Café preparado en barro con canela y piloncillo caliente',
    recipeId: 'rec-14',
    availablePortions: 30,
    active: true,
    colorTheme: 'bg-amber-900',
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Chilaquiles verdes con pollo (Rendimiento 10 porciones)',
    dishId: 'dish-1',
    portionsYield: 10,
    ingredients: [
      { ingredientId: 'ing-1', quantity: 1.5, unit: 'kg' }, // 1.5 kg pechuga
      { ingredientId: 'ing-21', quantity: 1.8, unit: 'kg' }, // 1.8 kg tortillas totopo
      { ingredientId: 'ing-9', quantity: 1.5, unit: 'kg' }, // 1.5 kg tomate verde
      { ingredientId: 'ing-10', quantity: 0.15, unit: 'kg' }, // chile serrano
      { ingredientId: 'ing-6', quantity: 0.3, unit: 'kg' }, // cebolla
      { ingredientId: 'ing-20', quantity: 0.6, unit: 'lt' }, // crema
      { ingredientId: 'ing-18', quantity: 0.4, unit: 'kg' }, // queso panela
      { ingredientId: 'ing-16', quantity: 0.3, unit: 'lt' }, // aceite
    ],
    preparationNotes: 'Hervir tomates y serrano con cebolla y licuar. Freír totopos. Deshebrar pechuga cocida.',
  },
  {
    id: 'rec-2',
    name: 'Huevos al gusto (Rendimiento 5 porciones)',
    dishId: 'dish-2',
    portionsYield: 5,
    ingredients: [
      { ingredientId: 'ing-17', quantity: 0.7, unit: 'kg' }, // aprox 10 huevos
      { ingredientId: 'ing-5', quantity: 0.3, unit: 'kg' }, // jitomate
      { ingredientId: 'ing-6', quantity: 0.15, unit: 'kg' }, // cebolla
      { ingredientId: 'ing-10', quantity: 0.05, unit: 'kg' }, // chile
      { ingredientId: 'ing-16', quantity: 0.1, unit: 'lt' }, // aceite
      { ingredientId: 'ing-21', quantity: 0.5, unit: 'kg' }, // tortillas
    ],
  },
  {
    id: 'rec-3',
    name: 'Molletes clásicos (Rendimiento 6 porciones)',
    dishId: 'dish-3',
    portionsYield: 6,
    ingredients: [
      { ingredientId: 'ing-26', quantity: 6, unit: 'pza' }, // 6 teleras
      { ingredientId: 'ing-14', quantity: 0.5, unit: 'kg' }, // frijoles
      { ingredientId: 'ing-19', quantity: 0.4, unit: 'kg' }, // queso Oaxaca
      { ingredientId: 'ing-5', quantity: 0.3, unit: 'kg' }, // jitomate pico de gallo
      { ingredientId: 'ing-6', quantity: 0.15, unit: 'kg' }, // cebolla
    ],
  },
  {
    id: 'rec-4',
    name: 'Sopa de fideo casera (Rendimiento 20 porciones)',
    dishId: 'dish-4',
    portionsYield: 20,
    ingredients: [
      { ingredientId: 'ing-15', quantity: 4, unit: 'pza' }, // 4 paquetes de fideo (800g)
      { ingredientId: 'ing-5', quantity: 1.5, unit: 'kg' }, // jitomate
      { ingredientId: 'ing-6', quantity: 0.3, unit: 'kg' }, // cebolla
      { ingredientId: 'ing-16', quantity: 0.2, unit: 'lt' }, // aceite
    ],
    preparationNotes: 'Dorar el fideo parejo a fuego medio sin quemar. Vaciar el recaudo de jitomate colado.',
  },
  {
    id: 'rec-5',
    name: 'Consomé de pollo con arroz (Rendimiento 20 porciones)',
    dishId: 'dish-5',
    portionsYield: 20,
    ingredients: [
      { ingredientId: 'ing-1', quantity: 1.5, unit: 'kg' }, // pollo para caldo
      { ingredientId: 'ing-11', quantity: 0.8, unit: 'kg' }, // zanahoria
      { ingredientId: 'ing-12', quantity: 0.8, unit: 'kg' }, // calabacita
      { ingredientId: 'ing-13', quantity: 0.5, unit: 'kg' }, // arroz cocido
    ],
  },
  {
    id: 'rec-6',
    name: 'Pollo en mole poblano (Rendimiento 20 porciones)',
    dishId: 'dish-6',
    portionsYield: 20,
    ingredients: [
      { ingredientId: 'ing-1', quantity: 4.0, unit: 'kg' }, // 4 kg pechuga/pollo
      { ingredientId: 'ing-22', quantity: 1.2, unit: 'kg' }, // pasta de mole
      { ingredientId: 'ing-25', quantity: 0.2, unit: 'kg' }, // azúcar/piloncillo
      { ingredientId: 'ing-16', quantity: 0.2, unit: 'lt' }, // aceite
    ],
    preparationNotes: 'Deshacer la pasta de mole en caldo caliente de pollo. Cocinar a fuego lento moviendo con cuchara de madera.',
  },
  {
    id: 'rec-7',
    name: 'Milanesa de res con papas (Rendimiento 10 porciones)',
    dishId: 'dish-7',
    portionsYield: 10,
    ingredients: [
      { ingredientId: 'ing-2', quantity: 2.0, unit: 'kg' }, // bistec de res
      { ingredientId: 'ing-17', quantity: 0.3, unit: 'kg' }, // huevo para capear
      { ingredientId: 'ing-7', quantity: 2.5, unit: 'kg' }, // papas para freír
      { ingredientId: 'ing-16', quantity: 0.6, unit: 'lt' }, // aceite
    ],
  },
  {
    id: 'rec-8',
    name: 'Chiles rellenos de queso (Rendimiento 10 porciones)',
    dishId: 'dish-8',
    portionsYield: 10,
    ingredients: [
      { ingredientId: 'ing-8', quantity: 2.0, unit: 'kg' }, // chiles poblanos
      { ingredientId: 'ing-18', quantity: 1.2, unit: 'kg' }, // queso panela
      { ingredientId: 'ing-17', quantity: 0.5, unit: 'kg' }, // huevo para capear
      { ingredientId: 'ing-5', quantity: 1.2, unit: 'kg' }, // caldillo de jitomate
      { ingredientId: 'ing-16', quantity: 0.4, unit: 'lt' }, // aceite
    ],
  },
  {
    id: 'rec-9',
    name: 'Cerdo en salsa verde con calabacitas (Rendimiento 15 porciones)',
    dishId: 'dish-9',
    portionsYield: 15,
    ingredients: [
      { ingredientId: 'ing-3', quantity: 2.5, unit: 'kg' }, // cerdo
      { ingredientId: 'ing-9', quantity: 1.8, unit: 'kg' }, // tomate verde
      { ingredientId: 'ing-10', quantity: 0.15, unit: 'kg' }, // serrano
      { ingredientId: 'ing-12', quantity: 1.2, unit: 'kg' }, // calabacita
      { ingredientId: 'ing-6', quantity: 0.3, unit: 'kg' }, // cebolla
    ],
  },
  {
    id: 'rec-10',
    name: 'Arroz rojo mexicano (Rendimiento 30 porciones)',
    dishId: 'dish-10',
    portionsYield: 30,
    ingredients: [
      { ingredientId: 'ing-13', quantity: 2.0, unit: 'kg' }, // arroz
      { ingredientId: 'ing-5', quantity: 1.0, unit: 'kg' }, // jitomate
      { ingredientId: 'ing-6', quantity: 0.3, unit: 'kg' }, // cebolla
      { ingredientId: 'ing-16', quantity: 0.3, unit: 'lt' }, // aceite
    ],
  },
  {
    id: 'rec-11',
    name: 'Frijoles refritos (Rendimiento 30 porciones)',
    dishId: 'dish-11',
    portionsYield: 30,
    ingredients: [
      { ingredientId: 'ing-14', quantity: 2.0, unit: 'kg' }, // frijol negro
      { ingredientId: 'ing-6', quantity: 0.3, unit: 'kg' }, // cebolla
      { ingredientId: 'ing-16', quantity: 0.3, unit: 'lt' }, // aceite
    ],
  },
  {
    id: 'rec-12',
    name: 'Agua fresca de Horchata (Rendimiento 20 litros)',
    dishId: 'dish-12',
    portionsYield: 20,
    ingredients: [
      { ingredientId: 'ing-23', quantity: 1.5, unit: 'lt' }, // concentrado
      { ingredientId: 'ing-25', quantity: 1.0, unit: 'kg' }, // azúcar
    ],
  },
  {
    id: 'rec-13',
    name: 'Agua fresca de Jamaica (Rendimiento 20 litros)',
    dishId: 'dish-13',
    portionsYield: 20,
    ingredients: [
      { ingredientId: 'ing-24', quantity: 0.5, unit: 'kg' }, // flor de jamaica
      { ingredientId: 'ing-25', quantity: 1.2, unit: 'kg' }, // azúcar
    ],
  },
  {
    id: 'rec-14',
    name: 'Café de olla (Rendimiento 15 tazas)',
    dishId: 'dish-15',
    portionsYield: 15,
    ingredients: [
      { ingredientId: 'ing-28', quantity: 0.25, unit: 'kg' }, // café
      { ingredientId: 'ing-25', quantity: 0.3, unit: 'kg' }, // piloncillo/azúcar
    ],
  },
];

const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_MENUS: DailyMenu[] = [
  {
    id: 'menu-today-comida',
    date: todayStr,
    shift: 'comida',
    isProductionConfirmed: true,
    productionConfirmedAt: `${todayStr}T11:30:00`,
    notes: 'Menú especial de comida corrida con Pollo en mole y Milanesa',
    items: [
      { dishId: 'dish-pkg', plannedPortions: 60, preparedPortions: 60, soldPortions: 38, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-4', plannedPortions: 40, preparedPortions: 40, soldPortions: 28, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-5', plannedPortions: 25, preparedPortions: 25, soldPortions: 16, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-6', plannedPortions: 25, preparedPortions: 25, soldPortions: 19, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-7', plannedPortions: 20, preparedPortions: 20, soldPortions: 14, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-8', plannedPortions: 15, preparedPortions: 15, soldPortions: 11, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-10', plannedPortions: 50, preparedPortions: 50, soldPortions: 36, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-11', plannedPortions: 45, preparedPortions: 45, soldPortions: 31, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-12', plannedPortions: 30, preparedPortions: 30, soldPortions: 22, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
      { dishId: 'dish-13', plannedPortions: 30, preparedPortions: 30, soldPortions: 18, leftoverPortions: 0, wastePortions: 0, status: 'preparado' },
    ],
  },
  {
    id: 'menu-today-desayuno',
    date: todayStr,
    shift: 'desayuno',
    isProductionConfirmed: true,
    productionConfirmedAt: `${todayStr}T07:15:00`,
    notes: 'Turno de desayuno completado',
    items: [
      { dishId: 'dish-1', plannedPortions: 25, preparedPortions: 25, soldPortions: 23, leftoverPortions: 2, wastePortions: 0, status: 'cerrado' },
      { dishId: 'dish-2', plannedPortions: 20, preparedPortions: 20, soldPortions: 19, leftoverPortions: 1, wastePortions: 0, status: 'cerrado' },
      { dishId: 'dish-3', plannedPortions: 15, preparedPortions: 15, soldPortions: 14, leftoverPortions: 1, wastePortions: 0, status: 'cerrado' },
      { dishId: 'dish-15', plannedPortions: 25, preparedPortions: 25, soldPortions: 24, leftoverPortions: 1, wastePortions: 0, status: 'cerrado' },
    ],
  },
];

export const INITIAL_SHIFTS: CashShift[] = [
  {
    id: 'shift-desayuno-today',
    date: todayStr,
    shift: 'desayuno',
    status: 'cerrado',
    openedAt: `${todayStr}T07:00:00`,
    closedAt: `${todayStr}T12:00:00`,
    openedBy: 'Carlos Mendoza',
    closedBy: 'Guadalupe Ramírez',
    initialCash: 500,
    cashSalesTotal: 2420,
    transferSalesTotal: 580,
    cashInTotal: 0,
    cashOutTotal: 50, // Hielo
    expectedCash: 2870, // 500 + 2420 - 50
    countedCash: 2870,
    difference: 0,
    notes: 'Corte cuadrado exacto sin incidencias.',
  },
  {
    id: 'shift-comida-today',
    date: todayStr,
    shift: 'comida',
    status: 'abierto',
    openedAt: `${todayStr}T12:30:00`,
    openedBy: 'Carlos Mendoza',
    initialCash: 500,
    cashSalesTotal: 3485,
    transferSalesTotal: 1020,
    cashInTotal: 0,
    cashOutTotal: 0,
    expectedCash: 3985, // 500 + 3485
    notes: 'Turno de comida en curso (activo).',
  },
];

export const INITIAL_EXPENSES: OperationalExpense[] = [
  {
    id: 'exp-1',
    date: todayStr,
    category: 'gas_lp',
    amount: 550,
    paymentMethod: 'efectivo',
    description: 'Carga de cilindro de gas LP para estufas principales',
    registeredBy: 'Guadalupe Ramírez',
  },
  {
    id: 'exp-2',
    date: todayStr,
    category: 'hielo',
    amount: 50,
    paymentMethod: 'efectivo',
    description: 'Bolsa de hielo purificado para aguas frescas de sabor',
    registeredBy: 'Guadalupe Ramírez',
  },
  {
    id: 'exp-3',
    date: todayStr,
    category: 'desechables_empaque',
    amount: 280,
    paymentMethod: 'transferencia',
    description: 'Bolsas, contenedores de unicel y cubiertos para pedidos para llevar',
    registeredBy: 'Guadalupe Ramírez',
  },
];

export const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    ingredientId: 'ing-1',
    ingredientName: 'Pechuga de pollo fresca',
    type: 'compra',
    quantityChange: 15,
    finalStock: 18.5,
    unitCost: 98.0,
    date: todayStr,
    timestamp: Date.now() - 36000000,
    reason: 'Compra semanal para guisados y mole',
    authorizedBy: 'Guadalupe Ramírez',
  },
  {
    id: 'mov-2',
    ingredientId: 'ing-5',
    ingredientName: 'Jitomate guaje/bola',
    type: 'compra',
    quantityChange: 20,
    finalStock: 24.0,
    unitCost: 26.0,
    date: todayStr,
    timestamp: Date.now() - 35000000,
    reason: 'Surtido de verdura fresca Don Mateo',
    authorizedBy: 'Guadalupe Ramírez',
  },
  {
    id: 'mov-3',
    ingredientId: 'ing-1',
    ingredientName: 'Pechuga de pollo fresca',
    type: 'produccion',
    quantityChange: -4.0,
    finalStock: 14.5,
    unitCost: 98.0,
    date: todayStr,
    timestamp: Date.now() - 14000000,
    reason: 'Consumo por confirmación de menú: 20 porciones Pollo en Mole',
    authorizedBy: 'Guadalupe Ramírez',
  },
];
