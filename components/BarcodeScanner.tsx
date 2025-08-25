import React, { useEffect } from 'react';

declare const Html5QrcodeScanner: any;

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError: (errorMessage: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onScanError }) => {
  const readerElementId = "barcode-reader";

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [] // Use all supported scan types
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      readerElementId,
      config,
      false // verbose
    );

    const handleSuccess = (decodedText: string, decodedResult: any) => {
        onScanSuccess(decodedText);
    };
    
    html5QrcodeScanner.render(handleSuccess, onScanError);

    return () => {
      // Cleanup function to stop the scanner when the component unmounts
      html5QrcodeScanner.clear().catch((error: any) => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess, onScanError]);

  return <div id={readerElementId} className="w-full rounded-lg overflow-hidden"></div>;
};

export default BarcodeScanner;