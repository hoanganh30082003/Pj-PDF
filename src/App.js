import React, { useState, useEffect, useRef, useContext } from 'react';
import { testHighlights as _testHighlights } from './test-highlights';
import { Spinner } from './Spinner';
import { Sidebar } from './Sidebar';
import './style.css';
import { PdfLoader, PdfHighlighter, Tip, Popup, AreaHighlight } from 'react-pdf-highlighter';
import RenderCircles from './components/RenderCircles';
import { PdfViewerContext } from './components/PdfViewerContext';
import { Page } from 'react-pdf';

const testHighlights = _testHighlights;
const getNextId = () => String(Math.random()).slice(2);
const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);
const PRIMARY_PDF_URL = './WebviewerDemoDoc.pdf';
const SECONDARY_PDF_URL = "https://pdfobject.com/pdf/sample.pdf";
const searchParams = new URLSearchParams(document.location.search);
const initialUrl = searchParams.get('url') || PRIMARY_PDF_URL;

const resetHash = () => {
  document.location.hash = '';
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const App = () => {
  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState([]);
  const scrollViewerRef = useRef(null);
  const { isEditing, setIsEditing } = useContext(PdfViewerContext);
  useEffect(() => {
    setHighlights([
      {
        "content": {
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAqCAYAAAAaoXEBAAAAAXNSR0IArs4c6QAAAOFJREFUeF7t0oENACAMwzD4/+gicUbkfbDUd9uOUyBS4AIdWdIbvwDQIKQKAJ2a0zNAM5AqAHRqTs8AzUCqANCpOT0DNAOpAkCn5vQM0AykCgCdmtMzQDOQKgB0ak7PAM1AqgDQqTk9AzQDqQJAp+b0DNAMpAoAnZrTM0AzkCoAdGpOzwDNQKoA0Kk5PQM0A6kCQKfm9AzQDKQKAJ2a0zNAM5AqAHRqTs8AzUCqANCpOT0DNAOpAkCn5vQM0AykCgCdmtMzQDOQKgB0ak7PAM1AqgDQqTk9AzQDqQJAp+b0zAM0qaeDAiuzKwAAAABJRU5ErkJggg=="
        },
        "position": {
          "boundingRect": {
            "x1": 26.291656494140625,
            "y1": 7,
            "x2": 206.29165649414062,
            "y2": 49,
            "width": 530.4,
            "height": 686.4,
            "pageNumber": 1
          },
          "rects": [],
          "pageNumber": 2
        },
        "comment": {
          "text": "",
          "emoji": ""
        },
        "boundingRectPercent": {
          "height": 6.118881118881119,
          "width": 26.223776223776223,
          "x": 4.956948811112486,
          "y": 92.86130536130536
        },
        "id": "029226474231916155"
      },
      {
        "content": {
          "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAwCAYAAAARmJhoAAAAAXNSR0IArs4c6QAAAPFJREFUeF7t2rENwCAAxMCw/858JFZwe/R8YZ2oONv2OQqEAgeiUM/VVwAiEHIBiHJCAxAxkAtAlBMagIiBXACinNAARAzkAhDlhAYgYiAXgCgnNAARA7kARDmhAYgYyAUgygkNQMRALgBRTmgAIgZSgbvrU1oq6PIr4CUCIReAKCc0ABEDuQBEOaEBiBjIBSDKCQ1AxEAuAFFOaAAiBnIBiHJCAxAxkAtAlBMagIiBXACinNAARAzkAhDlhAYgYiAXgCgnNAARA7kARDmhAYgYyAUgygkNQMRALgBRTmgAIgZyAYhyQgMQMZALQJQTGvgB1fvCbIZvEKEAAAAASUVORK5CYII="
        },
        "position": {
          "boundingRect": {
            "x1": 264.796875,
            "y1": 13,
            "x2": 409.796875,
            "y2": 61,
            "width": 530.4,
            "height": 686.4,
            "pageNumber": 1
          },
          "rects": [],
          "pageNumber": 1
        },
        "comment": {
          "text": "123123",
          "emoji": ""
        },
        "boundingRectPercent": {
          "height": 6.993006993006993,
          "width": 21.124708624708624,
          "x": 49.923996040723985,
          "y": 91.11305361305361
        },
        "requester": {
          "name": "manhnt"
        },
        "id": "4593033170490821"
      }
    ]
    )
    const scrollToHighlightFromHash = () => {
      const highlight = getHighlightById(parseIdFromHash());
      if (highlight) {
        scrollViewerTo(highlight);
      }
    };

    window.addEventListener('hashchange', scrollToHighlightFromHash, false);

    return () => {
      window.removeEventListener('hashchange', scrollToHighlightFromHash, false);
    };
  }, [initialUrl]);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const deleteHighlight = (id) => {
    setHighlights((prevHighlights) => prevHighlights.filter(h => h.id !== id));
  };

  const toggleDocument = () => {
    const newUrl = url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  const scrollViewerTo = (highlight) => {
    // Function to scroll to a specific highlight
  };

  const getHighlightById = (id) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight) => {
    const boundingRectPercent = {
      height: ((highlight.position.boundingRect.y2 - highlight.position.boundingRect.y1) / highlight.position.boundingRect.height) * 100,
      width: ((highlight.position.boundingRect.x2 - highlight.position.boundingRect.x1) / highlight.position.boundingRect.height) * 100,
      x: (highlight.position.boundingRect.x1 / highlight.position.boundingRect.width) * 100,
      y: ((highlight.position.boundingRect.height - highlight.position.boundingRect.y2) / highlight.position.boundingRect.height) * 100,
    };

    const newHighlight = {
      ...highlight,
      id: getNextId(),
      boundingRectPercent,
      dateTime: new Date(),
      type: highlight?.content?.text ? "text-highlight" : "area-highlight",
    };

    setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);
  };

  const updateHighlight = (highlightId, position, content) => {
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) =>
        h.id === highlightId
          ? {
            ...h,
            position: { ...h.position, ...position },
            content: { ...h.content, ...content },
          }
          : h
      )
    );
  };
  return (
    <div>
      <div className='HeaderToolsContainer'>
        <div className='Tools'>
          <button onClick={toggleDocument}>Toggle Document</button>
          <button onClick={resetHighlights}>Reset Highlights</button>
          <button onClick={() => setIsEditing(!isEditing)}>Circle</button>
        </div>
      </div>

      <div style={{ display: 'flex', }}>
        <div className='styleContainer pdf-container'>
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => {

              return (
                <>
                  <PdfHighlighter
                    ref={x => x?.resizeObserver.disconnect()}
                    pdfDocument={pdfDocument}
                    enableAreaSelection={(event) => event.altKey}
                    onScrollChange={resetHash}
                    pdfScaleValue="page-fit"
                    scrollRef={(scrollTo) => {
                      scrollViewerRef.current = scrollTo;
                      scrollToHighlightFromHash();
                    }}
                    onSelectionFinished={(
                      position,
                      content,
                      hideTipAndSelection,
                      transformSelection
                    ) => (
                      <Tip
                        onOpen={transformSelection}
                        onConfirm={(comment) => {
                          addHighlight({ content, position, comment });
                          hideTipAndSelection();
                        }}
                      />
                    )}
                    highlightTransform={(
                      highlight,
                      index,
                      setTip,
                      hideTip,
                      viewportToScaled,
                      screenshot,
                      isScrolledTo
                    ) => {
                      const isTextHighlight = !Boolean(
                        highlight.content && highlight.content.image
                      );
                      const component = isTextHighlight ? (
                        <Highlight
                          key={index}
                          isScrolledTo={isScrolledTo}
                          position={highlight.position}
                          comment={highlight.comment}
                        />
                      ) : (
                        <AreaHighlight
                          isScrolledTo={isScrolledTo}
                          highlight={highlight}
                          onChange={(boundingRect) => {
                            updateHighlight(
                              highlight.id,
                              {
                                boundingRect: viewportToScaled(boundingRect)
                              },
                              {
                                image: screenshot(boundingRect)
                              }
                            );
                          }}
                        />
                      );

                      return (
                        <Popup
                          popupContent={<HighlightPopup {...highlight} />}
                          onMouseOver={(popupContent) =>
                            setTip(highlight, (highlight) => popupContent)
                          }
                          onMouseOut={hideTip}
                          key={index}
                          children={component}

                        />
                      );
                    }}
                    highlights={highlights}
                  />
                </>
              )
            }}
          </PdfLoader>

        </div>
        <div className='resize-bar' />
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          deleteHighlight={deleteHighlight}
        />
      </div >
    </div >
  );
};

export const useGetChunkHighlights = (selectedChunk) => {
  const [size, setSize] = useState({ width: 849, height: 1200 });

  const highlights = useMemo(() => {
    return buildChunkHighlights(selectedChunk, size);
  }, [selectedChunk, size]);

  const setWidthAndHeight = (width, height) => {
    setSize((prevSize) => {
      if (prevSize.height !== height || prevSize.width !== width) {
        return { height, width };
      }
      return prevSize;
    });
  };

  return { highlights, setWidthAndHeight };
};

export default App;

