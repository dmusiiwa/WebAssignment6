import { useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  
  const token = readToken();
  const submitForm = async (e) => {
    e.preventDefault();
    if (!searchField.trim()) return;
    
    const queryString = `title=true&q=${searchField}`;
    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
    setSearchField('');
    setIsExpanded(false);
  };

  function toggleNavbar() {
    setIsExpanded(prev => !prev);
  }

  function closeNavbar() {
    setIsExpanded(false);
  }

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-dark" expand="lg" expanded={isExpanded}>
        <Container>
          <Navbar.Brand>Ange Pamela Gadjou Tchaleu</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link active={router.pathname === '/'} onClick={closeNavbar}>Home</Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/search'} onClick={closeNavbar}>Advanced Search</Nav.Link>
                </Link>
              )}
            </Nav>
            
            {token && (
              <>
                &nbsp;
                <Form className="d-flex" onSubmit={submitForm}>
                  <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                  <Button variant="secondary" type="submit">Search</Button>
                </Form>
                &nbsp;
                <Nav>
                  <NavDropdown title={token.userName} id="user-nav-dropdown">
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item onClick={closeNavbar}>
                        Favourites
                      </NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item onClick={closeNavbar}>
                        Search History
                      </NavDropdown.Item>
                    </Link>
                    <NavDropdown.Item onClick={logout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
            
            {!token && (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/register'} onClick={closeNavbar}>Register</Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/login'} onClick={closeNavbar}>Login</Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}