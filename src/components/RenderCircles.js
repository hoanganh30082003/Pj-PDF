import React, { useState, useRef, useEffect, useContext } from 'react';
import { Stage, Layer, Circle, Transformer } from 'react-konva';
import { PdfViewerContext } from './PdfViewerContext';

const RenderCircles = ({ pageNumber, pageSize }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedCircleId, setSelectedCircleId] = useState(null);
    const stageRefs = useRef({});
    const transformerRefs = useRef([]);
    let transformer = useRef();
    const { isEditing, circlesByPage, setCirclesByPage } = useContext(PdfViewerContext);
    const { width, height } = pageSize;

    useEffect(() => {
        if (selectedCircleId && isEditing) {
            const pageNumber = parseInt(selectedCircleId.split('-')[0]);
            const stage = stageRefs.current[pageNumber];
            const shape = stage.findOne(`#${selectedCircleId}`);
            if (shape) {
                transformer = transformerRefs.current[pageNumber];
                transformer.nodes([shape]);
                const layer = transformer.getLayer();
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
    }, [selectedCircleId, isEditing]);
    function addCircle(pageNumber, x, y, radius = 20) {
        setCirclesByPage(prevCircles => ({
            ...prevCircles,
            [pageNumber]: Array.isArray(prevCircles[pageNumber])
                ? [...prevCircles[pageNumber], { id: String(Math.random()).slice(2), x, y, radius }]
                : [{ id: String(Math.random()).slice(2), x, y, radius }]
        }));

    }

    function handleMouseDown(pageNumber, e) {
        if (e.target === e.target.getStage() && isEditing) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            addCircle(pageNumber, pointerPosition.x, pointerPosition.y);
        } else {
            setIsDragging(true);
        }
    }
    function handleCircleClick(e) {
        const clickedCircleId = e.target.id();
        setSelectedCircleId(clickedCircleId);
    }

    return (
        <Stage
            id={`stage_${pageNumber}`}
            ref={(node) => (stageRefs.current[pageNumber] = node)}
            width={width}
            height={height}
            onMouseDown={(e) => handleMouseDown(pageNumber, e)}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: isEditing ? 10 : 0 }}
            isEditing={isEditing}
        >
            <Layer>
                {circlesByPage[pageNumber]?.map((circle, i) => (
                    <Circle
                        key={`${pageNumber}-${i}`}
                        id={`${pageNumber}-${i}`}
                        x={circle.x}
                        y={circle.y}
                        radius={circle.radius}
                        stroke="black"
                        strokeWidth={0.5}
                        draggable
                        onClick={handleCircleClick}
                        onDragStart={() => setIsDragging(true)} // Bắt đầu kéo
                        onDragEnd={() => setIsDragging(false)} // Kết thúc kéo
                    />
                ))}
            </Layer>

            {selectedCircleId && (
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
}
export default RenderCircles;