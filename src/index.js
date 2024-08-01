import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MyPdfViewer from './components/MyPdfViewer';
import { PdfViewerProvider } from './components/PdfViewerContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PdfViewerProvider>
      <MyPdfViewer />
      {/* <App /> */}
    </PdfViewerProvider>
  </React.StrictMode>
);

