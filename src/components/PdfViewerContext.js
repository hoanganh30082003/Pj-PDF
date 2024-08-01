import React, { createContext, useState } from 'react';

const PdfViewerContext = createContext();
const PdfViewerProvider = ({ children }) => {
    const [numPages, setNumPages] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [circlesByPage, setCirclesByPage] = useState({});
    const [highlightsByPage, setHighlightsByPage] = useState({});
    const [isHighlighting, setIsHighlighting] = useState(false);
    return (
        <PdfViewerContext.Provider value={{ numPages, setNumPages, isEditing, setIsEditing, circlesByPage, setCirclesByPage,highlightsByPage, setHighlightsByPage, isHighlighting, setIsHighlighting }}>
            {children}
        </PdfViewerContext.Provider>
    );
};
export { PdfViewerContext, PdfViewerProvider };