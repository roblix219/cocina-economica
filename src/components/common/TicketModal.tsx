import React, { useRef } from 'react';
import { Sale, BusinessConfig } from '../../types';
import { Printer, X, Check, Copy, Share2, Utensils } from 'lucide-react';

interface Props {
  sale: Sale | null;
  config: BusinessConfig;
  isOpen: boolean;
  onClose: () => void;
  formatMoney: (val: number) => string;
}

export const TicketModal: React.FC<Props> = ({
  sale,
  config,
  isOpen,
  onClose,
  formatMoney,
}) => {
  const [copied, setCopied] = React.useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    if (!sale) return;
    const itemsText = sale.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.dishName} - ${formatMoney(it.subtotal)}`
      )
      .join('\n');

    const paymentText =
      sale.paymentMethod === 'efectivo'
        ? `Pago: Efectivo (${formatMoney(sale.amountPaid || sale.total)}) | Cambio: ${formatMoney(sale.change || 0)}`
        : `Pago: Transferencia (Ref: ${sale.transferRef || 'S/N'})`;

    const text = `🍽️ *${config.name.toUpperCase()}*\n_${config.tagline}_\n` +
      `--------------------------------\n` +
      `📄 Folio: ${sale.folio}\n` +
      `📅 Fecha: ${sale.date} (${sale.shift.toUpperCase()})\n` +
      `🏷️ Modalidad: ${sale.channel === 'local' ? 'Servicio en Mesa (Local)' : 'Para Llevar'}\n` +
      `🧑‍🍳 Atendió: ${sale.userName}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `💰 *TOTAL: ${formatMoney(sale.total)}*\n` +
      `${paymentText}\n\n` +
      `${config.ticketFooter}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 my-auto">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
            <Utensils className="w-4 h-4" />
            Comprobante de Venta
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Style Box */}
        <div
          ref={ticketRef}
          className="print-ticket bg-stone-50 border border-dashed border-stone-300 p-4 rounded-xl font-mono text-xs text-stone-800 shadow-inner space-y-2.5"
        >
          {/* Header */}
          <div className="text-center space-y-0.5">
            <h2 className="text-sm font-black uppercase text-stone-900 tracking-tight">
              {config.name}
            </h2>
            <p className="text-[10px] text-stone-600 italic">{config.tagline}</p>
            {config.rfc && <p className="text-[10px] text-stone-500">RFC: {config.rfc}</p>}
            <p className="text-[10px] text-stone-500">{config.address}</p>
            <p className="text-[10px] text-stone-500">Tel: {config.phone}</p>
          </div>

          <div className="border-t border-dashed border-stone-400 my-2" />

          {/* Ticket Metadata */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="font-bold">FOLIO:</span>
              <span className="font-bold text-orange-800">{sale.folio}</span>
            </div>
            <div className="flex justify-between">
              <span>FECHA:</span>
              <span>{sale.date}</span>
            </div>
            <div className="flex justify-between">
              <span>TURNO:</span>
              <span className="capitalize">{sale.shift}</span>
            </div>
            <div className="flex justify-between">
              <span>SERVICIO:</span>
              <span className="font-bold uppercase text-stone-900">
                {sale.channel === 'local' ? 'En Comedor (Local)' : 'Para Llevar (Empaque)'}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ATENDIÓ:</span>
              <span>{sale.userName}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-stone-400 my-2" />

          {/* Items Table */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between font-bold text-stone-700 border-b border-stone-200 pb-0.5">
              <span className="w-8">CANT</span>
              <span className="flex-1 px-1">DESCRIPCIÓN</span>
              <span className="text-right">TOTAL</span>
            </div>
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-1">
                <span className="w-8 font-semibold">{item.quantity}x</span>
                <span className="flex-1 px-1 leading-tight">{item.dishName}</span>
                <span className="text-right font-semibold">{formatMoney(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-stone-400 my-2" />

          {/* Totals */}
          <div className="space-y-1 text-[11px]">
            {sale.discount > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>SUBTOTAL:</span>
                <span>{formatMoney(sale.subtotal)}</span>
              </div>
            )}
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>DESCUENTO:</span>
                <span>-{formatMoney(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-stone-900 pt-1">
              <span>TOTAL:</span>
              <span>{formatMoney(sale.total)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-stone-200/60 p-2 rounded text-[10px] space-y-0.5">
            <div className="flex justify-between">
              <span className="font-semibold uppercase">MÉTODO:</span>
              <span className="font-bold uppercase text-stone-800">{sale.paymentMethod}</span>
            </div>
            {sale.paymentMethod === 'efectivo' && sale.amountPaid && (
              <>
                <div className="flex justify-between text-stone-600">
                  <span>PAGÓ CON:</span>
                  <span>{formatMoney(sale.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold">
                  <span>SU CAMBIO:</span>
                  <span>{formatMoney(sale.change || 0)}</span>
                </div>
              </>
            )}
            {sale.paymentMethod === 'transferencia' && (
              <div className="flex justify-between text-stone-600">
                <span>REFERENCIA:</span>
                <span className="font-mono">{sale.transferRef || 'Verificada en app'}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-stone-500 italic leading-snug">
            {config.ticketFooter}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs hover:bg-emerald-100 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 rounded-xl text-stone-500 font-medium text-xs hover:bg-stone-100 transition"
        >
          Cerrar ventana
        </button>
      </div>
    </div>
  );
};
