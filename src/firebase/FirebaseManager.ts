///firebase/FirebaseManager.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

export class FirebaseManager {
  private static instance: FirebaseApp;

  public static initialize(config: Object) {
    if (!getApps().length) {
      FirebaseManager.instance = initializeApp(config);
    } else {
      FirebaseManager.instance = getApp();
    }
  }

  public static getInstance(): FirebaseApp {
    return FirebaseManager.instance;
  }
}
