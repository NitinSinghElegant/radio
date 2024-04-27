# App Rádio Itapoan

[![FIGMA](https://img.shields.io/badge/site-white)](https://www.itapoanfm.com.br)  
[![FIGMA](https://img.shields.io/badge/design-figma-blueviolet)](https://www.figma.com/file/6JO6V2g5uigFObksan50jT/mappeAPPS?node-id=2021%3A2573&t=HzLSvdigB6NHD7ej-0)
[![ANDROID](https://img.shields.io/badge/platform-android-green)](https://play.google.com/console/u/0/developers)
[![IOS](https://img.shields.io/badge/ios-lightgrey)](https://developer.apple.com/account)  
[![REACTNATIVE](https://img.shields.io/badge/project-react--native@0.70.5-blue)](https://reactnative.dev/docs/getting-started)
[![EXPO](https://img.shields.io/badge/expo@^47.0.0-white)](https://docs.expo.dev/get-started/installation/)
[![TYPESCRIPT](https://img.shields.io/badge/typescript-informational)](https://docs.expo.dev/guides/typescript/)  
[![NAVIGATION](https://img.shields.io/badge/react--navigation@^6.0.11-critical)](https://reactnavigation.org/docs/getting-started)

## Run on device

This project uses expo-dev-client, this means that the regular "npx expo start" does not work. Instead, follow the steps below:

First, build the APK  
npx eas-cli build --platform android --profile development

eas build --platform android --profile production

Then, download and install APK on emulator/device

And then run  
npx expo start --dev-client --lan

## Build

```bash
npx eas-cli build --platform [os] --profile [profile]
```

[os] = android | ios  
[profile] = production | preview | development (according to eas.json file)

## Upload

```bash
npx eas-cli submit -p [os]
```

[os] = android | ios
