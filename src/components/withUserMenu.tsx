import React from 'react';
import { Container } from '@mui/material';

export default function withUserMenu(Screen: React.ComponentClass<any>) {
  function WithUserMenu(props: any) {
    return (
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', px: 5 }}>
        {/*<UserNavBar />*/}
        {/*<UserMenu />*/}
        <Screen {...props} />
      </Container>
    );
  }
  return WithUserMenu;
}
