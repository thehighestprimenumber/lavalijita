import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import React, { Suspense, useEffect, useState } from 'react';

import withRoot from './components/withRoot';
import EtiAppBar from './components/EtiAppBar';
import { UserContext } from './helpers/UserContext';
import { NotificationContext } from './helpers/NotificationContext';
import withUserMenu from './components/withUserMenu';
import { Notification } from './components/notification/Notification';
import { CircularProgress } from '@mui/material';
import { EtiEventContext } from './helpers/EtiEventContext';
import { getFutureEti } from './helpers/firestore/events';

const Inscripcion = React.lazy(() => import('./modules/inscripcion/index'));
const SignupList = React.lazy(() => import('./modules/inscripcion/SignupList'));
const Receipt = React.lazy(() => import('./modules/inscripcion/Receipt'));
const SignInScreen = React.lazy(() => import('./modules/signIn/signIn'));
const SuperAdmin = React.lazy(() => import('./modules/superAdmin/index'));
const EventsList = React.lazy(() => import('./modules/superAdmin/events/EventsList'));
const SentMailList = React.lazy(() => import('./modules/superAdmin/sentMail/SentMailList'));

const Profile = React.lazy(() => import('./modules/user/profile'));
const Home = React.lazy(() => import('./modules/home/Home'));
const Bank = React.lazy(() => import('./modules/user/profile/bank'));
const EventForm = React.lazy(() => import('./modules/superAdmin/events/EventForm'));
const TemplatesList = React.lazy(() => import('./modules/superAdmin/templates'));
const EditTemplate = React.lazy(() => import('./modules/superAdmin/templates/EditTemplate'));
const RolesList = React.lazy(() => import('./modules/superAdmin/roles/RolesList'));
const Instructions = React.lazy(() => import('./modules/instructions/index'));

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    lng: 'es', //TODO this could be set from user info
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    nsSeparator: '.'
  });

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  SUPERADMIN: '/super-admin',
  PROFILE: '/user/profile',
  SIGN_IN: '/sign-in',
  SIGNUP: '/inscripcion',
  SIGNUPS: '/lista-inscriptos',
  BANKS: '/banks',
  ROLES: '/roles',
  TEMPLATES: '/templates',
  INSTRUCTIONS: '/instructions',
  ATTENDANCE: '/attendance',
  RECEIPTS: '/receipts',
  SENT_MAILS: '/sent-mails'
};

export const PRIVATE_ROUTES = [ROUTES.PROFILE, ROUTES.SIGNUP, ROUTES.SIGNUPS, ROUTES.ATTENDANCE];

function App() {
  const [user, setUser] = useState({ user: {} });
  const [etiEvent, setEtiEvent] = useState();
  useEffect(() => {
    async function fetch() {
      const futureEtiEvent = await getFutureEti();
      setEtiEvent(futureEtiEvent);
    }

    fetch();
  }, [user]);

  const [notification, setNotificationInfo] = useState({
    visible: false,
    notificationProps: {},
    notificationText: ''
  });
  const setNotification = (notificationText, notificationProps) => {
    if (!notification.visible) {
      setNotificationInfo({
        notificationProps,
        notificationText,
        visible: true
      });
      setTimeout(() => {
        setNotificationInfo({
          ...notification,
          visible: false
        });
      }, 10000);
    }
  };
  return (
    <div className="">
      <EtiEventContext.Provider value={{ etiEvent, setEtiEvent }}>
        <UserContext.Provider value={{ user, setUser }}>
          <NotificationContext.Provider value={{ notification, setNotification }}>
            <EtiAppBar />
            <Notification {...notification} />
            <Suspense
              fallback={
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <CircularProgress />
                </div>
              }
            >
              <Routes>
                <Route path={ROUTES.SIGNUP} element={withUserMenu(Inscripcion)()} exact />
                <Route path={ROUTES.SIGNUPS} element={withUserMenu(SignupList)()} exact />
                <Route
                  path={ROUTES.ATTENDANCE}
                  element={withUserMenu(SignupList)({ isAttendance: true })}
                  exact
                />
                <Route
                  path={`${ROUTES.RECEIPTS}/:etiEventId/:signupId`}
                  element={withUserMenu(Receipt)()}
                />
                <Route path={`${ROUTES.RECEIPTS}/:etiEventId`} element={withUserMenu(Receipt)()} />

                <Route path={ROUTES.SIGN_IN} element={<SignInScreen />} exact />
                <Route path={ROUTES.SUPERADMIN} element={<SuperAdmin />} />
                <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`} element={<EventsList />} />
                <Route
                  path={`${ROUTES.SUPERADMIN}${ROUTES.SENT_MAILS}/:id`}
                  element={<SentMailList />}
                />
                <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/:id`} element={<EventForm />} />
                <Route path={`${ROUTES.SUPERADMIN}${ROUTES.ROLES}`} element={<RolesList />} />
                <Route path={`${ROUTES.BANKS}/:id`} element={<Bank />} />
                <Route path={ROUTES.PROFILE} element={withUserMenu(Profile)()} />
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route
                  path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}`}
                  element={<TemplatesList />}
                />
                <Route
                  path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}/:id`}
                  element={<EditTemplate />}
                />
                <Route path={ROUTES.INSTRUCTIONS} element={<Instructions />} />
              </Routes>
            </Suspense>
            {/*<AppFooter />*/}
          </NotificationContext.Provider>
        </UserContext.Provider>
      </EtiEventContext.Provider>
    </div>
  );
}

export default withRoot(App);
