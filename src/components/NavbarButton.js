import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PdfViewerContext } from './PdfViewerContext';
function NavbarButton() {
    const { isHighlight, isHighlightArea, isCircle, setIsCircle, setIsHighlight, setIsHighlightArea, isStrikeOut, setIsStrikeOut, isUnderlineText, setIsUnderlineText } = useContext(PdfViewerContext);

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Button onClick={() => setIsCircle(!isCircle)}>
                            {isCircle ? 'Tắt chế độ tròn' : 'Bật chế độ tròn'}
                        </Button>
                        <Button onClick={() => setIsHighlightArea(!isHighlightArea)}>{isHighlightArea ? 'Tắt chế độ highlight area' : 'Bật chế độ highlight area'}</Button>
                        <Button onClick={() => setIsHighlight(!isHighlight)}>{isHighlight ? 'Tắt chế độ highlight text' : 'Bật chế độ highlight text'}</Button>
                        <Button onClick={() => setIsUnderlineText(!isUnderlineText)}>{isUnderlineText ? 'Tắt chế độ underline text' : 'Bật chế độ underline text'}</Button>
                        <Button onClick={() => setIsStrikeOut(!isStrikeOut)}>{isStrikeOut ? 'Tắt chế độ strikeout text' : 'Bật chế độ strikeout text'}</Button>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarButton;