import { useState, useRef } from 'react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string, blob: Blob) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCapturedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!capturedImage || !capturedFile) return;
    onCapture(capturedImage, capturedFile);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="camera-capture">
      <div className="camera-header">
        <h2>Take Photo of Box Contents</h2>
        <button onClick={onCancel} className="btn-close">✕</button>
      </div>

      {!capturedImage ? (
        <div className="camera-input">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-capture"
          >
            📷 Open Camera
          </button>
          <p className="hint">Snap a photo of what's inside the box</p>
        </div>
      ) : (
        <div className="camera-preview">
          <img src={capturedImage} alt="Captured box contents" />
          <div className="camera-actions">
            <button onClick={handleRetake} className="btn-secondary">
              Retake
            </button>
            <button onClick={handleConfirm} className="btn-primary">
              Use This Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
