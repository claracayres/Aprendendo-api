import { useState } from "react";
import QRCodeModule from "react-qr-code";
import { QrCode, X } from "lucide-react";

const QRCode = QRCodeModule.default || QRCodeModule;

export default function ProfileQrCode({ shareUrl, username = "clarinha" }) {
  const [open, setOpen] = useState(false);

  if (!shareUrl) return null;

  const shortLink = `vibematch.com/${username}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full h-[130px] items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-green-400/30 hover:bg-white/[0.07]"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            Perfil público
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">Abrir QR Code</h3>
          <p className="mt-2 text-sm text-green-400/80">{shortLink}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70">
          <QrCode size={20} />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] rounded-[34px] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-[32px] border border-white/10 bg-[#101216] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <p className="text-[11px] uppercase tracking-[0.22em] text-green-300/70">
              Perfil público
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">Seu QR Code</h3>

            <p className="mt-2 break-all text-sm text-green-400/80">
              {shortLink}
            </p>

            <div className="mt-6 flex justify-center rounded-[28px] border border-white/10 bg-black/35 p-6">
              <QRCode
                value={shareUrl}
                size={180}
                bgColor="transparent"
                fgColor="#ffffff"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}