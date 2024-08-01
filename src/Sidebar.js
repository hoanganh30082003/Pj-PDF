import React, { useEffect, useState } from 'react';
import './style.css';
import moment from 'moment';
const updateHash = (highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};
import more from './more.png'
export function Sidebar({ highlights, toggleDocument, resetHighlights, deleteHightLight }) {
  console.log('highlights', highlights);
  const [listHightlight, setListHightlight] = useState([])
  const [textValue, setTextValue] = useState('')
  const [listFormat, setListFormat] = useState([])

  useEffect(() => {
    if (highlights) {
      const arr = highlights || []
      if (arr?.length > 0) {
        const res = Object.groupBy(arr, (values) => values?.position?.pageNumber)
        console.log(res);
        const resObj = Object.keys(res).map((key) => [key, res[key]]);
        console.log('resObj', resObj);
        setListHightlight(resObj)
        setListFormat(resObj)
      } else {
        setListHightlight([])
      }
      // setListHightlight(highlights)
    }
  }, [highlights])

  const searchNote = (txtSearch) => {
    setTextValue(txtSearch?.target?.value)
    if (txtSearch?.target?.value) {
      const arr = highlights || []
      const resSearch = arr.filter(val => val?.requester?.name?.includes(txtSearch?.target?.value))

      const res = Object.groupBy(resSearch, (values) => values?.position?.pageNumber)
      const resObj = Object.keys(res).map((key) => [key, res[key]]);
      console.log('resObj', resObj);
      setListHightlight(resObj)
    } else {
      setListHightlight(listFormat)
    }
  }
  console.log('listHightlight', listHightlight);

  const openPopup = (index) => {
    document.getElementById(`popup-${index}`).style.display = "block"
  }

  const closePopup = () => {
    document.getElementById("popup").style.display = "none"
  }

  window.onclick = function (event) {
    if (!event.target.matches('.note-popup-toggle-trigger')) {
      var dropdowns = document.getElementsByClassName("note-popup-options");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.style.display === "block") {
          openDropdown.style.display = "none";
        }
      }
    }
  }

  return (
    <div className="NotesPanel" style={{ minWidth: 248, maxWidth: 248 }}>
      <div className="header">
        <div className="input-container">
          <input placeholder="Search comments" aria-label="Search comments" onChange={(txt) => searchNote(txt)} value={textValue} />
        </div>
        <div className="comments-counter"><span className="main-comment">Comments</span> ({highlights?.length || 0})</div>
      </div>
      { }
      {listHightlight && listHightlight.map((item, index) => (
        <div className='normal-notes-container' >
          <div className='note-wrapper'>
            <div className='ListSeparator'>Page {item[0]}</div>
            {item[1]?.map((itm, idx) => (
              <div className='Note' onClick={() => {
                updateHash(itm);
              }}>
                <div className='NoteContent clicked' >
                  <div className='NoteHeader parent'>
                    <div className='type-icon-container'>
                      <div style={{ height: 15, width: 15, border: '2px solid #d35400' }} />
                    </div>
                    <div className='author-and-date'>
                      <div className="author-and-overflow">
                        <div className="author-and-time">
                          <div className="author">{itm?.requester?.name}</div>
                          <div className="date-and-num-replies">
                            <div className="date-and-time">{moment(itm?.dateTime).format("DD/MM/YYYY HH:mm")}</div>
                          </div>
                        </div>
                        <div className="state-and-overflow">
                          <div>
                            <div data-element="notePopup" className="NotePopup">
                              <div className='overflow note-popup-toggle-trigger active' onClick={() => openPopup(idx)}>
                                <img src={more} width="16" height="16" onClick={() => openPopup(idx)}></img>
                              </div>
                              <div id={`popup-${idx}`} className="options note-popup-options">
                                <button data-element="notePopupEdit" className="option note-popup-option">Edit</button>
                                <button data-element="notePopupDelete" className="option note-popup-option" onClick={() => deleteHightLight(itm?.id)}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {itm?.comment?.text && (
                    <div className="container">
                      <div className="note-text-preview preview-comment">
                        <span>{itm?.comment?.text}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}


      {/* <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight?.comment?.text}</strong>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}><button onClick={() => deleteHightLight(index)}>Xóa</button></div>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: '0.5rem' }}>
                  {`${highlight?.content?.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight?.content?.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: '0.5rem' }}
                >
                  <img src={highlight.content.image} alt={'Screenshot'} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight?.position?.pageNumber},
              
            </div>
          </li>
        ))}
      </ul>
      {highlights.length > 0 ? (
        <div style={{ padding: '1rem' }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null} */}
    </div>
  );
}
