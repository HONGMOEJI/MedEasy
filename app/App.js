// App.js
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import {Alert, Platform, PermissionsAndroid, Linking, AppState} from 'react-native';

import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// URL 스킴 처리를 위한 커스텀 훅 추가
import useRoutineUrl from './hooks/useRoutineUrl';
import RoutineCheckModal from './components/RoutineCheckModal';

// Custom Hooks
import useFCMTokenRefresh from './hooks/useFCMTokenRefresh';

// FCM 토큰 저장 함수
import {setFCMToken} from './api/storage';

import Splash from './screens/Splash';
import SignUpStartScreen from './screens/SignUp/SignUpStart';
import SignUpNameScreen from './screens/SignUp/SignUpName';
import SignUpEmailScreen from './screens/SignUp/SignUpEmail';
import SignUpPasswordScreen from './screens/SignUp/SignUpPassword';
import SignUpDOBGenderScreen from './screens/SignUp/SignUpDOBGender';
import SignInScreen from './screens/SignUp/SignIn';
import NavigationBar from './components/NavigationBar';
import SearchMedicineScreen from './screens/Search/SearchMedicine';
import SearchMedicineResultsScreen from './screens/Search/SearchMedicineResults';
import MedicineDetailScreen from './screens/Search/MedicineDetail';
import MedicineImageDetailScreen from './screens/Search/MedicineImageDetail';
import PrescriptionSearchResults from './screens/Search/PrescriptionSearchResults';
import SettingStack from './screens/Settings/SettingStack';
import NotificationScreen from './screens/Notification';
import AddMedicineRoutineScreen from './screens/Routine/AddMedicineRoutine';
import AddHospitalVisitScreen from './screens/Routine/AddHospitalVisit';
import SetMedicineRoutineScreen from './screens/Routine/SetMedicineRoutine';
import SetMedicineNameScreen from './screens/Routine/SetMedicineName';
import SetMedicineStartDayScreen from './screens/Routine/SetMedicineStartDay';
import SetMedicineDayScreen from './screens/Routine/SetMedicineDay';
import SetMedicineTimeScreen from './screens/Routine/SetMedicineTime';
import SetMedicineDoseScreen from './screens/Routine/SetMedicineDose';
import SetMedicineTotalScreen from './screens/Routine/SetMedicineTotal';
import SetRoutineTimeScreen from './screens/Routine/SetRoutineTime';
import MedicineListScreen from './screens/Settings/MedicineList';

import {SignUpProvider} from './api/context/SignUpContext';
import {FontSizeProvider} from './../assets/fonts/FontSizeContext';

import {navigationRef} from './screens/Navigation/NavigationRef';
import RoutineUrlService from './services/RoutineUrlService';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const RoutineModalStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="SignUpStart" component={SignUpStartScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUpName" component={SignUpNameScreen} />
      <AuthStack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
      <AuthStack.Screen
        name="SignUpPassword"
        component={SignUpPasswordScreen}
      />
      <AuthStack.Screen
        name="SignUpDOBGender"
        component={SignUpDOBGenderScreen}
      />
    </AuthStack.Navigator>
  );
};

const RoutineModalNavigator = () => {
  return (
    <RoutineModalStack.Navigator screenOptions={{headerShown: false}}>
      <RoutineModalStack.Screen
        name="SetMedicineName"
        component={SetMedicineNameScreen}
      />
      <RoutineModalStack.Screen
        name="SetMedicineStartDay"
        component={SetMedicineStartDayScreen}
      />
      <RoutineModalStack.Screen
        name="SetMedicineDay"
        component={SetMedicineDayScreen}
      />
      <RoutineModalStack.Screen
        name="SetMedicineTime"
        component={SetMedicineTimeScreen}
      />
      <RoutineModalStack.Screen
        name="SetMedicineDose"
        component={SetMedicineDoseScreen}
      />
      <RoutineModalStack.Screen
        name="SetMedicineTotal"
        component={SetMedicineTotalScreen}
      />
    </RoutineModalStack.Navigator>
  );
};

// FCM 리스너 등록 상태 관리 (앱 전체 생명주기에서 한 번만 등록하기 위함)
let fcmListenersRegistered = false;

const registerFCMListeners = () => {
  if (fcmListenersRegistered) return;
  fcmListenersRegistered = true;

  // 포그라운드 메시지 수신 리스너
  messaging().onMessage(async remoteMessage => {
    Alert.alert('📬 새 알림', remoteMessage.notification?.title || '알림이 도착했습니다.');
  });

  // 백그라운드에서 알림 탭 리스너
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('🔔 백그라운드에서 알림 열림:', remoteMessage);
    // 여기에 알림 탭 시 특정 화면으로 이동하는 로직 추가 가능
  });

  // 종료 상태에서 알림 탭으로 앱 실행 처리
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log('🔔 종료 상태에서 알림 열림:', remoteMessage);
      // 여기에 알림 탭 시 특정 화면으로 이동하는 로직 추가 가능
    }
  });
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [permissionInitialized, setPermissionInitialized] = useState(false);

  // FCM 토큰 갱신 훅 - 개선된 버전 사용
  const { refreshToken } = useFCMTokenRefresh();
  
  // URL 스킴 처리를 위한 커스텀 훅 사용 
  const { routineData, isModalVisible, closeModal } = useRoutineUrl();

  // ⚠️ 중요: URL 스킴 처리 방식 통합 - App.js에서만 리스너 설정
  useEffect(() => {
    console.log('[App] URL 리스너 등록 - 단일 소스로 통합');
    
    // 링킹 리스너 설정: URL 스킴 처리는 RoutineUrlService가 담당
    const linkingListener = Linking.addEventListener('url', (event) => {
      console.log('[App] URL 이벤트 감지 (통합):', event.url);
      if (event.url && event.url.includes('medeasy://openroutine')) {
        // RoutineUrlService로 URL 전달
        RoutineUrlService.handleUrlScheme(event.url);
      }
    });
    
    // 앱 활성화 리스너 설정
    const appStateListener = AppState.addEventListener('change', async (nextAppState) => {
      console.log('[App] 앱 상태 변경 감지 (통합):', nextAppState);
      
      if (nextAppState === 'active') {
        try {
          const url = await Linking.getInitialURL();
          if (url && url.includes('medeasy://openroutine')) {
            console.log('[App] 앱 활성화 시 URL 감지 (통합):', url);
            // RoutineUrlService로 URL 전달
            RoutineUrlService.handleUrlScheme(url);
          }
        } catch (error) {
          console.error('[App] URL 확인 오류 (통합):', error);
        }
      }
    });
    
    // 초기 URL 확인
    Linking.getInitialURL().then(url => {
      if (url && url.includes('medeasy://openroutine')) {
        console.log('[App] 초기 URL 감지 (통합):', url);
        // RoutineUrlService로 URL 전달
        RoutineUrlService.handleUrlScheme(url);
      }
    });
    
    // 클린업 함수
    return () => {
      console.log('[App] URL 리스너 제거 (통합)');
      linkingListener.remove();
      appStateListener.remove();
    };
  }, []);

  const requestNotificationPermission = async () => {
    try {
      console.log('🔔 알림 권한 요청 시작');
      let permissionGranted = false;
      
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission({
          alert: true,
          badge: true,
          sound: true,
        });
        console.log('📋 iOS 권한 요청 결과:', authStatus);
        
        permissionGranted = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('📋 Android 권한 요청 결과:', granted);
        
        permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 이하는 별도 권한 요청 없음
        permissionGranted = true;
      }
      
      console.log('📋 권한 요청 결과:', permissionGranted ? '허용됨' : '거부됨');
      return permissionGranted;
    } catch (error) {
      console.error('🔴 알림 권한 요청 오류:', error);
      return false;
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      '알림 권한이 꺼져 있습니다',
      '약 복용 알림을 받으시려면 설정에서 푸시 알림을 허용해주세요.',
      [
        { text: '나중에', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
      ]
    );
  };
  
  // 스플래시 화면 표시용 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  // 스플래시 화면이 사라진 후 FCM 초기화를 위한 useEffect
  useEffect(() => {
    if (!isLoading && !permissionInitialized) {
      const initializePermissions = async () => {
        try {
          console.log('🔔 FCM 초기화 시작 (스플래시 화면 이후)');
          
          // 1. FCM 리스너 등록 (한 번만)
          registerFCMListeners();
          
          // 2. 알림 권한 상태 확인
          const currentPermission = await messaging().hasPermission();
          console.log('📋 현재 알림 권한 상태:', currentPermission);
          
          // 3. 권한 상태에 따른 처리
          if (currentPermission === messaging.AuthorizationStatus.NOT_DETERMINED) {
            // 권한을 아직 요청하지 않은 경우 요청
            const granted = await requestNotificationPermission();
            if (granted) {
              // 권한 획득 시 토큰 강제 갱신
              await refreshToken();
            } else {
              // 권한 거부 시 안내 (선택적)
              showPermissionAlert();
            }
          } else if (
            currentPermission === messaging.AuthorizationStatus.AUTHORIZED || 
            currentPermission === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            // 이미 권한이 있는 경우 토큰 갱신 (쿨다운 적용)
            await refreshToken();
          } else if (currentPermission === messaging.AuthorizationStatus.DENIED) {
            // 권한이 거부된 경우 안내 (선택적)
            showPermissionAlert();
          }
          
          setPermissionInitialized(true);
        } catch (error) {
          console.error('🔴 FCM 초기화 오류:', error);
        }
      };
      
      initializePermissions();
    }
  }, [isLoading]);

  return (
    <SignUpProvider>
      <FontSizeProvider>
        <NavigationContainer ref={navigationRef}>
          {isLoading ? (
            <Splash />
          ) : (
            <>
              <RootStack.Navigator screenOptions={{headerShown: false}}>
                {/* 👥 회원가입 네비게이터 */}
                <RootStack.Screen name="Auth" component={AuthNavigator} />
                
                {/* 🔎 메인 네비게이션 */}
                <RootStack.Screen
                  name="NavigationBar"
                  component={NavigationBar}
                />

                {/* ⚙️ 설정 네비게이션 */}
                <RootStack.Screen name="SettingStack" component={SettingStack} />

                {/* 🖥️ 네비게이션바 없는 화면들 */}
                <RootStack.Screen
                  name="SearchMedicine"
                  component={SearchMedicineScreen}
                />
                <RootStack.Screen
                  name="SearchMedicineResults"
                  component={SearchMedicineResultsScreen}
                />
                <RootStack.Screen
                  name="MedicineDetail"
                  component={MedicineDetailScreen}
                />
                <RootStack.Screen
                  name="MedicineImageDetail"
                  component={MedicineImageDetailScreen}
                />
                <RootStack.Screen
                  name="PrescriptionSearchResults"
                  component={PrescriptionSearchResults}
                />
                <RootStack.Screen
                  name="Notification"
                  component={NotificationScreen}
                />
                <RootStack.Screen
                  name="AddMedicineRoutine"
                  component={AddMedicineRoutineScreen}
                  options={{presentation: 'modal'}}
                />
                <RootStack.Screen
                  name="AddHospitalVisit"
                  component={AddHospitalVisitScreen}
                  options={{presentation: 'modal'}}
                />
                <RootStack.Screen
                  name="SetMedicineRoutine"
                  component={SetMedicineRoutineScreen}
                  options={{presentation: 'modal'}}
                />
                <RootStack.Screen
                  name="RoutineModal"
                  component={RoutineModalNavigator}
                  options={{presentation: 'modal'}}
                />
                <RootStack.Screen
                  name="SetRoutineTime"
                  component={SetRoutineTimeScreen}
                  options={{presentation: 'modal'}}
                />
                <RootStack.Screen
                  name="MedicineList"
                  component={MedicineListScreen}
                />
              </RootStack.Navigator>
              
              {/* 복약 체크 모달 - 조건부 렌더링으로 변경 */}
              <RoutineCheckModal 
                visible={isModalVisible} 
                onClose={closeModal} 
                routineData={routineData} 
              />
            </>
          )}
        </NavigationContainer>
      </FontSizeProvider>
    </SignUpProvider>
  );
};

export default App;