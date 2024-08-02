import React, { createContext, useState } from 'react';

const PdfViewerContext = createContext();
const PdfViewerProvider = ({ children }) => {
    const [numPages, setNumPages] = useState(0);
    const [isCircle, setIsCircle] = useState(false);
    const [circlesByPage, setCirclesByPage] = useState({});
    const [highlightsByPage, setHighlightsByPage] = useState({});
    const [isHighlightArea, setIsHighlightArea] = useState(false);
    const [isUnderlineText, setIsUnderlineText] = useState(false);
    const [isHighlight, setIsHighlight] = useState(false);
    const [isStrikeOut, setIsStrikeOut] = useState(false);
    return (
        <PdfViewerContext.Provider
            value={{
                numPages,
                setNumPages,
                isCircle,
                setIsCircle,
                circlesByPage,
                setCirclesByPage,
                highlightsByPage,
                setHighlightsByPage,
                isHighlightArea,
                setIsHighlightArea,
                isUnderlineText,
                setIsUnderlineText,
                isHighlight,
                setIsHighlight,
                isStrikeOut,
                setIsStrikeOut
            }}
        >
        {children}
        </PdfViewerContext.Provider>
    );
};
export { PdfViewerContext, PdfViewerProvider };