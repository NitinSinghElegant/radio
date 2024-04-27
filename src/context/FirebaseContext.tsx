import React, { createContext, useContext, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configurações do Firebase
const firebaseConfigs = {
     db1: {
    databaseURL: 'https://radio-correio-delmiro-default-rtdb.firebaseio.com/',
    projectId: 'radio-correio-delmiro',
    appId:
      Platform.OS === 'android'
        ? '1:1032925588527:android:fe9017e7c1efa7913f2ada'
        : '1:1032925588527:ios:4fa3d2b340eaba4a3f2ada',
  },
  db2: {
    databaseURL: 'https://radio-100-fm-default-rtdb.firebaseio.com/',
    projectId: 'radio-100-fm',
    appId:
      Platform.OS === 'android'
        ? '1:1037076250514:android:c14df5535e88675bbccb4b'
        : '1:1037076250514:ios:8ae1a2b887e35a9fbccb4b',
  },
 db3: {
    databaseURL: 'https://geracao-de-adoradores-7f338-default-rtdb.firebaseio.com/',
    projectId: 'geracao-de-adoradores-7f338',
    appId:
      Platform.OS === 'android'
        ? '1:624807320235:android:eb9ad1f8cd7df526c8b5ee'
        : '1:624807320235:ios:5f54cdde927bb914c8b5ee',
  },
db4: {
    databaseURL: 'https://tv-terra-11eaa-default-rtdb.firebaseio.com/',
    projectId: 'tv-terra-11eaa',
    appId:
      Platform.OS === 'android'
        ? '1:434470225318:android:4a247fd8e58d351473bb67'
        : '1:434470225318:ios:63fa12c87a33d52a73bb67',
  },
db5: {
    databaseURL: 'https://noronha-web-radio-e-tv-default-rtdb.firebaseio.com/',
    projectId: 'noronha-web-radio-e-tv',
    appId:
      Platform.OS === 'android'
        ? '1:308164983143:android:ed0c565b35b3cf539657c2'
        : '1:308164983143:ios:51cfef7b74e3c6839657c2',
  },
db6: {
    databaseURL: 'https://radio-advir-slz2-default-rtdb.firebaseio.com/',
    projectId: 'radio-advir-slz2',
    appId:
      Platform.OS === 'android'
        ? '1:671422552947:android:8e7b42639d66d96dbf4306'
        : '1:671422552947:ios:18355a18ab29e720bf4306',
  },
db7: {
    databaseURL: 'https://radio-criativa-fm-106-9-default-rtdb.firebaseio.com/',
    projectId: 'radio-criativa-fm-106-9',
    appId:
      Platform.OS === 'android'
        ? '1:785206287138:android:0e1e918c646ef9097c637b'
        : '1:785206287138:ios:634116693b1e1c0e7c637b',
  },

};

// Criando o contexto
const FirebaseContext = createContext(null);

// Provedor de contexto que inicializa o Firebase
export const FirebaseProvider = ({ children }) => {
  const [databases, setDatabases] = useState({});

const initFirebase = (dbKey) => {
  console.log(`Tentando inicializar: ${dbKey}`);
  if (!getApps().some(app => app.options.projectId === firebaseConfigs[dbKey].projectId)) {
    const app = initializeApp(firebaseConfigs[dbKey], dbKey);
    const db = getDatabase(app);
    console.log(`Firebase inicializado para ${dbKey}`);
    setDatabases(prev => ({ ...prev, [dbKey]: db }));
  } else {
    console.log(`Firebase já inicializado para ${dbKey}`);
  }
};


  return (
    <FirebaseContext.Provider value={{ databases, initFirebase }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useFirebase = () => useContext(FirebaseContext);
