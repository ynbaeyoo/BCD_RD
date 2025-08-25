
import React, { useState, useEffect, useCallback } from 'react';
import { BarcodeItem } from './types';
import BarcodeScanner from './components/BarcodeScanner';
import BarcodeListItem from './components/BarcodeListItem';

const App: React.FC = () => {
  const [barcodes, setBarcodes] = useState<BarcodeItem[]>([]);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedBarcodes = localStorage.getItem('barcodes');
      if (storedBarcodes) {
        setBarcodes(JSON.parse(storedBarcodes));
      }
    } catch (e) {
      console.error("Failed to load barcodes from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('barcodes', JSON.stringify(barcodes));
    } catch (e) {
      console.error("Failed to save barcodes to localStorage", e);
    }
  }, [barcodes]);

  const addBarcode = useCallback((data: string) => {
    if (!data) return;

    if (barcodes.some(item => item.data === data)) {
      setError(`Barcode ${data} is already in the list.`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setError(null);
    const newItem: BarcodeItem = {
      id: Date.now(),
      data,
      timestamp: new Date().toISOString(),
      memo: '',
      checked: false,
    };
    setBarcodes(prev => [newItem, ...prev]);
    setHighlightedId(newItem.id);
    setTimeout(() => setHighlightedId(null), 1500);

  }, [barcodes]);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      addBarcode(manualInput.trim());
      setManualInput('');
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setShowScanner(false);
    addBarcode(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    console.error(`Barcode scan error: ${errorMessage}`);
    setError("Failed to scan barcode. Please try again.");
    setTimeout(() => setError(null), 3000);
  };

  const updateMemo = (id: number, memo: string) => {
    setBarcodes(prev =>
      prev.map(item => (item.id === id ? { ...item, memo } : item))
    );
  };

  const toggleCheck = (id: number) => {
    setBarcodes(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const deleteBarcode = (id: number) => {
    setBarcodes(prev => prev.filter(item => item.id !== id));
  };

  const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">Barcode Reader</h1>
          <div className="text-lg font-semibold bg-indigo-500 text-white rounded-full px-4 py-1">
            Total: {barcodes.length}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-32">
        <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-md">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
          >
            <CameraIcon />
            Scan New Barcode
          </button>
          
          <form onSubmit={handleManualAdd} className="mt-4">
            <label htmlFor="manual-input" className="block text-sm font-medium text-gray-400 mb-1">
              Or Enter Barcode Manually
            </label>
            <div className="flex gap-2">
              <input
                id="manual-input"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter barcode data"
                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                {error}
            </div>
        )}

        <div className="space-y-3">
          {barcodes.length > 0 ? (
            barcodes.map(item => (
              <BarcodeListItem
                key={item.id}
                item={item}
                isHighlighted={item.id === highlightedId}
                onUpdateMemo={updateMemo}
                onToggleCheck={toggleCheck}
                onDelete={deleteBarcode}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">No barcodes scanned yet.</p>
              <p>Click "Scan New Barcode" to get started!</p>
            </div>
          )}
        </div>
      </main>

      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg shadow-2xl">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-center text-white">Point Camera at Barcode</h2>
            </div>
            <div className="p-4">
                <BarcodeScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => setShowScanner(false)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
