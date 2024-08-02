import React, { useState, useContext, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Transformer } from 'react-konva';
import { PdfViewerContext } from './PdfViewerContext';

const RenderLineText = ({ pageNumber, pageSize }) => {
  const { linesByPage, setLinesByPage, isLineText } = useContext(PdfViewerContext);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const stageRefs = useRef({});
  const transformerRefs = useRef([]);

  useEffect(() => {
    if (selectedLineId && isLineText) {
      const pageNumber = parseInt(selectedLineId.split('-')[0]);
      const stage = stageRefs.current[pageNumber];
      const shape = stage.findOne(`#${selectedLineId}`);
      if (shape) {
        const transformer = transformerRefs.current[pageNumber];
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
  }, [selectedLineId, isLineText]);

  const handleMouseDown = (e) => {
    if (isLineText && e.target === e.target.getStage()) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      addLine(pageNumber, [pointerPosition.x, pointerPosition.y, pointerPosition.x + 100, pointerPosition.y]);
    }
  };

  const addLine = (pageNumber, points) => {
    setLinesByPage(prevLines => ({
      ...prevLines,
      [pageNumber]: Array.isArray(prevLines[pageNumber])
        ? [...prevLines[pageNumber], { id: String(Math.random()).slice(2), points }]
        : [{ id: String(Math.random()).slice(2), points }]
    }));
  };

  const handleLineClick = (e) => {
    setSelectedLineId(e.target.id());
  };

  return (
    <Stage
      ref={(node) => (stageRefs.current[pageNumber] = node)}
      width={pageSize.width}
      height={pageSize.height}
      onMouseDown={handleMouseDown}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
    >
      <Layer>
        {linesByPage[pageNumber]?.map((line, i) => (
          <Line
            key={`${pageNumber}-${i}`}
            id={`${pageNumber}-${i}`}
            points={line.points}
            stroke="black"
            strokeWidth={2}
            draggable
            onClick={handleLineClick}
          />
        ))}
      </Layer>
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
    </Stage>
  );
};

export default RenderLineText;
