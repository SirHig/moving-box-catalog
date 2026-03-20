import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (boxNumber: number) => void;
  onCancel: () => void;
}

export default function QRScanner({ onScan, onCancel }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualBoxNumber, setManualBoxNumber] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-reader';

  useEffect(() => {
    if (!manualEntry) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [manualEntry]);

  const startScanner = async () => {
    try {
      setError(null);

      const scanner = new Html5Qrcode(scannerDivId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Parse the QR code data
          try {
            const data = JSON.parse(decodedText);
            if (data.boxNumber && typeof data.boxNumber === 'number') {
              stopScanner();
              onScan(data.boxNumber);
            } else {
              setError('Invalid QR code format');
            }
          } catch {
            // If not JSON, try parsing as plain number
            const num = parseInt(decodedText, 10);
            if (!isNaN(num)) {
              stopScanner();
              onScan(num);
            } else {
              setError('QR code does not contain a valid box number');
            }
          }
        },
        () => {
          // Error callback - ignore most errors (camera adjusting, etc)
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start camera';
      setError(`Camera error: ${errorMsg}`);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleManualSubmit = () => {
    const num = parseInt(manualBoxNumber, 10);
    if (!isNaN(num) && num > 0) {
      onScan(num);
    } else {
      setError('Please enter a valid box number');
    }
  };

  const handleCancel = async () => {
    await stopScanner();
    onCancel();
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h2>Scan Box Label</h2>
        <button onClick={handleCancel} className="btn-close">✕</button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!manualEntry ? (
        <div className="scanner-content">
          <div id={scannerDivId} className="qr-reader"></div>
          
          <div className="scanner-instructions">
            <p>Point your camera at the QR code on the box label</p>
          </div>

          <button
            onClick={() => setManualEntry(true)}
            className="btn-secondary"
          >
            Enter Box Number Manually
          </button>
        </div>
      ) : (
        <div className="manual-entry">
          <p>Enter the box number from your label:</p>
          <input
            type="number"
            min="1"
            value={manualBoxNumber}
            onChange={(e) => setManualBoxNumber(e.target.value)}
            placeholder="Box number (e.g., 1, 2, 3...)"
            className="box-number-input"
            autoFocus
          />
          <div className="manual-entry-actions">
            <button onClick={() => setManualEntry(false)} className="btn-secondary">
              Back to Scanner
            </button>
            <button onClick={handleManualSubmit} className="btn-primary">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
