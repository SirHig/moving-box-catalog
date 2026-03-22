import type { Box } from './types';

interface BoxListItemProps {
  box: Box;
  onClick: () => void;
}

export default function BoxListItem({ box, onClick }: BoxListItemProps) {
  // Truncate description to first 100 characters
  const getSummary = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="box-list-item" onClick={onClick}>
      <div className="box-list-header">
        <h3>Box #{box.boxNumber}</h3>
        <div className="box-list-badges">
          {box.isFragile && <span className="badge badge-fragile">⚠️</span>}
          {box.isPriority && <span className="badge badge-priority">⭐</span>}
        </div>
      </div>
      
      {(box.customLabel || box.room) && (
        <div className="box-list-meta">
          {box.customLabel && <span className="box-meta-label">{box.customLabel}</span>}
          {box.room && <span className="box-meta-room">📍 {box.room}</span>}
        </div>
      )}
      
      <p className="box-list-description">{getSummary(box.aiDescription)}</p>
      
      <div className="box-list-footer">
        <span className="box-list-action">Tap for details →</span>
      </div>
    </div>
  );
}
