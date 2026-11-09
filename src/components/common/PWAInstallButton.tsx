import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, hide install prompt
  if (isInstalled) {
    return null;
  }

  // Banner variant for home screen notice
  if (variant === 'banner') {
    if (!isInstallable && !isIOS) return null;

    return (
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-amber-200" />
          <span>
            <strong>Instala Mi Cocina PWA</strong> en tu celular o computadora para uso ultra rápido.
          </span>
        </div>
        <div className="shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="bg-white text-orange-700 hover:bg-amber-50 font-bold px-3 py-1 rounded-md text-xs shadow-sm transition active:scale-95"
            >
              Instalar
            </button>
          )}
          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1 rounded-md text-xs transition active:scale-95 border border-white/40"
            >
              Ver cómo instalar en iPhone
            </button>
          )}
        </div>

        {/* iOS Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4 border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-orange-950 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  Instalar en iPhone o iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-3 bg-orange-50 p-2.5 rounded-lg border border-orange-200">
                  <Share2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <p>
                    1. En Safari, toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <PlusSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    2. Desplázate hacia abajo y selecciona <strong>«Agregar al inicio»</strong>.
                  </p>
                </div>
                <p className="text-xs text-stone-500 pt-1">
                  ¡Listo! La aplicación funcionará a pantalla completa como una app nativa en tu cocina.
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 text-white py-2.5 font-semibold hover:bg-orange-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop / Header Compact Button
  if (isInstallable) {
    return (
      <button
        onClick={install}
        title="Instalar como aplicación en este dispositivo"
        className="flex items-center gap-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar PWA</span>
        <span className="sm:hidden">App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          title="Cómo agregar al inicio en iOS"
          className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 px-2.5 py-1.5 text-xs font-medium transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Instalar en iOS</span>
          <span className="sm:hidden">iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4 border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-orange-950 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  Instalar en iPhone o iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-3 bg-orange-50 p-2.5 rounded-lg border border-orange-200">
                  <Share2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <p>
                    1. En la barra inferior de Safari, pulsa el botón <strong>Compartir</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <PlusSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    2. Selecciona la opción <strong>«Agregar a la pantalla de inicio»</strong>.
                  </p>
                </div>
                <p className="text-xs text-stone-500 pt-1">
                  ¡Listo! Podrás abrir Mi Cocina con un solo toque desde tu pantalla principal.
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 text-white py-2.5 font-semibold hover:bg-orange-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
