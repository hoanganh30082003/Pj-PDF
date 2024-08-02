import React, { useState, useRef, useEffect, useContext } from 'react'; // mới thêm useContext 2/8
import { Stage, Layer, Rect } from 'react-konva';
import { PdfViewerContext } from './PdfViewerContext'; // mới thêm 2/8 để xử lý chức năng nút tăt/bật gạch ngang văn bản ở homepage
const RenderStrikeThroughText = ({ pageNumber, words, pageSize }) => { 
    const [highlightsByPage, setHighlightsByPage] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [selectedHighlightId, setSelectedHighlightId] = useState(null);
    const [newHighlight, setNewHighlight] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const { width, height } = pageSize;
    const stageRefs = useRef({});
    const {isStrike, setIsStrike} = useContext(PdfViewerContext); // mới thêm 2/8 để thêm nút tăt/bật gạch ngang văn bản ở homepage

    useEffect(() => {
        const storedHighlights = localStorage.getItem(`highlights_${pageNumber}`);
        if (storedHighlights) {
            setHighlights(JSON.parse(storedHighlights));
        }
    }, [pageNumber]);

    function handleWordClick(word) {
        setHighlights((prevHighlights) => {
            if (
                prevHighlights.some(
                    (h) => h.pageNumber === pageNumber && h.text === word.text
                )
            ) {
                return prevHighlights.filter(
                    (h) => !(h.pageNumber === pageNumber && h.text === word.text)
                );
            } else {
                return [...prevHighlights, { ...word, pageNumber }];
            }
        });
    }

    function handleMouseDown(pageNumber, e) {
        if ((e.target === e.target.getStage()) && (isStrike)) { // mới thêm && (isStrike)) xử lý chức năng nút tăt/bật gạch ngang văn bản ở homepage
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            setNewHighlight({
                startX: pointerPosition.x,
                startY: pointerPosition.y,
                endX: pointerPosition.x,
                endY: pointerPosition.y,
                pageNumber,
            });
        }
    }

    function handleMouseMove(pageNumber, e) {
        if (newHighlight) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            setNewHighlight({
                ...newHighlight,
                endX: pointerPosition.x,
                endY: pointerPosition.y,
            });
        }
    }

    function handleMouseUp(pageNumber, e) {
        if (newHighlight) {
            const width = Math.abs(newHighlight.endX - newHighlight.startX);
            const height = Math.abs(newHighlight.endY - newHighlight.startY);
            if (width > 10 && height > 10) {
                const highlightedWords = words.filter((word) => {
                    const wordRect = {
                        x: word.x,
                        y: word.y,
                        width: word.width,
                        height: word.height,
                    };
                    const highlightRect = {
                        x: Math.min(newHighlight.startX, newHighlight.endX),
                        y: Math.min(newHighlight.startY, newHighlight.endY),
                        width,
                        height,
                    };
                    return intersectRect(wordRect, highlightRect);
                });

                setHighlights((prevHighlights) => {
                    const newHighlights = [
                        ...prevHighlights,
                        ...highlightedWords.map((word) => ({ ...word, pageNumber })),
                    ];
                    localStorage.setItem(`highlights_${pageNumber}`, JSON.stringify(newHighlights));
                    return newHighlights;
                });

                setHighlightsByPage((prev) => ({ ...prev, [pageNumber]: highlightedWords }));
            }
            setNewHighlight(null);
        }
    }

    function intersectRect(r1, r2) {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    return (
        <Stage
            id={`stage_${pageNumber}`}
            ref={(node) => (stageRefs.current[pageNumber] = node)}
            width={width}
            height={height}
            onMouseDown={(e) => handleMouseDown(pageNumber, e)}
            onMouseUp={(e) => handleMouseUp(pageNumber, e)}
            onMouseMove={(e) => handleMouseMove(pageNumber, e)}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
        >
            <Layer>
                {highlights.map((word, i) => (
                    <Rect
                        key={i}
                        x={word.x}
                        y={word.y - (word.height)/3 + 1} // đặt /3, gạch ngang văn bản sẽ ở giữa text
                        width={word.width}
                        height={0}
                        stroke="blue"
                        strokeWidth={0.5}
                        fill="transparent"
                        onClick={() => handleWordClick(word)}
                    />
                ))}
                {newHighlight && (
                    <Rect
                        x={Math.min(newHighlight.startX, newHighlight.endX)}
                        y={Math.min(newHighlight.startY, newHighlight.endY)}
                        width={Math.abs(newHighlight.endX - newHighlight.startX)}
                        height={Math.abs(newHighlight.endY - newHighlight.startY)}
                        stroke="red"
                        strokeWidth={1}
                        fill="rgba(255,0,0,0.5)"
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default RenderStrikeThroughText; 