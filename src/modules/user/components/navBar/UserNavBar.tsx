import React from 'react';
import { Button, Grid } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { ROUTES } from '../../../../App';
import { auth } from '../../../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../../helpers/constants/i18n';
import { styles } from './UserNavBar.styles';
import { useNavigate } from 'react-router-dom';

export default function UserNavBar() {
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const navigate = useNavigate();
  const logout = () => auth.signOut().then(() => navigate(ROUTES.HOME));
  return (
    <Grid container sx={styles.panelContainer}>
      <Grid item xs={12} md={3} sx={styles.accountInfoContainer}>
        <AccountCircle sx={styles.accountIcon} />
      </Grid>
      <Grid item xs={12} md={7} sx={styles.panelTitleContainer}>
        <Button sx={styles.panelTitle} href={ROUTES.SIGNUP} key={'profile'}>
          {t('controlPanel')}
        </Button>
      </Grid>
      <Grid item xs={12} md sx={styles.panelTitleContainer}>
        <Button color={'secondary'} variant={'contained'} onClick={() => logout()} key={'signout'}>
          {t('logout').toUpperCase()}
        </Button>
      </Grid>
    </Grid>
  );
}
