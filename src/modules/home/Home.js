import * as React from 'react';
import { useContext } from 'react';
import Portada from './portada/Portada';
import { EtiEventContext } from 'helpers/EtiEventContext';
import Cronograma from './cronograma/Cronograma';

function Index() {
  const { etiEvent } = useContext(EtiEventContext);

  return <React.Fragment>{etiEvent?.id && <Cronograma />}</React.Fragment>;
}

export default Index;
