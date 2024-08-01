import React, { useState, useRef, useEffect, useContext } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { PdfViewerContext } from "./PdfViewerContext";

const HighlightLayer = ({ pageNumber, pageSize }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedHighlightId, setSelectedHighlightId] = useState(null);
    const [newHighlight, setNewHighlight] = useState(null);
    const stageRefs = useRef({});
    const transformerRefs = useRef([]);
    const transformer = useRef();
    const { isHighlighting, highlightsByPage, setHighlightsByPage } = useContext(
        PdfViewerContext
    );
    const { width, height } = pageSize;

    useEffect(() => {
        if (selectedHighlightId && isHighlighting) {
            const pageNumber = parseInt(selectedHighlightId.split('-')[0]);
            const stage = stageRefs.current[pageNumber];
            const shape = stage.findOne(`#${selectedHighlightId}`);
            if (shape) {
                transformerRefs.current[pageNumber].nodes([shape]); // Sử dụng trực tiếp
                const layer = transformerRefs.current[pageNumber].getLayer(); // Sử dụng trực tiếp
                if (layer) {
                    layer.moveToTop();
                    layer.batchDraw();
                }
            }
        } else {
            Object.values(transformerRefs.current).forEach(transformer => {
                if (transformer) {
                    transformer.nodes([]);
                }
            });
        }
    }, [selectedHighlightId, isHighlighting]);

    function addHighlight(pageNumber, x, y, width = 100, height = 50) {
        setHighlightsByPage((prevHighlights) => ({
            ...prevHighlights,
            [pageNumber]: Array.isArray(prevHighlights[pageNumber])
                ? [
                    ...prevHighlights[pageNumber],
                    { id: String(Math.random()).slice(2), x, y, width, height },
                ]
                : [{ id: String(Math.random()).slice(2), x, y, width, height }],
        }));
    }

    function handleMouseDown(pageNumber, e) {
        if (e.target === e.target.getStage() && isHighlighting) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            setNewHighlight({
                x: pointerPosition.x,
                y: pointerPosition.y,
                width: 0,
                height: 0,
            });
        } else {
            setIsDragging(true);
        }
    }

    function handleMouseMove(pageNumber, e) {
        if (newHighlight) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            setNewHighlight({
                ...newHighlight,
                width: pointerPosition.x - newHighlight.x,
                height: pointerPosition.y - newHighlight.y,
            });
        }
    }

    function handleMouseUp(pageNumber, e) {
        if (newHighlight) {
            if (Math.abs(newHighlight.width) > 10 && Math.abs(newHighlight.height) > 10) { // Điều kiện tối thiểu kích thước highlight
                addHighlight(pageNumber, newHighlight.x, newHighlight.y, newHighlight.width, newHighlight.height);
            }
            setNewHighlight(null);
        } else {
            setIsDragging(false);
        }
    }

    function handleHighlightClick(e) {
        const clickedHighlightId = e.target.id();
        setSelectedHighlightId(clickedHighlightId);
    }

    return (
        <Stage
            id={`stage_${pageNumber}`}
            ref={(node) => (stageRefs.current[pageNumber] = node)}
            width={width}
            height={height}
            onMouseDown={(e) => handleMouseDown(pageNumber, e)}
            onMouseMove={(e) => handleMouseMove(pageNumber, e)}
            onMouseUp={(e) => handleMouseUp(pageNumber, e)}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: isHighlighting ? 10 : 0 }}
            isHighlighting={isHighlighting}
        >
            <Layer>
                {highlightsByPage[pageNumber]?.map((highlight, i) => (
                    <Rect
                        key={`${pageNumber}-${i}`}
                        id={`${pageNumber}-${i}`}
                        x={highlight.x}
                        y={highlight.y}
                        width={highlight.width}
                        height={highlight.height}
                        stroke="black"
                        strokeWidth={0.5}
                        fill="yellow"
                        opacity={0.4}
                        draggable={isHighlighting}
                        onClick={handleHighlightClick}
                        onDragStart={() => setIsDragging(true)} // Bắt đầu kéo
                        onDragEnd={() => setIsDragging(false)} // Kết thúc kéo
                    />
                ))}
            </Layer>

            {selectedHighlightId && (
                <Layer>
                    <Transformer
                        ref={(node) => (transformerRefs.current[pageNumber] = node)}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                </Layer>
            )}

        </Stage>
    );
};

export default HighlightLayer;
