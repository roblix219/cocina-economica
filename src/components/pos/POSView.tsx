import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Dish, DishCategory, PaymentMethod, SaleChannel, SaleItem, Sale } from '../../types';
import { TicketModal } from '../common/TicketModal';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  ArrowRight,
  Check,
  CreditCard,
  Utensils,
  Package,
  Layers,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface CartItem {
  dish: Dish;
  quantity: number;
}

const CATEGORIES: Array<{ id: string; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'paquete_corrida', label: '🍱 Comida Corrida' },
  { id: 'plato_fuerte', label: '🍲 Guisados' },
  { id: 'desayuno', label: '🍳 Desayunos' },
  { id: 'sopa_entrada', label: '🥣 Sopas y Caldos' },
  { id: 'guarnicion', label: '🍚 Guarniciones' },
  { id: 'bebida', label: '🥤 Bebidas y Aguas' },
];

export const POSView: React.FC = () => {
  const {
    dishes,
    recipes,
    getRecipeCost,
    registerSale,
    formatMoney,
    activeShift,
    selectedShift,
    currentUser,
    config,
    setCurrentView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [channel, setChannel] = useState<SaleChannel>('local');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  // Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [transferRef, setTransferRef] = useState<string>('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (!dish.active) return false;
      const matchesCat =
        selectedCategory === 'todos' ? true : dish.category === selectedCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  // Cart Totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  }, [cart]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - (Number(discount) || 0));
  }, [subtotal, discount]);

  // Cart operations
  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setIsPayModalOpen(false);
    setAmountPaid('');
    setTransferRef('');
  };

  // Open Pay Modal
  const handleProceedToPay = () => {
    if (cart.length === 0) return;
    setAmountPaid(String(total));
    setIsPayModalOpen(true);
  };

  // Cash change calculation
  const numericAmountPaid = Number(amountPaid) || 0;
  const changeToReturn = Math.max(0, numericAmountPaid - total);

  // Confirm Sale
  const handleFinalizeSale = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'efectivo' && numericAmountPaid < total) {
      alert(`El monto en efectivo ingresado (${formatMoney(numericAmountPaid)}) es menor al total (${formatMoney(total)}).`);
      return;
    }

    // Prepare SaleItem array with recipe cost per portion at time of sale
    const saleItems: SaleItem[] = cart.map((ci) => {
      let costPerPortion = 0;
      if (ci.dish.recipeId) {
        const rec = recipes.find((r) => r.id === ci.dish.recipeId);
        if (rec) {
          costPerPortion = getRecipeCost(rec).costPerPortion;
        }
      } else if (ci.dish.id === 'dish-pkg') {
        // Paquete comida corrida base cost ~ $31 MXN
        costPerPortion = 31.5;
      }

      return {
        dishId: ci.dish.id,
        dishName: ci.dish.name,
        category: ci.dish.category,
        quantity: ci.quantity,
        unitPrice: ci.dish.price,
        subtotal: ci.dish.price * ci.quantity,
        estimatedCostPerPortion: costPerPortion,
      };
    });

    const newSale = registerSale({
      channel,
      paymentMethod,
      items: saleItems,
      subtotal,
      discount: Number(discount) || 0,
      total,
      amountPaid: paymentMethod === 'efectivo' ? numericAmountPaid : undefined,
      change: paymentMethod === 'efectivo' ? changeToReturn : undefined,
      transferRef: paymentMethod === 'transferencia' ? transferRef : undefined,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    // Reset and show ticket
    clearCart();
    setCompletedSale(newSale);
    setIsTicketOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-16 md:pb-6">
      {/* Top Header Row for POS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            Punto de Venta Táctil
          </h2>
          <p className="text-xs text-stone-500">
            Selecciona los platillos para armar la orden. Toca sobre cada botón para agregar.
          </p>
        </div>

        {/* Channel Switcher (Local vs Para Llevar) */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs w-full sm:w-auto">
          <button
            onClick={() => setChannel('local')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              channel === 'local'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Servicio Local</span>
          </button>
          <button
            onClick={() => setChannel('llevar')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              channel === 'llevar'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Para Llevar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Catalog, Right Order Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Category Tabs + Search + Dishes Grid (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
          {/* Quick Package Button (Top Highlight) */}
          <div
            onClick={() => {
              const pkgDish = dishes.find((d) => d.id === 'dish-pkg');
              if (pkgDish) addToCart(pkgDish);
            }}
            className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-2xl shadow-md hover:from-amber-600 hover:to-orange-700 transition flex items-center justify-between gap-3 active:scale-[0.99] border border-amber-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
                🍱
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    Comida Corrida Completa
                  </h3>
                  <span className="bg-white text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Más Vendido
                  </span>
                </div>
                <p className="text-xs text-amber-100 line-clamp-1">
                  Sopa/Consomé + Arroz/Frijoles + Guisado a elegir + Tortillas + Agua fresca
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-black">{formatMoney(config.packagePrice)}</span>
              <span className="block text-[10px] text-amber-200 uppercase font-bold">+ Agregar</span>
            </div>
          </div>

          {/* Search Bar & Category Filter Carousel */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar platillo, guisado o bebida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Buttons Touch Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredDishes.map((dish) => {
              const available = dish.availablePortions ?? 0;
              const isLow = available <= 5;
              const isOut = available <= 0;

              return (
                <button
                  key={dish.id}
                  onClick={() => addToCart(dish)}
                  className="bg-white border border-stone-200 hover:border-orange-400 rounded-2xl p-3 text-left transition flex flex-col justify-between shadow-xs hover:shadow-md active:scale-95 group relative overflow-hidden min-h-[110px]"
                >
                  {/* Category Accent top bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      dish.colorTheme || 'bg-orange-500'
                    }`}
                  />

                  {/* Name & Portions Badge */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug group-hover:text-orange-700 transition">
                        {dish.name}
                      </h4>
                    </div>
                    {dish.description && (
                      <p className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
                        {dish.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Availability footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                    <span className="text-sm font-black text-stone-900">
                      {formatMoney(dish.price)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isOut
                          ? 'bg-stone-100 text-stone-400'
                          : isLow
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {available} disp.
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredDishes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-2">
              <Utensils className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-xs">No se encontraron platillos con ese filtro o búsqueda.</p>
            </div>
          )}
        </div>

        {/* Right Column: Order Ticket / Cart (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-stone-200 shadow-lg p-4 sm:p-5 sticky top-20 space-y-4">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>Orden Actual</span>
              </h3>
              <span className="text-[11px] font-semibold text-stone-500">
                Servicio: <strong className="capitalize text-stone-800">{channel}</strong> ·{' '}
                {cart.reduce((acc, i) => acc + i.quantity, 0)} productos
              </span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.dish.id}
                className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex-1 truncate">
                  <p className="font-bold text-stone-900 truncate">{item.dish.name}</p>
                  <p className="text-[10px] text-stone-500">
                    {formatMoney(item.dish.price)} c/u
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                  <button
                    onClick={() => updateQuantity(item.dish.id, -1)}
                    className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.dish.id, 1)}
                    className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-xs">
                    {formatMoney(item.dish.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.dish.id)}
                    className="text-stone-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center py-8 text-stone-400 text-xs space-y-1">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-200" />
                <p>Orden vacía</p>
                <p className="text-[10px]">Toca cualquier platillo a la izquierda para agregar.</p>
              </div>
            )}
          </div>

          {/* Subtotals & Discounts */}
          <div className="border-t border-stone-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatMoney(subtotal)}</span>
            </div>

            {/* Optional Discount input */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 text-[11px]">Descuento ($):</span>
              <div className="w-24">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                  placeholder="0.00"
                  className="w-full text-right bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Total Big Highlight */}
            <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
              <span className="text-sm font-black text-stone-900">TOTAL:</span>
              <span className="text-2xl font-black text-orange-700">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleProceedToPay}
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>Cobrar {formatMoney(total)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pay Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 space-y-4 my-auto">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Finalizar Cobro de Pedido
                </h3>
                <p className="text-xs text-stone-500">
                  Modalidad: <strong className="capitalize">{channel}</strong> · Total:{' '}
                  <strong className="text-orange-700">{formatMoney(total)}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* Method Tabs: Efectivo vs Transferencia */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('efectivo');
                  setAmountPaid(String(total));
                }}
                className={`py-3 px-3 rounded-2xl border font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'efectivo'
                    ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia')}
                className={`py-3 px-3 rounded-2xl border font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'transferencia'
                    ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Transferencia SPEI</span>
              </button>
            </div>

            {/* Cash Flow Inputs */}
            {paymentMethod === 'efectivo' && (
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    ¿Con cuánto paga el cliente?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="Monto entregado"
                      className="w-full pl-7 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-mono text-base font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Quick bill suggestions */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {[total, 100, 200, 500].map((billVal, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAmountPaid(String(billVal))}
                      className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-[11px] transition"
                    >
                      {idx === 0 ? 'Exacto' : `$${billVal}`}
                    </button>
                  ))}
                </div>

                {/* Change calculation */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-600">Cambio a entregar:</span>
                  <span
                    className={`font-black text-lg font-mono ${
                      numericAmountPaid < total ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {numericAmountPaid < total
                      ? 'Monto insuficiente'
                      : formatMoney(changeToReturn)}
                  </span>
                </div>
              </div>
            )}

            {/* Transfer flow input */}
            {paymentMethod === 'transferencia' && (
              <div className="space-y-2 bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs">
                <label className="font-bold text-blue-950 block">
                  Número de referencia / Folio de comprobante
                </label>
                <input
                  type="text"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  placeholder="Ej. BBVA-8941 o MercadoPago"
                  className="w-full px-3 py-2.5 bg-white border border-blue-300 rounded-xl text-stone-800 font-medium focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-blue-700">
                  ⚠️ Recuerda que las transferencias se verifican en la app bancaria y NO suman al
                  efectivo físico del cajón.
                </p>
              </div>
            )}

            {/* Confirm button */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-100 text-xs transition"
              >
                Regresar
              </button>

              <button
                type="button"
                onClick={handleFinalizeSale}
                className="flex-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Imprimir Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal Preview on Sale Completion */}
      <TicketModal
        sale={completedSale}
        config={config}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        formatMoney={formatMoney}
      />
    </div>
  );
};
