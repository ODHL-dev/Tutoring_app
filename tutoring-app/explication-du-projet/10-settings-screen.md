# 🔟 Settings Screen & User Preferences

## 🎯 Objectif

Créer un écran **Settings** complet pour les préférences utilisateur :
- ✅ 4 sections logiques (Préférences, Compte, Support, À propos)
- ✅ Toggles pour Dark Mode et Thème Système
- ✅ Icônes vectorielles cohérentes
- ✅ Navigation fluide depuis HeaderUser
- ✅ État persistant avec AsyncStorage
- ✅ Responsive et accessible

---

## 📋 Table des Matières

1. [Structure Générale](#structure-générale)
2. [Les 4 Sections](#les-4-sections)
3. [Composants Utilisés](#composants-utilisés)
4. [Integration avec themeStore](#integration-avec-themestore)
5. [Navigation](#navigation)
6. [Code Complet](#code-complet)
7. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🏗️ Structure Générale

### Vue d'Ensemble

```
┌─────────────────────────────────────┐
│       SETTINGS SCREEN               │
├─────────────────────────────────────┤
│                                     │
│  📱 SECTION 1: Préférences         │
│  ├─ Notifications  [toggle]        │
│  ├─ Sons          [toggle]        │
│  ├─ Langue        [dropdown]      │
│  ├─ Dark Mode     [toggle]        │
│  └─ Thème Système [toggle]        │
│                                     │
│  👤 SECTION 2: Compte              │
│  ├─ Mon Profil    [→]              │
│  ├─ Sécurité      [→]              │
│  └─ Confidentialité [→]            │
│                                     │
│  🆘 SECTION 3: Support             │
│  ├─ Aide & FAQ    [→]              │
│  ├─ Contacter     [→]              │
│  └─ Évaluer l'app [→]              │
│                                     │
│  ℹ️ SECTION 4: À Propos            │
│  ├─ Version 0.2.0                 │
│  ├─ Conditions    [→]              │
│  └─ Politique     [→]              │
│                                     │
└─────────────────────────────────────┘
```

### Hiérarchie de Navigation

```
RootNavigator (AppStack)
    ↓
MainTabs (5 onglets)
    ├─ HomeScreen
    ├─ ChatScreen
    ├─ LessonsScreen
    ├─ ProfileScreen
    │   └─ HeaderUser
    │       └─ onSettingsPress() → SettingsScreen
    └─ SettingsScreen ← Accès direct via Stack
```

---

## 📱 Les 4 Sections

### 1️⃣ Section Préférences

```typescript
// Notifications
{
  icon: 'bell',
  label: 'Notifications',
  type: 'toggle',
  value: notificationsEnabled,
  onToggle: setNotifications,
  description: 'Recevoir les alertes'
}

// Sons
{
  icon: 'volume-2',
  label: 'Sons',
  type: 'toggle',
  value: soundsEnabled,
  onToggle: setSounds,
  description: 'Sons des notifications'
}

// Langue
{
  icon: 'globe',
  label: 'Langue',
  type: 'value',
  value: 'Français',
  onPress: goToLanguage,
  description: 'Français, English'
}

// Dark Mode (Manual)
{
  icon: 'moon',
  label: 'Mode Sombre',
  type: 'toggle',
  value: isDarkMode,
  onToggle: (val) => setDarkMode(val),
  description: 'Basculer manuel'
}

// Thème Système
{
  icon: 'smartphone',
  label: 'Thème Système',
  type: 'toggle',
  value: useSystemTheme,
  onToggle: (val) => setUseSystemTheme(val),
  description: 'Suivre les paramètres système'
}
```

### 2️⃣ Section Compte

```typescript
// Mon Profil
{
  icon: 'user',
  label: 'Mon Profil',
  type: 'link',
  onPress: () => nav.navigate('Profile'),
  description: 'Nom, email, avatar'
}

// Sécurité
{
  icon: 'lock',
  label: 'Sécurité',
  type: 'link',
  onPress: () => nav.navigate('Security'),
  description: 'Mot de passe, 2FA'
}

// Confidentialité
{
  icon: 'shield',
  label: 'Confidentialité',
  type: 'link',
  onPress: () => nav.navigate('Privacy'),
  description: 'Données personnelles'
}
```

### 3️⃣ Section Support

```typescript
// Aide & FAQ
{
  icon: 'help-circle',
  label: 'Aide & FAQ',
  type: 'link',
  onPress: openFAQ,
  description: 'Questions fréquentes'
}

// Contacter
{
  icon: 'mail',
  label: 'Nous Contacter',
  type: 'link',
  onPress: openContactForm,
  description: 'support@tutoring.com'
}

// Évaluer
{
  icon: 'star',
  label: 'Évaluer l\'App',
  type: 'link',
  onPress: openAppStore,
  description: 'Laisser un avis'
}
```

### 4️⃣ Section À Propos

```typescript
// Version
{
  icon: 'info',
  label: 'Version',
  type: 'value',
  value: '0.2.0',
  onPress: null,
  description: 'Build 42'
}

// Conditions
{
  icon: 'file-text',
  label: 'Conditions',
  type: 'link',
  onPress: openTerms,
  description: 'Lire nos CGU'
}

// Politique
{
  icon: 'shield-alt',
  label: 'Politique de Confidentialité',
  type: 'link',
  onPress: openPrivacyPolicy,
  description: 'Lire notre politique'
}
```

---

## 🧩 Composants Utilisés

### SettingRow Component

```typescript
// Composant réutilisable pour une ligne de setting

interface SettingRowProps {
  icon: string;
  label: string;
  type: 'toggle' | 'link' | 'value';
  value?: boolean | string;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  description?: string;
}

function SettingRow({
  icon,
  label,
  type,
  value,
  onToggle,
  onPress,
  description,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={type === 'link' ? onPress : () => {}}
      activeOpacity={type === 'link' ? 0.7 : 1}
    >
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        {/* Icon */}
        <Icon
          name={icon}
          size={20}
          color={colors.primary}
          style={styles.icon}
        />

        {/* Label & Description */}
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
          {description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>

        {/* Right Side */}
        {type === 'toggle' && (
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            trackColor={{
              false: colors.border,
              true: colors.primaryLight,
            }}
            thumbColor={value ? colors.primary : colors.textTertiary}
          />
        )}

        {type === 'value' && (
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}

        {type === 'link' && (
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
}
```

### SettingSection Component

```typescript
// Composant pour regrouper les settings par catégorie

interface SettingSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={20} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>

      {/* Contenu */}
      <View style={[styles.sectionContent, { borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}
```

---

## 🔗 Integration avec themeStore

### Hook useThemeStore

```typescript
// Accès à l'état du thème

const { isDarkMode, useSystemTheme } = useThemeStore();
const { setDarkMode, setUseSystemTheme } = useThemeStore();

// Utilisation
<Switch
  value={isDarkMode}
  onValueChange={async (val) => {
    await setDarkMode(val);
  }}
/>

<Switch
  value={useSystemTheme}
  onValueChange={async (val) => {
    await setUseSystemTheme(val);
  }}
/>
```

### Logique des Toggles

```typescript
// Quand "Mode Sombre" est activé
// 1. isDarkMode = true
// 2. Sauvegarde en AsyncStorage
// 3. useTheme() re-render tous les composants
// 4. Couleurs changent de light à dark

// Quand "Thème Système" est activé
// 1. useSystemTheme = true
// 2. Sauvegarde en AsyncStorage
// 3. Appearance.addChangeListener() prend le contrôle
// 4. Mode manuel désactivé (isDarkMode ignoré)
// 5. Changements système détectés en temps réel

// Logique de priorité:
const isCurrentlyDark = useSystemTheme
  ? systemColorScheme === 'dark'  // Thème système prioritaire
  : isDarkMode;                    // Sinon, mode manuel
```

---

## 🧭 Navigation

### Depuis HeaderUser

```typescript
// src/components/HeaderUser.tsx

export function HeaderUser() {
  const navigation = useNavigation<RootStackParamList>();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* User Info */}
      <Text>{user.name}</Text>

      {/* Settings Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="settings" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
```

### Dans RootNavigator

```typescript
// src/navigation/RootNavigator.tsx

<AppStack.Screen
  name="Settings"
  component={SettingsScreen}
  options={{
    headerTitle: 'Paramètres',
    headerBackTitle: 'Retour',
  }}
/>
```

---

## 💻 Code Complet

### SettingsScreen.tsx

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../contexts/themeStore';
import { useAuth } from '../hooks/useAuth';

export function SettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { isDarkMode, useSystemTheme, setDarkMode, setUseSystemTheme } =
    useThemeStore();
  const { logout } = useAuth();

  const [notificationsEnabled, setNotifications] = useState(true);
  const [soundsEnabled, setSounds] = useState(true);

  const handleContactUs = () => {
    Linking.openURL('mailto:support@tutoring.com');
  };

  const handleAppStore = () => {
    // iOS: https://apps.apple.com/app/
    // Android: https://play.google.com/store/apps/
    Alert.alert('Évaluer l\'app', 'Ouvrir App Store ?');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://tutoring.com/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://tutoring.com/terms');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      {/* 1️⃣ PRÉFÉRENCES */}
      <SettingSection title="Préférences" icon="sliders">
        <SettingRow
          icon="bell"
          label="Notifications"
          type="toggle"
          value={notificationsEnabled}
          onToggle={setNotifications}
          description="Recevoir les alertes"
        />
        <SettingRow
          icon="volume-2"
          label="Sons"
          type="toggle"
          value={soundsEnabled}
          onToggle={setSounds}
          description="Sons des notifications"
        />
        <SettingRow
          icon="globe"
          label="Langue"
          type="value"
          value="Français"
          description="Français, English"
        />
        <SettingRow
          icon="moon"
          label="Mode Sombre"
          type="toggle"
          value={isDarkMode && !useSystemTheme}
          onToggle={(val) => {
            setDarkMode(val);
            if (val && useSystemTheme) {
              setUseSystemTheme(false); // Désactiver système si mode manuel
            }
          }}
          description="Basculer manuel"
        />
        <SettingRow
          icon="smartphone"
          label="Thème Système"
          type="toggle"
          value={useSystemTheme}
          onToggle={setUseSystemTheme}
          description="Suivre les paramètres système"
        />
      </SettingSection>

      {/* 2️⃣ COMPTE */}
      <SettingSection title="Compte" icon="user">
        <SettingRow
          icon="user"
          label="Mon Profil"
          type="link"
          onPress={() => navigation.navigate('Profile')}
          description="Nom, email, avatar"
        />
        <SettingRow
          icon="lock"
          label="Sécurité"
          type="link"
          onPress={() => Alert.alert('Sécurité', 'Bientôt disponible')}
          description="Mot de passe, 2FA"
        />
        <SettingRow
          icon="shield"
          label="Confidentialité"
          type="link"
          onPress={() => Alert.alert('Confidentialité', 'Bientôt disponible')}
          description="Données personnelles"
        />
      </SettingSection>

      {/* 3️⃣ SUPPORT */}
      <SettingSection title="Support" icon="help-circle">
        <SettingRow
          icon="help-circle"
          label="Aide & FAQ"
          type="link"
          onPress={() => Alert.alert('FAQ', 'Bientôt disponible')}
          description="Questions fréquentes"
        />
        <SettingRow
          icon="mail"
          label="Nous Contacter"
          type="link"
          onPress={handleContactUs}
          description="support@tutoring.com"
        />
        <SettingRow
          icon="star"
          label="Évaluer l\'App"
          type="link"
          onPress={handleAppStore}
          description="Laisser un avis ⭐"
        />
      </SettingSection>

      {/* 4️⃣ À PROPOS */}
      <SettingSection title="À Propos" icon="info">
        <SettingRow
          icon="info"
          label="Version"
          type="value"
          value="0.2.0"
          description="Build 42"
        />
        <SettingRow
          icon="file-text"
          label="Conditions"
          type="link"
          onPress={handleTerms}
          description="Lire nos CGU"
        />
        <SettingRow
          icon="shield-alt"
          label="Politique de Confidentialité"
          type="link"
          onPress={handlePrivacyPolicy}
          description="Lire notre politique"
        />
      </SettingSection>
    </ScrollView>
  );
}

// ====== COMPOSANTS RÉUTILISABLES ======

interface SettingRowProps {
  icon: string;
  label: string;
  type: 'toggle' | 'link' | 'value';
  value?: boolean | string;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  description?: string;
}

function SettingRow({
  icon,
  label,
  type,
  value,
  onToggle,
  onPress,
  description,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={type === 'link' ? onPress : () => {}}
      activeOpacity={type === 'link' ? 0.7 : 1}
    >
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Icon
          name={icon}
          size={20}
          color={colors.primary}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
          {description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>

        {type === 'toggle' && (
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            trackColor={{
              false: colors.border,
              true: colors.primaryLight,
            }}
            thumbColor={value ? colors.primary : colors.textTertiary}
          />
        )}

        {type === 'value' && (
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}

        {type === 'link' && (
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

interface SettingSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={20} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>

      <View style={[styles.sectionContent, { borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

// ====== STYLES ======

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  icon: {
    width: 24,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
  },
});
```

---

## 💡 Bonnes Pratiques

### ✅ À Faire

1. **Grouper les settings par catégories logiques**
   - Préférences, Compte, Support, À propos

2. **Toujours afficher description/aide**
   - Permet comprendre l'utilité

3. **Utiliser icônes cohérentes**
   - @expo/vector-icons Feather

4. **Tester les toggles**
   - Mode Dark/Clair
   - Thème système ON/OFF
   - Persistance AsyncStorage

5. **Rendre accessible**
   - TouchableOpacity activeOpacity
   - Grandes zones de tap (44x44px)
   - Contraste élevé

### ❌ À Éviter

1. **Trop de settings**
   - Max 15 par écran

2. **Settings sans description**
   - Confus pour utilisateur

3. **Oublier de persister**
   - Utiliser themeStore + AsyncStorage

4. **Hardcoder les strings**
   - Utiliser i18n (futur)

---

## 🚀 Démarrage Rapide

### 1. Ajouter Navigation

```typescript
// src/navigation/RootNavigator.tsx
<AppStack.Screen name="Settings" component={SettingsScreen} />
```

### 2. Ajouter Bouton Settings

```typescript
// src/components/HeaderUser.tsx
<TouchableOpacity onPress={() => nav.navigate('Settings')}>
  <Icon name="settings" size={24} />
</TouchableOpacity>
```

### 3. Tester Toggles

- Appuyer sur Dark Mode → Écran change
- Appuyer sur Thème Système → Mode système activé
- Changer dans Settings système → App se met à jour

---

**Prêt pour Settings ? 🎚️**

Lis [11-password-visibility.md](11-password-visibility.md) pour les améliorations TextField.
