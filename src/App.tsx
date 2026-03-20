import { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import BoxCard from './BoxCard';
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
  const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLabelGenerator, setShowLabelGenerator] = useState(false);
  const [currentBoxNumber, setCurrentBoxNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'fragile' | 'priority'>('all');

  useEffect(() => {
    loadBoxes();
  }, []);

  useEffect(() => {
    applyFilters();
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

  const applyFilters = () => {
    let filtered = [...boxes];

    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((box) =>
        box.aiDescription.toLowerCase().includes(lowerSearch) ||
        box.customLabel?.toLowerCase().includes(lowerSearch) ||
        box.room?.toLowerCase().includes(lowerSearch) ||
        box.boxNumber.toString().includes(lowerSearch)
      );
    }

    // Apply filter
    if (filter === 'fragile') {
      filtered = filtered.filter((box) => box.isFragile);
    } else if (filter === 'priority') {
      filtered = filtered.filter((box) => box.isPriority);
    }

    setFilteredBoxes(filtered);
  };

  const handleQRScan = (boxNumber: number) => {
    setCurrentBoxNumber(boxNumber);
    setShowScanner(false);
    setShowCamera(true);
  };

  const handleCapture = async (imageDataUrl: string, blob: Blob) => {
    if (!currentBoxNumber) {
      setError('No box number selected');
      return;
    }

    try {
      setLoading(true);
      setShowCamera(false);
      setError(null);

      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(blob, currentBoxNumber);

      // Analyze image with OpenAI
      const aiDescription = await analyzeImage(imageDataUrl);

      // Save to Firestore
      await addBox({
        boxNumber: currentBoxNumber,
        imageUrl,
        aiDescription,
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
    if (!confirm('Are you sure you want to delete this box?')) return;
    
    try {
      await deleteBox(id);
      await loadBoxes();
    } catch (err) {
      setError('Failed to delete box');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Moving Box Catalog</h1>
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

      <div className="box-grid">
        {filteredBoxes.map((box) => (
          <BoxCard
            key={box.id}
            box={box}
            onUpdate={handleUpdateBox}
            onDelete={handleDeleteBox}
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
        📷 Catalog Box
      </button>
    </div>
  );
}

export default App;
