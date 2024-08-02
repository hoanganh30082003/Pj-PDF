import React, { useState, useContext, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PdfViewerContext } from './PdfViewerContext';
import RenderCircles from './RenderCircles';
import HighlightLayer from './RenderAreaHighlights';
import * as pdfjsLib from 'pdfjs-dist'; // Import pdfjsLib
import RenderTextHighlight from './RenderTextHighlight';
import RenderLineText from './RenderLineText';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MyPdfViewer = () => {
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const pdfUrl = './WebviewerDemoDoc.pdf';
    const { numPages, setNumPages, isEditing, setIsEditing, setCirclesByPage, highlightsByPage, setHighlightsByPage, isHighlighting, setIsHighlighting, isLineText, setIsLineText } = useContext(PdfViewerContext);
    const [pageSizes, setPageSizes] = useState({});
    const [words, setWords] = useState({});
    console.log(words);
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
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Tắt chế độ tròn' : 'Bật chế độ tròn'}
                </button>
                <button onClick={() => setIsHighlighting(!isHighlighting)}>{isHighlighting ? 'Tắt chế độ underline' : 'Bật chế độ underline'}</button>
                <button onClick={() => setIsLineText(!isLineText)}>
                    {isLineText ? 'Tắt chế độ linetext' : 'Bật chế độ linetext'}
                </button>
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
                                            {/* <RenderLineText pageNumber={pageNumber} pageSize={pageSizes} /> */}
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


