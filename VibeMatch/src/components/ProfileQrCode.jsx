import QRCode from "react-qr-code";

export default function ProfileQRCode({ shareUrl }) {
  if (!shareUrl) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-xl font-semibold text-white">Seu QR Code</h3>

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl bg-white p-4">
          <QRCode value={shareUrl} size={180} />
        </div>

        <p className="text-center text-sm text-zinc-300 break-all">
          {shareUrl}
        </p>
      </div>
    </div>
  );
}