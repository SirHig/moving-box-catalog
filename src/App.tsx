import { useState, useEffect, useMemo } from 'react';
import CameraCapture from './CameraCapture';
import BoxListItem from './BoxListItem';
import BoxDetailModal from './BoxDetailModal';
import QRScanner from './QRScanner';
import LabelGenerator from './LabelGenerator';
import type { Box } from './types';
import {
  getAllBoxes,
  addBox,
  updateBox,
  deleteBox,
  uploadImage,
  analyzeImage,
} from './services';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLabelGenerator, setShowLabelGenerator] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [currentBoxNumber, setCurrentBoxNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'fragile' | 'priority'>('all');

  useEffect(() => {
    loadBoxes();
  }, []);

  const availableRooms = useMemo(() => {
    const rooms = boxes.map((b) => b.room).filter(Boolean) as string[];
    return [...new Set(rooms)].sort();
  }, [boxes]);

  const filteredBoxes = useMemo(() => {
    let filtered = boxes;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((box) =>
        box.aiDescription.toLowerCase().includes(lowerSearch) ||
        box.customLabel?.toLowerCase().includes(lowerSearch) ||
        box.room?.toLowerCase().includes(lowerSearch) ||
        box.boxNumber.toString().includes(lowerSearch)
      );
    }
    if (filter === 'fragile') {
      filtered = filtered.filter((box) => box.isFragile);
    } else if (filter === 'priority') {
      filtered = filtered.filter((box) => box.isPriority);
    }
    return filtered;
  }, [boxes, searchTerm, filter]);

  const loadBoxes = async () => {
    try {
      setLoading(true);
      const allBoxes = await getAllBoxes();
      setBoxes(allBoxes);
      setError(null);
    } catch (err) {
      setError('Failed to load boxes. Check your Firebase configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (boxNumber: number) => {
    setCurrentBoxNumber(boxNumber);
    setShowScanner(false);
    setShowCamera(true);
  };

  const handleCapture = async (imageDataUrl: string, blob: Blob, room: string) => {
    if (!currentBoxNumber) {
      setError('No box number selected');
      return;
    }

    // Check for duplicate box number
    const existingBox = boxes.find(b => b.boxNumber === currentBoxNumber);
    if (existingBox) {
      setError(`Box #${currentBoxNumber} already exists. Please delete the old one first or use a different box number.`);
      setShowCamera(false);
      setCurrentBoxNumber(null);
      return;
    }

    try {
      setLoading(true);
      setShowCamera(false);
      setError(null);

      const compressedBlob = await compressImage(blob);

      const [imageUrl, aiDescription] = await Promise.all([
        uploadImage(compressedBlob, currentBoxNumber),
        analyzeImage(imageDataUrl),
      ]);

      // Save to Firestore
      await addBox({
        boxNumber: currentBoxNumber,
        imageUrl,
        aiDescription,
        room: room || undefined,
        isFragile: false,
        isPriority: false,
      });

      // Refresh boxes
      await loadBoxes();
      setCurrentBoxNumber(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to process box: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        // Calculate new dimensions (max 1024px on longest side)
        const maxSize = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              resolve(compressedBlob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.85 // 85% quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      
      img.src = objectUrl;
    });
  };

  const handleUpdateBox = async (id: string, updates: Partial<Box>) => {
    try {
      await updateBox(id, updates);
      await loadBoxes();
    } catch (err) {
      setError('Failed to update box');
      console.error(err);
    }
  };

  const handleDeleteBox = async (id: string) => {
    try {
      await deleteBox(id);
      await loadBoxes();
    } catch (err) {
      setError('Failed to delete box');
      console.error(err);
    }
  };

  const handleBoxClick = (box: Box) => {
    setSelectedBox(box);
  };

  const handleCloseDetail = () => {
    setSelectedBox(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Moving Box Catalog 📦</h1>
        <p>{boxes.length} box{boxes.length !== 1 ? 'es' : ''} cataloged</p>
        <button 
          onClick={() => setShowLabelGenerator(true)}
          className="generate-labels-btn"
        >
          🏷️ Generate Labels
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {showScanner && (
        <div className="modal">
          <QRScanner
            onScan={handleQRScan}
            onCancel={() => setShowScanner(false)}
          />
        </div>
      )}

      {showCamera && (
        <div className="modal">
          <CameraCapture
            onCapture={handleCapture}
            onCancel={() => {
              setShowCamera(false);
              setCurrentBoxNumber(null);
            }}
            availableRooms={availableRooms}
          />
        </div>
      )}

      {showLabelGenerator && (
        <div className="modal">
          <LabelGenerator
            onClose={() => setShowLabelGenerator(false)}
          />
        </div>
      )}

      {selectedBox && (
        <BoxDetailModal
          box={selectedBox}
          onClose={handleCloseDetail}
          onUpdate={handleUpdateBox}
          onDelete={handleDeleteBox}
        />
      )}

      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search boxes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('fragile')}
            className={`filter-btn ${filter === 'fragile' ? 'active' : ''}`}
          >
            ⚠️ Fragile
          </button>
          <button
            onClick={() => setFilter('priority')}
            className={`filter-btn ${filter === 'priority' ? 'active' : ''}`}
          >
            ⭐ Priority
          </button>
        </div>
      </div>

      <div className="box-list">
        {filteredBoxes.map((box) => (
          <BoxListItem
            key={box.id}
            box={box}
            onClick={() => handleBoxClick(box)}
          />
        ))}

        {filteredBoxes.length === 0 && !loading && (
          <div className="empty-state">
            <p>
              {searchTerm || filter !== 'all'
                ? 'No boxes match your search.'
                : 'No boxes yet. Start by adding your first box!'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowScanner(true)}
        className="fab"
        disabled={loading}
        title="Scan box label QR code"
      >
        <span>📷</span>
        <span>Catalog Box</span>
      </button>
    </div>
  );
}

export default App;
