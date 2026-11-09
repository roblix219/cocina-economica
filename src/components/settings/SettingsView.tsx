import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Store,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  Users,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Dish, DishCategory } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    config,
    updateConfig,
    dishes,
    addDish,
    updateDish,
    deleteDish,
    suppliers,
    addSupplier,
    resetToDemoData,
    exportBackup,
    importBackup,
    formatMoney,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'negocio' | 'platillos' | 'proveedores' | 'respaldo'>('negocio');

  // Business info form
  const [name, setName] = useState(config.name);
  const [tagline, setTagline] = useState(config.tagline);
  const [rfc, setRfc] = useState(config.rfc);
  const [phone, setPhone] = useState(config.phone);
  const [address, setAddress] = useState(config.address);
  const [ticketFooter, setTicketFooter] = useState(config.ticketFooter);
  const [packagePrice, setPackagePrice] = useState(config.packagePrice);
  const [savedConfigNotice, setSavedConfigNotice] = useState(false);

  // New Dish modal state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<DishCategory>('plato_fuerte');
  const [dishPrice, setDishPrice] = useState<number>(75);
  const [dishDesc, setDishDesc] = useState('');

  // New Supplier modal state
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supAddress, setSupAddress] = useState('');

  // Import JSON textarea
  const [importJsonText, setImportJsonText] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name,
      tagline,
      rfc,
      phone,
      address,
      ticketFooter,
      packagePrice: Number(packagePrice),
    });
    setSavedConfigNotice(true);
    setTimeout(() => setSavedConfigNotice(false), 3000);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || dishPrice <= 0) return;

    addDish({
      name: dishName,
      category: dishCategory,
      price: Number(dishPrice),
      description: dishDesc,
      availablePortions: 20,
      active: true,
    });

    setIsDishModalOpen(false);
    setDishName('');
    setDishDesc('');
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName) return;

    addSupplier({
      name: supName,
      contact: supContact,
      phone: supPhone,
      address: supAddress,
    });

    setIsSupplierModalOpen(false);
    setSupName('');
    setSupContact('');
    setSupPhone('');
    setSupAddress('');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-cocina-respaldo-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDoImport = () => {
    if (!importJsonText) return;
    const ok = importBackup(importJsonText);
    if (ok) {
      alert('¡Datos restaurados con éxito desde el respaldo!');
      setImportJsonText('');
    } else {
      alert('Error: el formato JSON no es válido.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Configuración y Catálogos del Sistema
          </h2>
          <p className="text-xs text-stone-500">
            Administra los datos fiscales del negocio, platillos, proveedores y respaldos de información.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('negocio')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'negocio'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Datos del Negocio y Tickets</span>
        </button>

        <button
          onClick={() => setActiveTab('platillos')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'platillos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <span>Catálogo de Platillos ({dishes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proveedores')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'proveedores'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <span>Proveedores ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('respaldo')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'respaldo'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Respaldo y Reinicio Demo</span>
        </button>
      </div>

      {/* Tab 1: Datos del Negocio */}
      {activeTab === 'negocio' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 max-w-2xl space-y-4 text-xs">
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nombre Comercial:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Eslogan / Subtítulo:</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">RFC (Opcional):</label>
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Teléfono:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Dirección Física:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Precio Sugerido Paquete Comida Corrida ($ MXN):
              </label>
              <input
                type="number"
                min="30"
                value={packagePrice}
                onChange={(e) => setPackagePrice(Number(e.target.value))}
                className="w-32 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-center"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Pie de Ticket Térmico:</label>
              <input
                type="text"
                value={ticketFooter}
                onChange={(e) => setTicketFooter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedConfigNotice ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> ¡Guardado con éxito!
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Catálogo de Platillos */}
      {activeTab === 'platillos' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <p className="text-stone-500">
              Catálogo general de platillos y guisados disponibles para armar menús o vender individualmente.
            </p>
            <button
              onClick={() => setIsDishModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Platillo</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Platillo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-right">Precio Venta</th>
                    <th className="py-3 px-4 text-right">Porciones Disp.</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {dishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-bold text-stone-900">{dish.name}</td>
                      <td className="py-3 px-4 capitalize text-stone-600">
                        {dish.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-right font-black">
                        {formatMoney(dish.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-orange-700">
                        {dish.availablePortions} pzs
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Proveedores */}
      {activeTab === 'proveedores' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <p className="text-stone-500">
              Directorio de proveedores registrados para surtido de carnes, verduras y abarrotes.
            </p>
            <button
              onClick={() => setIsSupplierModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Proveedor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-sm text-stone-900">{sup.name}</h4>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                    {sup.contact}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px]">Teléfono: {sup.phone}</p>
                <p className="text-stone-500 text-[11px]">Dirección: {sup.address}</p>
                {sup.deliveryNotes && (
                  <p className="text-[10px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {sup.deliveryNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Respaldo y Reinicio Demo */}
      {activeTab === 'respaldo' && (
        <div className="space-y-5 text-xs max-w-2xl">
          {/* Card 1: Descargar copia de seguridad */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-600" />
              Descargar Respaldo JSON Completo
            </h3>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Descarga un archivo con toda la información de recetas, menús, ventas, inventario,
              compras y cortes de caja para guardarlo o transferirlo a otro dispositivo.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Archivo JSON de Respaldo</span>
            </button>
          </div>

          {/* Card 2: Restaurar desde JSON */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-orange-600" />
              Restaurar Datos desde Texto JSON
            </h3>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Pega aquí el contenido del archivo JSON de respaldo..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-[11px]"
            />
            <button
              onClick={handleDoImport}
              disabled={!importJsonText}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Importar y Aplicar Respaldo</span>
            </button>
          </div>

          {/* Card 3: Reiniciar a Datos Demo */}
          <div className="bg-rose-50 rounded-3xl border border-rose-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-rose-950 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Restaurar Datos Iniciales Demo
            </h3>
            <p className="text-rose-800 text-[11px] leading-relaxed">
              ¿Quieres reiniciar el sistema con el menú, recetas e insumos de ejemplo originales?
              Esta acción borrará las ventas actuales y restaurará el estado limpio inicial.
            </p>
            <button
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de que deseas restaurar los datos iniciales de demostración? Se reiniciarán las ventas y cortes.'
                  )
                ) {
                  resetToDemoData();
                  alert('¡Sistema reiniciado con éxito a los datos demo!');
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Datos Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Platillo */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm border-b border-stone-200 pb-2">
              Nuevo Platillo al Catálogo
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Nombre del Platillo:</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Ej. Enchiladas Suizas"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Categoría:</label>
                <select
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value as DishCategory)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                >
                  <option value="plato_fuerte">Plato Fuerte / Guisado</option>
                  <option value="desayuno">Desayuno</option>
                  <option value="sopa_entrada">Sopa / Entrada</option>
                  <option value="guarnicion">Guarnición</option>
                  <option value="bebida">Bebida</option>
                  <option value="postre">Postre</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Precio al Público ($ MXN):</label>
                <input
                  type="number"
                  step="5"
                  min="5"
                  required
                  value={dishPrice}
                  onChange={(e) => setDishPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-center font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Descripción Breve:</label>
                <textarea
                  rows={2}
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Ingredientes clave, salsa, guarnición incluida..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Platillo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Proveedor */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm border-b border-stone-200 pb-2">
              Registrar Proveedor
            </h3>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Nombre o Razón Social:</label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="Ej. Cremería Los Altos"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Persona de Contacto:</label>
                <input
                  type="text"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  placeholder="Ej. Lic. Armando Soto"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Teléfono:</label>
                <input
                  type="text"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Dirección / Puesto:</label>
                <input
                  type="text"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  placeholder="Ej. Mercado Central nave 3"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
