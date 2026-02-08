import React, { useCallback, useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TeacherDashboardScreen from '../screens/TeacherDashboardScreen';
import TeacherChatScreen from '../screens/TeacherChatScreen';
import ClassDetailScreen from '../screens/ClassDetailScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import GroupListScreen from '../screens/GroupListScreen';
import GroupInviteScreen from '../screens/GroupInviteScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const linkingConfig = {
  prefixes: ['tutoringapp://', 'https://tutoringapp.com', 'https://www.tutoringapp.com'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      MainTabs: {
        screens: {
          Home: '',
          Chat: 'tutor',
          Lessons: 'lessons',
          Profile: 'profile',
          TeacherHome: 'teacher',
          TeacherChat: 'teacher/tutor',
          TeacherGroups: 'teacher/groups',
          TeacherProfile: 'teacher/profile',
        },
      },
      LessonDetail: 'lessons/:lessonId',
      ClassDetail: 'classes/:classId',
      GroupDetail: 'groups/:groupId',
      GroupInvite: 'join/:code',
      Settings: 'settings',
    },
  },
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray200,
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.gray900,
        headerTitleStyle: {
          color: colors.gray900,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Tuteur',
          tabBarLabel: 'Tuteur',
        }}
      />
      <Tab.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          title: 'Leçons',
          tabBarLabel: 'Leçons',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray200,
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.gray900,
        headerTitleStyle: {
          color: colors.gray900,
        },
      }}
    >
      <Tab.Screen
        name="TeacherHome"
        component={TeacherDashboardScreen}
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="TeacherChat"
        component={TeacherChatScreen}
        options={{
          title: 'Tuteur',
          tabBarLabel: 'Tuteur',
        }}
      />
      <Tab.Screen
        name="TeacherGroups"
        component={GroupListScreen}
        options={{
          title: 'Groupes',
          tabBarLabel: 'Groupes',
        }}
      />
      <Tab.Screen
        name="TeacherProfile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user?.role === 'teacher' ? (
        <>
          <Stack.Screen name="MainTabs" component={TeacherTabs} />
          <Stack.Screen 
            name="ClassDetail" 
            component={ClassDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroupDetail"
            component={GroupDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroupInvite"
            component={GroupInviteScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="LessonDetail" 
            component={LessonDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroupDetail"
            component={GroupDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroupInvite"
            component={GroupInviteScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Paramètres',
          headerBackTitle: 'Retour',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.gray900,
          headerTitleStyle: {
            color: colors.gray900,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const navigationRef = useNavigationContainerRef();

  const enforceWebRoutes = useCallback(() => {
    if (Platform.OS !== 'web') return;
    if (!navigationRef.isReady()) return;

    const currentRoute = navigationRef.getCurrentRoute();
    if (!currentRoute) return;

    const authRoutes = new Set(['Login', 'Register']);
    const teacherOnlyRoutes = new Set([
      'TeacherHome',
      'TeacherChat',
      'TeacherGroups',
      'TeacherProfile',
      'ClassDetail',
    ]);

    if (!isAuthenticated && !authRoutes.has(currentRoute.name)) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    if (isAuthenticated && user?.role !== 'teacher' && teacherOnlyRoutes.has(currentRoute.name)) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }, [isAuthenticated, navigationRef, user?.role]);

  useEffect(() => {
    enforceWebRoutes();
  }, [enforceWebRoutes]);
  
  console.log('=== RootNavigator rendering ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isDarkMode:', isDarkMode);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linkingConfig}
      onReady={enforceWebRoutes}
      onStateChange={enforceWebRoutes}
      theme={{
        dark: isDarkMode,
        colors: {
          primary: colors.primary,
          background: colors.white,
          card: colors.white,
          text: colors.gray900,
          border: colors.gray200,
          notification: colors.error,
        },
      }}
    >
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
