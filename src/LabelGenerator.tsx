import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface LabelGeneratorProps {
  onClose: () => void;
}

type LabelTemplate = {
  name: string;
  description: string;
  labelsPerPage: number;
  columns: number;
  rows: number;
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginLeft: number;
  labelWidth: number;
  labelHeight: number;
  horizontalGap: number;
  verticalGap: number;
};

const LABEL_TEMPLATES: Record<string, LabelTemplate> = {
  avery5160: {
    name: 'Avery 5160',
    description: '30 labels per sheet (1" x 2-5/8")',
    labelsPerPage: 30,
    columns: 3,
    rows: 10,
    pageWidth: 215.9,
    pageHeight: 279.4,
    marginTop: 12.7,
    marginLeft: 6.35,
    labelWidth: 66.675,
    labelHeight: 25.4,
    horizontalGap: 3.175,
    verticalGap: 0,
  },
  avery5161: {
    name: 'Avery 5161',
    description: '20 labels per sheet (1" x 4")',
    labelsPerPage: 20,
    columns: 2,
    rows: 10,
    pageWidth: 215.9,
    pageHeight: 279.4,
    marginTop: 12.7,
    marginLeft: 4.6,
    labelWidth: 101.6,
    labelHeight: 25.4,
    horizontalGap: 3.175,
    verticalGap: 0,
  },
  avery5163: {
    name: 'Avery 5163',
    description: '10 labels per sheet (2" x 4")',
    labelsPerPage: 10,
    columns: 2,
    rows: 5,
    pageWidth: 215.9,
    pageHeight: 279.4,
    marginTop: 12.7,
    marginLeft: 4.6,
    labelWidth: 101.6,
    labelHeight: 50.8,
    horizontalGap: 3.175,
    verticalGap: 0,
  },
};

export default function LabelGenerator({ onClose }: LabelGeneratorProps) {
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(30);
  const [template, setTemplate] = useState<string>('avery5163');
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const tpl = LABEL_TEMPLATES[template];
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });

      let currentLabel = startNumber;
      let labelIndex = 0;

      while (currentLabel <= endNumber) {
        if (labelIndex > 0 && labelIndex % tpl.labelsPerPage === 0) {
          pdf.addPage();
          labelIndex = 0;
        }

        const row = Math.floor(labelIndex / tpl.columns);
        const col = labelIndex % tpl.columns;

        const x = tpl.marginLeft + (col * (tpl.labelWidth + tpl.horizontalGap));
        const y = tpl.marginTop + (row * (tpl.labelHeight + tpl.verticalGap));

        // Generate QR code data
        const qrData = JSON.stringify({
          boxNumber: currentLabel,
          id: `box-${currentLabel}`,
        });

        // Generate QR code as data URL
        const qrDataURL = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: 'M',
        });

        // Calculate QR code size and position
        const qrDisplaySize = Math.min(tpl.labelHeight - 12, tpl.labelWidth - 10);
        const qrX = x + (tpl.labelWidth - qrDisplaySize) / 2;
        const qrY = y + 2;

        // Draw border (optional - comment out if you don't want borders)
        // pdf.setDrawColor(200);
        // pdf.rect(x, y, tpl.labelWidth, tpl.labelHeight);

        // Add QR code image
        pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrDisplaySize, qrDisplaySize);

        // Add box number text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Box #${currentLabel}`, x + tpl.labelWidth / 2, qrY + qrDisplaySize + 4, {
          align: 'center',
        });

        currentLabel++;
        labelIndex++;
      }

      // Save PDF
      pdf.save(`box-labels-${startNumber}-to-${endNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generatePreview = () => {
    const labels = [];
    for (let i = startNumber; i <= Math.min(startNumber + 5, endNumber); i++) {
      labels.push(i);
    }

    return (
      <div className="label-preview">
        <h3>Preview (first 6 labels)</h3>
        <div className="preview-grid">
          {labels.map((num) => (
            <div key={num} className="preview-label">
              <QRCodeSVG
                value={JSON.stringify({ boxNumber: num, id: `box-${num}` })}
                size={80}
                level="M"
              />
              <p>Box #{num}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="label-generator">
      <div className="generator-header">
        <h2>Generate Label Sheet</h2>
        <button onClick={onClose} className="btn-close">✕</button>
      </div>

      <div className="generator-content">
        <div className="generator-form">
          <div className="form-group">
            <label>Label Template:</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="template-select"
            >
              {Object.entries(LABEL_TEMPLATES).map(([key, tpl]) => (
                <option key={key} value={key}>
                  {tpl.name} - {tpl.description}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Number:</label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                className="number-input"
              />
            </div>

            <div className="form-group">
              <label>End Number:</label>
              <input
                type="number"
                min={startNumber}
                value={endNumber}
                onChange={(e) => setEndNumber(parseInt(e.target.value) || startNumber)}
                className="number-input"
              />
            </div>
          </div>

          <div className="form-info">
            <p>
              Total labels: <strong>{endNumber - startNumber + 1}</strong>
            </p>
            <p>
              Sheets needed: <strong>{Math.ceil((endNumber - startNumber + 1) / LABEL_TEMPLATES[template].labelsPerPage)}</strong>
            </p>
          </div>
        </div>

        {generatePreview()}

        <div className="generator-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={generatePDF}
            disabled={generating || startNumber > endNumber}
            className="btn-primary"
          >
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
