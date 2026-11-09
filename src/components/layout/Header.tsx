import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  UtensilsCrossed,
  Sun,
  Sunset,
  Users,
  ChevronDown,
  AlertTriangle,
  Calendar,
  Wifi,
  WifiOff,
  ShoppingBag,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    config,
    currentUser,
    users,
    switchUser,
    selectedShift,
    setSelectedShift,
    selectedDate,
    setSelectedDate,
    activeShift,
    currentMenu,
    lowStockIngredients,
    setCurrentView,
  } = useApp();

  const isOnline = useOnlineStatus();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div
          onClick={() => setCurrentView('inicio')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-stone-900 leading-tight tracking-tight">
                {config.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-sm">
                PWA
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-stone-500 leading-none">
              Cocina Económica · Comida Corrida
            </p>
          </div>
        </div>

        {/* Center / Shift & Date Selector */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Shift selector pills */}
          <div className="bg-stone-100 p-0.5 rounded-lg flex items-center border border-stone-200 text-xs">
            <button
              onClick={() => setSelectedShift('desayuno')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                selectedShift === 'desayuno'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desayuno</span>
            </button>
            <button
              onClick={() => setSelectedShift('comida')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                selectedShift === 'comida'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Comida</span>
            </button>
          </div>

          {/* Quick Date picker */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Shift State Badge */}
          <div
            onClick={() => setCurrentView('caja')}
            className={`cursor-pointer px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeShift?.status === 'abierto'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
            }`}
            title="Estado de caja para este turno"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeShift?.status === 'abierto'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">Caja:</span>
            <span>{activeShift?.status === 'abierto' ? 'Abierta' : 'Cerrada'}</span>
          </div>
        </div>

        {/* Right Section: PWA Install + Alerts + Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Low stock alert badge */}
          {lowStockIngredients.length > 0 && currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentView('inventario')}
              title={`${lowStockIngredients.length} ingredientes con existencia baja`}
              className="relative p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {lowStockIngredients.length}
              </span>
            </button>
          )}

          {/* Quick link to POS from header */}
          <button
            onClick={() => setCurrentView('pos')}
            className="hidden sm:flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95"
            title="Ir directo a Cobrar en Caja"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
            <span>Cobrar</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded-xl text-xs font-medium transition"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  currentUser.role === 'admin' ? 'bg-orange-600' : 'bg-blue-600'
                }`}
              >
                {currentUser.role === 'admin' ? 'A' : 'C'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="font-bold text-[11px] leading-tight text-stone-900">
                  {currentUser.role === 'admin' ? 'Administrador' : 'Cajero'}
                </p>
                <p className="text-[10px] text-stone-500 leading-none truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 border-b border-stone-100 mb-1">
                  <p className="font-bold text-stone-900">Cambiar Rol / Perfil</p>
                  <p className="text-[10px] text-stone-500">
                    Cambia entre Administrador y Cajero para probar permisos.
                  </p>
                </div>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition ${
                      currentUser.id === user.id
                        ? 'bg-orange-50 text-orange-900 font-bold'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <p className="leading-tight">{user.name}</p>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          user.role === 'admin'
                            ? 'bg-orange-200 text-orange-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {user.role === 'admin' ? 'Administrador' : 'Cajero'}
                      </span>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
