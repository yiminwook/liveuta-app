## Liveuta App

본 프로젝트는 EXPO를 사용하여 구성되었습니다.

[라이브우타](https://liveuta.vercel.app)의 모바일 앱입니다.

## Project Setup

### 필요한 것

- **Node.js**: `v22.14.0` 이상
- **pnpm**: `v9.1.3` 이상
- **expo-cli**: `v16.9.0` 이상
- **ruby** (IOS) : `v2.7.5` 3버전으로는 실행안됨
- **java** (Android): Android Studio > Settings > Build, Excution Deployment > Build Tool > Gradle > Default Gradle JDK > open JDK `v17` %JAVA_HOME%

[node.js](https://nodejs.org)
[pnpm](https://pnpm.io/ko/installation)

EXPO-CLI 설치방법

```bash
npm install -g eas-cli
```

Android

- [openjdk](https://openjdk.org/) v17
- [Android Studio](https://developer.android.com/studio)
- [자세한 설치법(윈도우)](https://reactnative.dev/docs/set-up-your-environment?platform=android&os=windows), [자세한 설치법(리눅스)](https://reactnative.dev/docs/set-up-your-environment?platform=android&os=linux), [자세한 설치법(macOS)](https://reactnative.dev/docs/set-up-your-environment?platform=android&os=macos)

iOS

- [XCode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
- [자세한 설치법](https://reactnative.dev/docs/set-up-your-environment?platform=ios&os=macos)

버전 확인은 다음 명령어로 가능합니다:

```bash
node -v
pnpm -v
eas -v
```

---

### 프로젝트 세팅

```sh
git clone https://github.com/yiminwook/liveuta-app
cd liveuta-app
pnpm i
```

### 개발 시작

```sh
pnpm {android|ios}
```

---

EXPO 라이브러리 설치방법

```bash
npx expo install react-native-webview
```

EXPO SDK 업데이트 방법

```bash
npx expo install expo@53

# --check: 설치된 패키지 중 어떤 패키지를 업데이트해야 하는지 확인
npx expo install --check

# --fix: 잘못된 패키지 버전을 자동으로 업데이트
npx expo install --fix
```

---

EXPO 딥링크 테스트 방법

```bash
# EXPO GO
npx uri-scheme open exp://127.0.0.1:8081/--/main/dashboard —android

# ANDROID Emulator
npx uri-scheme open com.utawawku.liveuta:// --android

# Ios Simulator
npx uri-scheme open com.utawawku.liveuta:// --ios

```

---

빌드 방법

```bash
# EXPO CLOUD
eas build --platform android --profile preview

# LOCAL (.apk)
eas build --platform android --profile preview --local

# .aab
cd ./android
./gradlew bundleRelease
```

---

React-Native Inspector 키는 법

실물기기 - 흔들어서 오픈
에뮬레이터 - `cmd + M` or `ctrl + M`

---

IOS 기본 시뮬레이터 변경하는 방법

```
xcrun simctl list   # 기기리스트 확인

xcrun simctl boot 4D62DA53-EE5E-4F16-A7A1-9478773A0826
```

EXPO Icon gallary

https://icons.expo.fyi

<br />

### EAS Env Pull

`eas env:pull`

### APP 배포 방법

Expo 공식문서

https://docs.expo.dev/submit/android/
https://github.com/expo/fyi/blob/main/first-android-submission.md

Android Development (expo dev server 필요)

`eas build --platform android --profile development`

Android Production

`eas build --platform android --profile production`

Expo Upload Credential play console에 재 업로드 필요한 경우 (.jks => .pem)

`https://hayo4joy.tistory.com/entry/Google-Play-Console-update-upload-key`

```
<your_key_alias> : 키의 별칭. 1번 명령어 결과의 'Key Alias'
expo_upload_key : 생성할 .pem 파일의 이름. 원하는 이름을 설정하면 된다.
<your_expo_keystore_path> : 다운로드 받은 .jks 파일의 위치. 1번 명령어 결과의 'Path to Keystore'

keytool -export -rfc -alias <your_key_alias> -file expo_upload_key.pem -keystore <your_expo_keystore_path>
```

### EAS Submit

`eas submit`

### EAS Updates

`eas update --channel production --message "message"`
