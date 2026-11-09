import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  CircleDollarSign,
  Menu as MenuIcon,
  X,
  BookOpen,
  Boxes,
  Receipt,
  TrendingUp,
  Settings,
  Lock,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, currentUser, lowStockIngredients } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const navItems = [
    { id: 'inicio' as AppView, label: 'Inicio', icon: LayoutDashboard },
    { id: 'menu' as AppView, label: 'Menú', icon: CalendarDays },
    { id: 'pos' as AppView, label: 'Cobrar', icon: ShoppingBag, isCenter: true },
    { id: 'caja' as AppView, label: 'Caja', icon: CircleDollarSign },
  ];

  return (
    <>
      {/* Bottom Sticky Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="flex flex-col items-center -mt-5 transition active:scale-90"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 border-2 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-orange-950 mt-0.5">
                  Cobrar
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu Drawer Button */}
        <button
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-900 relative ${
            ['recetas', 'inventario', 'gastos', 'reportes', 'config'].includes(currentView)
              ? 'text-orange-600 font-bold'
              : ''
          }`}
        >
          <MenuIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Más</span>
          {lowStockIngredients.length > 0 && currentUser.role === 'admin' && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
      </nav>

      {/* Drawer Overlay for Extra Mobile Modules */}
      {showDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Módulos Adicionales</h3>
                <p className="text-[11px] text-stone-500">
                  {currentUser.role === 'admin'
                    ? 'Acceso completo de Administrador'
                    : 'Modo Cajero limitado'}
                </p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Recetas */}
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') {
                    setCurrentView('recetas');
                    setShowDrawer(false);
                  }
                }}
                disabled={currentUser.role !== 'admin'}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left ${
                  currentView === 'recetas'
                    ? 'bg-orange-50 border-orange-300 text-orange-900'
                    : currentUser.role !== 'admin'
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed text-stone-400'
                    : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex justify-between w-full">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  {currentUser.role !== 'admin' && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <span className="font-bold">Recetario y Costos</span>
                <span className="text-[10px] text-stone-500">Cálculo de porción</span>
              </button>

              {/* Inventario */}
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') {
                    setCurrentView('inventario');
                    setShowDrawer(false);
                  }
                }}
                disabled={currentUser.role !== 'admin'}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left ${
                  currentView === 'inventario'
                    ? 'bg-orange-50 border-orange-300 text-orange-900'
                    : currentUser.role !== 'admin'
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed text-stone-400'
                    : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex justify-between w-full">
                  <Boxes className="w-4 h-4 text-orange-600" />
                  {lowStockIngredients.length > 0 && (
                    <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 rounded-full">
                      {lowStockIngredients.length}
                    </span>
                  )}
                  {currentUser.role !== 'admin' && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <span className="font-bold">Inventario & CPP</span>
                <span className="text-[10px] text-stone-500">Compras y mermas</span>
              </button>

              {/* Gastos */}
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') {
                    setCurrentView('gastos');
                    setShowDrawer(false);
                  }
                }}
                disabled={currentUser.role !== 'admin'}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left ${
                  currentView === 'gastos'
                    ? 'bg-orange-50 border-orange-300 text-orange-900'
                    : currentUser.role !== 'admin'
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed text-stone-400'
                    : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex justify-between w-full">
                  <Receipt className="w-4 h-4 text-orange-600" />
                  {currentUser.role !== 'admin' && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <span className="font-bold">Gastos Operativos</span>
                <span className="text-[10px] text-stone-500">Renta, gas, sueldos</span>
              </button>

              {/* Reportes */}
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') {
                    setCurrentView('reportes');
                    setShowDrawer(false);
                  }
                }}
                disabled={currentUser.role !== 'admin'}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left ${
                  currentView === 'reportes'
                    ? 'bg-orange-50 border-orange-300 text-orange-900'
                    : currentUser.role !== 'admin'
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed text-stone-400'
                    : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex justify-between w-full">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  {currentUser.role !== 'admin' && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <span className="font-bold">Rentabilidad</span>
                <span className="text-[10px] text-stone-500">Utilidad y márgenes</span>
              </button>
            </div>

            {/* Configuración */}
            <button
              onClick={() => {
                if (currentUser.role === 'admin') {
                  setCurrentView('config');
                  setShowDrawer(false);
                }
              }}
              disabled={currentUser.role !== 'admin'}
              className="mt-3 w-full p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-semibold text-stone-800"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-stone-600" />
                <span>Configuración y Catálogos</span>
              </div>
              {currentUser.role !== 'admin' ? (
                <Lock className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <span className="text-stone-400">›</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
