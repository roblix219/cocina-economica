import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  BookOpen,
  Boxes,
  CircleDollarSign,
  Receipt,
  TrendingUp,
  Settings,
  Lock,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    sublabel: 'Resumen del día',
    icon: LayoutDashboard,
  },
  {
    id: 'pos',
    label: 'Punto de Venta',
    sublabel: 'Cobrar pedidos',
    icon: ShoppingBag,
    highlight: true,
  },
  {
    id: 'menu',
    label: 'Menú y Producción',
    sublabel: 'Planear y preparar',
    icon: CalendarDays,
  },
  {
    id: 'recetas',
    label: 'Recetas y Costeo',
    sublabel: 'Costo por porción',
    icon: BookOpen,
    adminOnly: true,
  },
  {
    id: 'inventario',
    label: 'Inventario y Compras',
    sublabel: 'Stock y costo promedio',
    icon: Boxes,
    adminOnly: true,
  },
  {
    id: 'caja',
    label: 'Caja y Turnos',
    sublabel: 'Apertura y cortes',
    icon: CircleDollarSign,
  },
  {
    id: 'gastos',
    label: 'Gastos Operativos',
    sublabel: 'Renta, gas, luz',
    icon: Receipt,
    adminOnly: true,
  },
  {
    id: 'reportes',
    label: 'Rentabilidad',
    sublabel: 'Utilidad y márgenes',
    icon: TrendingUp,
    adminOnly: true,
  },
  {
    id: 'config',
    label: 'Configuración',
    sublabel: 'Catálogos y datos',
    icon: Settings,
    adminOnly: true,
  },
];

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentUser, lowStockIngredients, currentMenu } = useApp();

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Menu */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-stone-400">
          Módulos del Sistema
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isLocked = item.adminOnly && currentUser.role !== 'admin';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isLocked) {
                  setCurrentView(item.id);
                }
              }}
              disabled={isLocked}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition relative group ${
                isActive
                  ? 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/25'
                  : isLocked
                  ? 'text-stone-300 cursor-not-allowed opacity-60'
                  : item.highlight
                  ? 'text-orange-950 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isLocked
                    ? 'text-stone-300'
                    : item.highlight
                    ? 'bg-amber-200/70 text-orange-800'
                    : 'text-stone-500 group-hover:text-stone-900 group-hover:bg-stone-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate">{item.label}</span>
                  {isLocked && <Lock className="w-3 h-3 text-stone-300 shrink-0" />}
                  {item.id === 'inventario' && lowStockIngredients.length > 0 && !isLocked && (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 rounded-full">
                      {lowStockIngredients.length}
                    </span>
                  )}
                  {item.id === 'menu' && currentMenu && !currentMenu.isProductionConfirmed && (
                    <span className="text-[9px] font-bold bg-rose-500 text-white px-1 rounded">
                      Por preparar
                    </span>
                  )}
                </div>
                <p
                  className={`text-[10px] leading-tight truncate ${
                    isActive ? 'text-orange-100' : 'text-stone-400'
                  }`}
                >
                  {item.sublabel}
                </p>
              </div>

              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-300 rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Role Footer Banner */}
      <div className="p-3 border-t border-stone-100 bg-stone-50/80 m-2 rounded-2xl">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
              currentUser.role === 'admin' ? 'bg-orange-600' : 'bg-blue-600'
            }`}
          >
            {currentUser.role === 'admin' ? 'A' : 'C'}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-stone-900 leading-tight truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-stone-500 capitalize">
              Rol: {currentUser.role === 'admin' ? 'Administrador' : 'Cajero'}
            </p>
          </div>
        </div>
        {currentUser.role !== 'admin' && (
          <p className="text-[10px] text-stone-400 mt-2 bg-stone-100 p-1.5 rounded-lg leading-tight border border-stone-200">
            🔒 Modo Cajero activo: Acceso limitado a Cobro y Arqueo de Caja.
          </p>
        )}
      </div>
    </aside>
  );
};
