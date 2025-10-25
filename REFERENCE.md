### 참고문헌

#### 앱 아이콘 생성

https://easyappicon.com

#### Deep Link fallback 서비스

https://www.branch.io/

### Push 알림 테스트

https://expo.dev/notifications

---

### 에러해결

#### Android Gradle Version 불일치

1. 개발모드에서 에러 발생시

```
Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
```

Android 애뮬레이터 내 App을 제거후 `pnpm android`로 재설치

2. apk 설치시 에러발생시

```
The APK failed to install.
Error: INSTALL_FAILED_UPDATE_INCOMPATIBLE
```

Android 애뮬레이터 내 App을 제거후 apk 재설치

### 로컬 빌드시 환경변수 적용되지 않는 문제

https://www.reddit.com/r/expo/comments/1b7wn4y/comment/mdl90fa/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

`.gitignore`에서 `.env`를 제외하도록 설정
또는 `.easignore`에서 `.env`를 제외하도록 설정

### Android Studio "node" 명령어 에러로 인한 빌드 실패, module not found

A problem occurred starting process 'command 'node''

https://www.youtube.com/watch?v=3ByuOHZKeLE

Settings => build tool => Gradle 메뉴이동
Gradle JDK를 JAVA_HOME (openjdk 17.0.9)버전으로 변경

### Expo Camera 포커싱 하는 법

https://stackoverflow.com/questions/67901368/how-to-implement-tap-on-focus-in-react-natie-using-expo-camera

### ReactNative Devtools 사용시 필수 종속성, react-native-svg

https://www.npmjs.com/package/react-native-react-query-devtools

위 링크 트러블슈팅 참고

### Google Cloud Console - Firebase

소유자(Super Admin) 계정에 조직 정책 관리자 역할 부여

https://discuss.google.dev/t/cant-assign-organization-policy-administrator-role-to-myself/149617/6

```
gcloud organizations add-iam-policy-binding 448651897879 --member='idb@hongplat.com' --role='roles/orgpolicy.policyAdmin'
```

### EAS Submit 참고문서

```
https://github.com/expo/fyi/blob/main/creating-google-service-account.md
```

내부테스트시 eas.json draft 설정

```
https://www.reddit.com/r/expo/comments/179y5he/help_with_expo_eas_android_submission/
```
