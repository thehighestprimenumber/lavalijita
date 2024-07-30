import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { AppBar, Avatar, Box, Button, Link, Menu, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { auth } from '../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { ROUTES } from '../App.js';
import { UserContext } from '../helpers/UserContext';
import { EtiEventContext } from '../helpers/EtiEventContext';
import { isAdminOfEvent, isSuperAdmin } from '../helpers/firestore/users';

const EtiAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const { etiEvent } = useContext(EtiEventContext);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const links = [
    { href: ROUTES.PROFILE, title: 'Mi Perfil' },
    { href: ROUTES.SIGNUP, title: 'Inscripción' }
  ];

  const { t } = useTranslation([SCOPES.COMPONENTS.BAR, SCOPES.MODULES.USER], {
    useSuspense: false
  });

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor: 'white', paddingX: 2 }}
      id="appbar"
    >
      <Container maxWidth="xl" id="container">
        <Toolbar
          disableGutters
          id="toolbar"
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/">
              <Avatar
                src="/img/icon/icon.jpeg"
                alt="La Valijita"
                sx={{ width: '100px', height: '100px' }}
              />
            </Link>
            {isSignedIn ? (
              <Box style={{ marginLeft: '20px' }}>
                <Typography variant={'p'} color={'black'}>
                  {user.data?.nameFirst}
                </Typography>
              </Box>
            ) : null}
          </div>

          <Box
            sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}
            id="botonera"
          >
            {isSignedIn ? (
              <>
                <Button
                  color="secondary"
                  variant="outlined"
                  underline="none"
                  href={ROUTES.SIGNUP}
                  key={'profile'}
                >
                  {t('controlPanel').toUpperCase()}
                </Button>

                <Button
                  color="secondary"
                  variant="outlined"
                  underline="none"
                  href={ROUTES.PROFILE}
                  key={'profile'}
                >
                  Mi Perfil
                </Button>

                {isAdminOfEvent(user, etiEvent?.id) && (
                  <>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => navigate(ROUTES.ATTENDANCE)}
                    >
                      Asistencia
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      underline="none"
                      href={ROUTES.SIGNUPS}
                      key={'profile'}
                    >
                      {t('signupList')}
                    </Button>
                  </>
                )}

                {isSuperAdmin(user) && (
                  <Button onClick={() => navigate(ROUTES.SUPERADMIN)}>{t('superadmin')}</Button>
                )}

                <Button
                  color="primary"
                  variant="contained"
                  underline="none"
                  onClick={() => auth.signOut()}
                  href={'/'}
                  key={'signout'}
                >
                  {t('logout').toUpperCase()}
                </Button>
              </>
            ) : (
              <Button
                color="secondary"
                variant="contained"
                underline="none"
                onClick={() => auth.signIn()}
                href={'/sign-in'}
                key={'sign-in'}
                sx={{ fontSize: 12, align: 'center', margin: '3px', textAlign: 'center' }}
              >
                {t('signin').toUpperCase()}
              </Button>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="more"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: '#000000' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {links.map((link) => (
                <Link
                  variant="h6"
                  underline="none"
                  color="black"
                  href={link.href}
                  sx={{ fontSize: 14 }}
                  key={link.href}
                  display="flex"
                  padding="5px"
                >
                  {link.title}
                </Link>
              ))}
              {isAdminOfEvent(user, etiEvent?.id) && (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => navigate(ROUTES.ATTENDANCE)}
                  >
                    Asistencia
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    underline="none"
                    href={ROUTES.SIGNUPS}
                    key={'profile'}
                  >
                    {t('signupList')}
                  </Button>
                </>
              )}

              {isSuperAdmin(user) && (
                <Button onClick={() => navigate(ROUTES.SUPERADMIN)}>{t('superadmin')}</Button>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default EtiAppBar;
