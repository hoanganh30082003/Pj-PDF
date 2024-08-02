import React, { useState, useContext } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PdfViewerContext } from './PdfViewerContext';
import RenderCircles from './RenderCircles';
import HighlightLayer from './RenderAreaHighlights';
import * as pdfjsLib from 'pdfjs-dist'; // Import pdfjsLib
import RenderTextHighlight from './RenderTextHighlight';
import RenderUnderlineTexts from './RenderUnderlineTexts';
import RenderStrikeTexts from './RenderStrikeTexts';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MyPdfViewer = () => {
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const pdfUrl = './WebviewerDemoDoc.pdf';
    const { numPages,
        setNumPages,
        isCircle,
        setIsCircle,
        setCirclesByPage,
        isHighlightArea,
        setIsHighlightArea,
        isUnderlineText,
        setIsUnderlineText,
        isHighlight,
        setIsHighlight,
        isStrikeOut,
        setIsStrikeOut } = useContext(PdfViewerContext);
    const [pageSizes, setPageSizes] = useState({});
    const [words, setWords] = useState({});
    const handleRenderSuccess = async (page) => {
        setPageSizes({ width: page.originalWidth, height: page.originalHeight });
        const words = await getWords(await page);
        setWords(prevWordsByPage => ({
            ...prevWordsByPage,
            [page.pageNumber]: words,
        }));

    };
    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf.numPages);
        const initialCirclesByPage = {};
        for (let i = 1; i <= numPages; i++) {
            initialCirclesByPage[i] = [];
        }
        setCirclesByPage(initialCirclesByPage);
        setPdfLoaded(true);
    }
    const getWords = async (page) => {
        const viewport = page.getViewport({ scale: 1 });
        const textContent = await page.getTextContent();

        const words = textContent.items.map((item) => {
            const transform = pdfjsLib.Util.transform(
                viewport.transform,
                item.transform
            );

            return {
                text: item.str,
                x: transform[4],
                y: transform[5],
                width: item.width * viewport.scale,
                height: item.height * viewport.scale,
            };
        });

        return words;
    };
    return (
        <div>
            <div style={{ backgroundColor: 'red', marginBottom: '10px' }}>
                <button onClick={() => setIsCircle(!isCircle)}>
                    {isCircle ? 'Tắt chế độ tròn' : 'Bật chế độ tròn'}
                </button>
                <button onClick={() => setIsHighlightArea(!isHighlightArea)}>{isHighlightArea ? 'Tắt chế độ highlight area' : 'Bật chế độ highlight area'}</button>
                <button onClick={() => setIsHighlight(!isHighlight)}>{isHighlight ? 'Tắt chế độ highlight text' : 'Bật chế độ highlight text'}</button>
                <button onClick={() => setIsUnderlineText(!isUnderlineText)}>{isUnderlineText ? 'Tắt chế độ underline text' : 'Bật chế độ underline text'}</button>
                <button onClick={() => setIsStrikeOut(!isStrikeOut)}>{isStrikeOut ? 'Tắt chế độ strikeout text' : 'Bật chế độ strikeout text'}</button>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    position: 'relative',
                }}
            >
                <Document
                    file={pdfUrl}
                    onLoadSuccess={pdf => { onDocumentLoadSuccess(pdf) }}
                >
                    {numPages ? (
                        Array.from(new Array(numPages), (el, index) => {
                            const pageNumber = index + 1;
                            return (
                                <div key={`page_${pageNumber}`} style={{ position: 'relative' }}>
                                    <Page
                                        key={`page_${pageNumber}`}
                                        pageNumber={pageNumber}
                                        onRenderSuccess={(page) => { handleRenderSuccess(page) }}
                                    />
                                    {pdfLoaded && pageSizes && (
                                        <>
                                            <RenderCircles pageNumber={pageNumber} pageSize={pageSizes} />
                                            <HighlightLayer pageNumber={pageNumber} pageSize={pageSizes} />
                                            <RenderTextHighlight pageNumber={pageNumber} words={words[pageNumber]} pageSize={pageSizes} />
                                            <RenderUnderlineTexts pageNumber={pageNumber} pageSize={pageSizes} words={words[pageNumber]} />
                                            <RenderStrikeTexts pageNumber={pageNumber} pageSize={pageSizes} words={words[pageNumber]} />
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ) : null}
                </Document>

            </div>

        </div>
    );
};

export default MyPdfViewer;


