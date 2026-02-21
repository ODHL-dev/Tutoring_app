import React, { useCallback, useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TutoringScreen from '../screens/TutoringScreen';
import EvaluationScreen from '../screens/EvaluationScreen';

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
          Tutoring: 'grasss',
          Chat: 'tutor',
          Lessons: 'lessons',
          Profile: 'profile',
        },
      },
      LessonDetail: 'lessons/:lessonId',
      Exercises: 'exercises',
      Progress: 'progress',
      ClassDetail: 'classes/:classId',
      
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

function EvaluationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Evaluation" component={EvaluationScreen} />
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
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="home" size={size ?? 20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tutoring"
        component={TutoringScreen}
        options={{
          title: 'GRASSS',
          tabBarLabel: 'GRASSS',
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="brain" size={size ?? 20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Tuteur',
          tabBarLabel: 'Tuteur',
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="message-circle" size={size ?? 20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          title: 'Leçons',
          tabBarLabel: 'Leçons',
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="book-open" size={size ?? 20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="user" size={size ?? 20} color={color} />
          ),
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
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Icon library="Feather" name="home" size={size ?? 20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            headerShown: true,
            title: 'Exercices',
          }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            headerShown: true,
            title: 'Progression',
          }}
        />
        <Stack.Screen 
          name="LessonDetail" 
          component={LessonDetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
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
  const { isAuthenticated, user, isRehydrating } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const navigationRef = useNavigationContainerRef();

  const enforceWebRoutes = useCallback(() => {
    if (Platform.OS !== 'web') return;
    if (!navigationRef.isReady()) return;

    const currentRoute = navigationRef.getCurrentRoute();
    if (!currentRoute) return;

    const authRoutes = new Set(['Login', 'Register']);

    if (!isAuthenticated && !authRoutes.has(currentRoute.name)) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }
  }, [isAuthenticated, navigationRef]);

  useEffect(() => {
    enforceWebRoutes();
  }, [enforceWebRoutes]);

  const needsEvaluation =
    isAuthenticated &&
    user?.role === 'student' &&
    user?.studentProfile != null &&
    !user.studentProfile.diagnosticCompleted;

  if (isRehydrating) {
    return null;
  }

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
      {!isAuthenticated ? (
        <AuthStack />
      ) : needsEvaluation ? (
        <EvaluationStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
