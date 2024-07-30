import { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { styles } from './userMenu.styles.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../helpers/UserContext';
import { isAdminOfEvent, isSuperAdmin } from '../../../../helpers/firestore/users';
import { EtiEventContext } from '../../../../helpers/EtiEventContext';

export function UserMenu() {
  return (
    <>
      <Box sx={styles.container}></Box>
    </>
  );
}
