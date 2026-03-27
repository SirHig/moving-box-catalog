import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Box } from './types';

interface BoxDetailModalProps {
  box: Box;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Box>) => void;
  onDelete: (id: string) => void;
}

export default function BoxDetailModal({ box, onClose, onUpdate, onDelete }: BoxDetailModalProps) {
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(box.aiDescription);
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(box.customLabel || '');
  const [editingRoom, setEditingRoom] = useState(false);
  const [roomDraft, setRoomDraft] = useState(box.room || '');

  const handleSaveDescription = () => {
    onUpdate(box.id, { aiDescription: descriptionDraft });
    setEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setDescriptionDraft(box.aiDescription);
    setEditingDescription(false);
  };

  const handleSaveLabel = () => {
    onUpdate(box.id, { customLabel: labelDraft });
    setEditingLabel(false);
  };

  const handleCancelLabel = () => {
    setLabelDraft(box.customLabel || '');
    setEditingLabel(false);
  };

  const handleSaveRoom = () => {
    onUpdate(box.id, { room: roomDraft });
    setEditingRoom(false);
  };

  const handleCancelRoom = () => {
    setRoomDraft(box.room || '');
    setEditingRoom(false);
  };

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

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete Box #${box.boxNumber}?`)) {
      onDelete(box.id);
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="box-detail-modal">
        <div className="box-detail-header">
          <div>
            <h2>Box #{box.boxNumber}</h2>
            <div className="box-badges">
              {box.isFragile && <span className="badge badge-fragile">⚠️ Fragile</span>}
              {box.isPriority && <span className="badge badge-priority">⭐ Priority</span>}
            </div>
          </div>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="box-detail-content">
          <div className="box-detail-image">
            <img src={box.imageUrl} alt={`Box ${box.boxNumber}`} />
          </div>

          <div className="box-detail-section">
            <div className="detail-field">
              <label>Custom Label:</label>
              {editingLabel ? (
                <div className="inline-edit">
                  <input
                    type="text"
                    value={labelDraft}
                    onChange={(e) => setLabelDraft(e.target.value)}
                    placeholder="e.g., Kitchen Essentials"
                    autoFocus
                  />
                  <button onClick={handleSaveLabel} className="btn-primary btn-small">Save</button>
                  <button onClick={handleCancelLabel} className="btn-secondary btn-small">Cancel</button>
                </div>
              ) : (
                <div className="field-display">
                  <span>{box.customLabel || 'None'}</span>
                  <button onClick={() => setEditingLabel(true)} className="btn-edit">✏️</button>
                </div>
              )}
            </div>

            <div className="detail-field">
              <label>Room:</label>
              {editingRoom ? (
                <div className="inline-edit">
                  <input
                    type="text"
                    value={roomDraft}
                    onChange={(e) => setRoomDraft(e.target.value)}
                    placeholder="e.g., Living Room"
                    autoFocus
                  />
                  <button onClick={handleSaveRoom} className="btn-primary btn-small">Save</button>
                  <button onClick={handleCancelRoom} className="btn-secondary btn-small">Cancel</button>
                </div>
              ) : (
                <div className="field-display">
                  <span>{box.room || 'None'}</span>
                  <button onClick={() => setEditingRoom(true)} className="btn-edit">✏️</button>
                </div>
              )}
            </div>
          </div>

          <div className="box-detail-section">
            <div className="description-header">
              <strong>Contents:</strong>
              {!editingDescription && (
                <button onClick={() => setEditingDescription(true)} className="btn-edit">✏️</button>
              )}
            </div>
            {editingDescription ? (
              <div className="description-edit">
                <textarea
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  rows={6}
                  className="description-textarea"
                />
                <div className="description-edit-actions">
                  <button onClick={handleSaveDescription} className="btn-primary btn-small">Save</button>
                  <button onClick={handleCancelDescription} className="btn-secondary btn-small">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="box-description-full">{box.aiDescription}</p>
            )}
          </div>

          <div className="box-detail-section">
            <label>QR Code:</label>
            <div className="box-qr" id={`qr-${box.id}`}>
              <QRCodeSVG
                value={JSON.stringify({
                  id: box.id,
                  boxNumber: box.boxNumber,
                  description: box.aiDescription,
                })}
                size={150}
                level="M"
              />
            </div>
          </div>

          <div className="box-detail-actions">
            <button onClick={handleToggleFragile} className={`btn-action ${box.isFragile ? 'active' : ''}`}>
              {box.isFragile ? '✓ Fragile' : 'Mark as Fragile'} ⚠️
            </button>
            <button onClick={handleTogglePriority} className={`btn-action ${box.isPriority ? 'active' : ''}`}>
              {box.isPriority ? '✓ Priority' : 'Mark as Priority'} ⭐
            </button>
            <button onClick={handlePrintQR} className="btn-action">
              Print QR Code 🖨️
            </button>
            <button onClick={handleDelete} className="btn-action btn-danger">
              Delete Box 🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
