import { QRCodeSVG } from 'qrcode.react';
import type { Box } from './types';

interface BoxCardProps {
  box: Box;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Box>) => void;
}

export default function BoxCard({ box, onDelete, onUpdate }: BoxCardProps) {
  const handleToggleFragile = () => {
    onUpdate(box.id, { isFragile: !box.isFragile });
  };

  const handleTogglePriority = () => {
    onUpdate(box.id, { isPriority: !box.isPriority });
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Box ${box.boxNumber} QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            h1 { margin: 20px 0; }
            .qr-container { padding: 20px; border: 2px solid #000; }
          </style>
        </head>
        <body>
          <h1>Box #${box.boxNumber}</h1>
          <div class="qr-container">
            ${document.getElementById(`qr-${box.id}`)?.innerHTML || ''}
          </div>
          <p>${box.customLabel || 'Moving Box'}</p>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="box-card">
      <div className="box-header">
        <h3>Box #{box.boxNumber}</h3>
        <div className="box-badges">
          {box.isFragile && <span className="badge badge-fragile">⚠️ Fragile</span>}
          {box.isPriority && <span className="badge badge-priority">⭐ Priority</span>}
        </div>
      </div>

      <img src={box.imageUrl} alt={`Box ${box.boxNumber}`} className="box-image" />

      {box.customLabel && <p className="box-label">{box.customLabel}</p>}
      {box.room && <p className="box-room">📍 {box.room}</p>}

      <div className="box-description">
        <strong>Contents:</strong>
        <p>{box.aiDescription}</p>
      </div>

      <div className="box-qr" id={`qr-${box.id}`}>
        <QRCodeSVG
          value={JSON.stringify({
            id: box.id,
            boxNumber: box.boxNumber,
            description: box.aiDescription,
          })}
          size={100}
          level="M"
        />
      </div>

      <div className="box-actions">
        <button onClick={handleToggleFragile} className={`btn-icon ${box.isFragile ? 'active' : ''}`}>
          ⚠️
        </button>
        <button onClick={handleTogglePriority} className={`btn-icon ${box.isPriority ? 'active' : ''}`}>
          ⭐
        </button>
        <button onClick={handlePrintQR} className="btn-icon">
          🖨️
        </button>
        <button onClick={() => onDelete(box.id)} className="btn-icon btn-delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
