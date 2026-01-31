# 🗺️ Navigation et Routing

## Qu'est-ce que React Navigation ?

**React Navigation** est la librairie standard pour la navigation dans les apps React Native. Elle gère :
- **Stack Navigation** : Empiler des écrans (comme une pile de cartes)
- **Tab Navigation** : Navigation en bas/haut avec onglets
- **Drawer Navigation** : Menu latéral (hamburger)
- **Transitions** : Animations entre écrans
- **Deep Linking** : URLs profonds

### Avantages

| Avantage | Bénéfice |
|----------|----------|
| **Cross-Platform** | Fonctionne iOS, Android, Web |
| **Performance** | Optimisé, lazy loading |
| **Animations Natives** | Transitions fluides |
| **TypeScript Support** | Type-safe navigation |
| **Community Large** | Beaucoup de ressources |

---

## 🏗️ Architecture de Navigation

Notre app a une structure **simple mais puissante** :

```
RootNavigator
  ├── AuthStack (Si NOT logged)
  │   ├── LoginScreen
  │   └── RegisterScreen
  │
  └── AppStack (Si logged)
      └── TabNavigator
          ├── HomeScreen
          ├── ChatScreen
          ├── LessonsScreen
          └── ProfileScreen
```

### Visual Flow

```
App démarre
    ↓
RootNavigator lit : isAuthenticated ?
    ↓
    ├─→ false  → AuthStack → (Login / Register)
    │
    └─→ true   → AppStack → (Tabs)
                    ├── Home
                    ├── Chat
                    ├── Lessons
                    └── Profile
```

---

## 🔧 Code RootNavigator Détaillé

### Fichier : src/navigation/RootNavigator.tsx

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@hooks/useAuth';

// Import des écrans
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import HomeScreen from '@screens/HomeScreen';
import ChatScreen from '@screens/ChatScreen';
import LessonsScreen from '@screens/LessonsScreen';
import ProfileScreen from '@screens/ProfileScreen';

// Crée les navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
```

### AuthStack (Authentification)

```typescript
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,  // Pas de header
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
    </Stack.Navigator>
  );
}

// Fonctionnement :
// 1. AuthStack démarre sur LoginScreen
// 2. User clique "S'inscrire" → navigate('Register')
// 3. RegisterScreen s'affiche avec transition
// 4. User clique "Retour" ou "Se connecter" → navigate('Login')
```

### AppStack (Tab Navigation)

```typescript
function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,  // Header visible
        tabBarActiveTintColor: '#6366F1',  // Couleur active (Indigo)
        tabBarInactiveTintColor: '#9CA3AF', // Couleur inactive (Gray)
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            // Icon ici (Ionicons, FontAwesome, etc.)
            <Text style={{ color, fontSize: 24 }}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Tuteur',
          tabBarLabel: 'Tuteur',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          title: 'Leçons',
          tabBarLabel: 'Leçons',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📖</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Fonctionnement :
// 1. AppStack affiche 4 onglets en bas
// 2. User peut appuyer sur n'importe quel onglet
// 3. Écran change instantanément
// 4. Tab actif = couleur indigo, inactive = gris
```

### RootNavigator Principal

```typescript
export function RootNavigator() {
  // Récupère isAuthenticated du store
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Logique :
// - Si isAuthenticated = false → Affiche AuthStack (Login/Register)
// - Si isAuthenticated = true  → Affiche AppStack (Tabs avec contenu)
// - Quand status change → RootNavigator se re-render → Navigation change
```

### Integration dans App.tsx

```typescript
// src/App.tsx
import { RootNavigator } from '@navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </View>
  );
}
```

---

## 📱 Navigation entre Écrans

### De LoginScreen vers RegisterScreen

```typescript
// src/screens/auth/LoginScreen.tsx
export default function LoginScreen({ navigation }) {
  return (
    <View>
      <Text>Pas de compte ?</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
      >
        <Text>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

// Props navigation fourni automatiquement par React Navigation
// navigation.navigate(screenName) → change d'écran
```

### De RegisterScreen vers LoginScreen

```typescript
// src/screens/auth/RegisterScreen.tsx
export default function RegisterScreen({ navigation }) {
  return (
    <View>
      <Text>Déjà inscrit ?</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
      >
        <Text>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Entre les Onglets (AppStack)

```typescript
// n'importe quel écran peut naviguer vers les autres onglets
const { user } = useAuth();

const goToChat = () => {
  navigation.navigate('Chat');
};

const goToLessons = () => {
  navigation.navigate('Lessons');
};

const goToProfile = () => {
  navigation.navigate('Profile');
};

// Ou les utilisateurs appuient directement sur les onglets
```

---

## 🔄 Transitions et Animations

### Stack Navigator Animations

```typescript
// Animation entre écrans (gauche vers droite par défaut)
<Stack.Navigator
  screenOptions={{
    animationEnabled: true,
    cardStyle: { backgroundColor: '#fff' },
    gestureEnabled: true, // Swipe back gesture (iOS)
  }}
>
  {/* ... */}
</Stack.Navigator>
```

### Custom Transitions

```typescript
// Animation custom : bottom-to-top
<Stack.Navigator
  screenOptions={{
    animationEnabled: true,
    // Début en bas, monte vers le haut
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [{
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        }],
      },
    }),
  }}
>
```

---

## 🎯 Linking Profond (Deep Linking)

### Accéder à un écran via URL

```typescript
// App démarre avec une URL
// tutoring-app://chat → Ouvre ChatScreen

const linking = {
  prefixes: ['tutoring-app://'],
  config: {
    screens: {
      Home: 'home',
      Chat: 'chat',
      Lessons: 'lessons',
      Profile: 'profile',
      Login: 'login',
      Register: 'register',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>

// Utilisation :
// const url = 'tutoring-app://chat';
// Linking.openURL(url); // Ouvre ChatScreen
```

---

## 📊 Passage de Paramètres

### Entre écrans avec Stack Navigator

```typescript
// Envoyer paramètres
const goToUserProfile = (userId) => {
  navigation.navigate('UserProfile', { userId, userName: 'Jean' });
};

// Recevoir paramètres
export default function UserProfileScreen({ route }) {
  const { userId, userName } = route.params;

  return <Text>Profile de {userName} ({userId})</Text>;
}
```

### Entre onglets (Tab Navigator)

```typescript
// Moins courant, mais possible
navigation.navigate('Chat', { 
  conversation: 'Math',
  tutorId: '123' 
});

// Ou via state global (Zustand)
const { setCurrentTopic } = useStudentStore();
setCurrentTopic('Math');
navigation.navigate('Chat');
```

---

## 🔐 Navigation Basée sur Authentification

### C'est la CLÉ du système

```typescript
// RootNavigator.tsx
export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Pendant que le store charge les données
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Navigation conditionnelle
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // User connecté → Affiche l'app
        <AppStack />
      ) : (
        // User NOT connecté → Affiche login/register
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

// Cycle complet :
// 1. User NOT authenticated → Voit AuthStack
// 2. User s'connecte → isAuthenticated = true
// 3. RootNavigator re-render
// 4. AppStack s'affiche
// 5. User voit HomeScreen + Tabs
```

---

## 🛡️ Bonnes Pratiques Navigation

### 1. Ne PAS Passer d'Objets Complexes

```typescript
// ❌ MAUVAIS : Objet complexe
navigation.navigate('Detail', { user: complexUserObject });

// ✅ BON : Juste l'ID
navigation.navigate('Detail', { userId: '123' });
// Écran fetch les données complètes
```

### 2. Gérer le Bouton Retour

```typescript
// ❌ MAUVAIS : Ignorer le back
<Stack.Screen name="Login" component={LoginScreen} />

// ✅ BON : Empêcher le back si nécessaire
<Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={{
    headerLeft: null, // Pas de bouton retour
  }}
/>
```

### 3. Éviter la Duplication de Navigation

```typescript
// ❌ MAUVAIS : Multiple navigators confus
<Stack.Navigator>
  <Stack.Screen name="Home" component={<Stack.Navigator>...</Stack.Navigator>} />
</Stack.Navigator>

// ✅ BON : Structure claire et hiérarchique
<Tab.Navigator>
  <Tab.Screen name="HomeStack" component={HomeStack} />
  <Tab.Screen name="ChatStack" component={ChatStack} />
</Tab.Navigator>
```

---

## 🚀 Évolution Future

### Drawer Navigation (Menu latéral)

```typescript
// Ajouter un menu hamburger
const Drawer = createDrawerNavigator();

function DrawerStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="AppTabs" component={AppStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
}
```

### Stack dans Tab (Nested Navigation)

```typescript
// Chaque tab peut avoir sa propre navigation stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
    </Stack.Navigator>
  );
}

// Utilisé dans Tab Navigator
<Tab.Screen name="HomeTab" component={HomeStack} />
```

---

## 📊 Résumé Structure Navigation

| Niveau | Type | Écrans |
|--------|------|--------|
| **1** | RootNavigator | Décide Auth vs App |
| **2** | AuthStack | Login, Register |
| **2** | AppStack (Tabs) | 4 onglets |
| **3** | Chaque Tab | Contenu |

---

## 🎯 Points Clés

✅ **Automatique** - RootNavigator change selon isAuthenticated  
✅ **Simple** - 2 navigateurs clairement séparés  
✅ **Scalable** - Facile d'ajouter des écrans  
✅ **Type-Safe** - TypeScript supporté  
✅ **Cross-Platform** - Fonctionne mobile + web  

---

**Status** : ✅ Navigation intuitive et bien structurée
