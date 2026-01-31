# 1️⃣1️⃣ Password Visibility & Enhanced TextField

## 🎯 Objectif

Améliorer le composant **TextField** avec :
- ✅ Toggle voir/masquer mot de passe
- ✅ Icônes eye/eye-off dynamiques
- ✅ Gestion d'état transparente
- ✅ UX sécurisée et accessible
- ✅ Utilisable dans LoginScreen et RegisterScreen

---

## 📋 Table des Matières

1. [Pourquoi la Visibilité](#pourquoi-la-visibilité)
2. [Architecture TextField](#architecture-textfield)
3. [Implémentation du Toggle](#implémentation-du-toggle)
4. [Props et Options](#props-et-options)
5. [Utilisation dans Écrans](#utilisation-dans-écrans)
6. [Sécurité](#sécurité)
7. [Accessibilité](#accessibilité)
8. [Code Complet](#code-complet)
9. [Bonnes Pratiques](#bonnes-pratiques)

---

## 👁️ Pourquoi la Visibilité

### Bénéfices UX

| Problème | Solution |
|----------|----------|
| **Typos invisibles** | Voir le mot de passe pendant l'entrée |
| **Mémorisation** | Vérifier avant de valider |
| **Confiance** | Utilisateur a contrôle |
| **Accessibilité** | Option pour ceux qui ne peuvent pas voir |
| **Standard Modern** | Attendu par tous les apps modernes |

### Statistiques

```
✅ 80% des apps modernes ont show/hide password
✅ Réduit les erreurs de saisie de 25%
✅ Augmente la confiance utilisateur
✅ UX standard dans iOS/Android
```

### Cas d'Utilisation

```
1. LoginScreen
   - Utilisateur veut vérifier avant "Login"
   - Peut voir/masquer le mot de passe

2. RegisterScreen
   - Confirmation de mot de passe
   - Voir les deux pendant saisie

3. SettingsScreen (futur)
   - Changer mot de passe
   - Voir ancien et nouveau
```

---

## 🏗️ Architecture TextField

### Structure Actuelle

```typescript
interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  secureTextEntry?: boolean;  // ← NEW: Activer mode password
  editable?: boolean;
  numberOfLines?: number;
}
```

### Avant le Toggle

```typescript
// TextField AVANT (pas de toggle)

function TextField({
  secureTextEntry = false,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();

  return (
    <View>
      <TextInput
        secureTextEntry={secureTextEntry}  // Masque toujours
        // ... autres props
      />
    </View>
  );
}
```

### Après le Toggle

```typescript
// TextField APRÈS (avec toggle)

function TextField({
  secureTextEntry = false,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Si secureTextEntry = true, montrer toggle
  const shouldShowToggle = secureTextEntry;
  const isPasswordVisible = showPassword;

  return (
    <View>
      <TextInput
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        // ... autres props
      />

      {shouldShowToggle && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={isPasswordVisible ? 'eye' : 'eye-off'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
```

---

## 🔄 Implémentation du Toggle

### État du Composant

```typescript
const [showPassword, setShowPassword] = useState(false);

// showPassword = true  → Montrer texte brut (eye icon)
// showPassword = false → Masquer texte (eye-off icon)
```

### Logique secureTextEntry

```typescript
// Prop secureTextEntry du TextInput

<TextInput
  secureTextEntry={secureTextEntry && !showPassword}
  // ├─ Si secureTextEntry = false
  // │   → secureTextEntry = false (toujours)
  // │
  // └─ Si secureTextEntry = true
  //     ├─ Si showPassword = true
  //     │   → secureTextEntry = false (MONTRER le texte)
  //     └─ Si showPassword = false
  //         → secureTextEntry = true (MASQUER le texte)
/>
```

### Icône Dynamique

```typescript
const toggleButton = (
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <Icon
      name={showPassword ? 'eye' : 'eye-off'}
      size={20}
      color={colors.textSecondary}
    />
  </TouchableOpacity>
);

// showPassword = true  → Icon 'eye' (ouvert)
// showPassword = false → Icon 'eye-off' (fermé)
```

### Positioning CSS

```typescript
{/* Container flexbox avec icône à droite */}
<View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    // ...
  />
  
  {shouldShowToggle && (
    <View style={styles.toggleButtonContainer}>
      {toggleButton}
    </View>
  )}
</View>

// Styles
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingRight: 40,  // Espace pour icône
  },
  toggleButtonContainer: {
    padding: 10,
    justifyContent: 'center',
  },
});
```

---

## ⚙️ Props et Options

### Props TextField

```typescript
interface TextFieldProps {
  // Texte
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;

  // Erreurs
  error?: string;

  // Clavier
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;  // ← Active le toggle

  // Édition
  editable?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
}
```

### Utilisation avec secureTextEntry

```typescript
// Pour champs normaux (pas de toggle)
<TextField
  label="Nom"
  placeholder="Votre nom"
  value={name}
  onChangeText={setName}
  // secureTextEntry absent ou false
/>

// Pour champs password (avec toggle)
<TextField
  label="Mot de passe"
  placeholder="Entrez votre mot de passe"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}  // ← Active eye toggle
/>

// Pour champs email (clavier adapté, pas de toggle)
<TextField
  label="Email"
  placeholder="exemple@tutoring.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

---

## 📱 Utilisation dans Écrans

### LoginScreen

```typescript
import { TextField } from '../components/TextField';
import { useForm } from '../hooks/useForm';

export function LoginScreen() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    email: '',
    password: '',
  });

  return (
    <ScrollView>
      {/* Email */}
      <TextField
        label="Email"
        placeholder="exemple@tutoring.com"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        // PAS de secureTextEntry
      />

      {/* Password avec Toggle 👁️ */}
      <TextField
        label="Mot de passe"
        placeholder="Entrez votre mot de passe"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry={true}  // ← Active le toggle
      />

      {/* Submit */}
      <Button onPress={handleSubmit} title="Se Connecter" />
    </ScrollView>
  );
}
```

### RegisterScreen

```typescript
export function RegisterScreen() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <ScrollView>
      {/* Name */}
      <TextField
        label="Nom complet"
        placeholder="Jean Dupont"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
      />

      {/* Email */}
      <TextField
        label="Email"
        placeholder="exemple@tutoring.com"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
      />

      {/* Password avec Toggle 👁️ */}
      <TextField
        label="Mot de passe"
        placeholder="Minimum 8 caractères"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry={true}  // ← Active le toggle
      />

      {/* Confirm Password avec Toggle 👁️ */}
      <TextField
        label="Confirmer le mot de passe"
        placeholder="Entrez à nouveau"
        value={values.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        error={errors.confirmPassword}
        secureTextEntry={true}  // ← Active le toggle
      />

      {/* Submit */}
      <Button onPress={handleSubmit} title="S'Inscrire" />
    </ScrollView>
  );
}
```

### Flux Complet

```
┌────────────────────────────────────────┐
│  LoginScreen                           │
├────────────────────────────────────────┤
│                                        │
│  [Email input]                        │
│                                        │
│  [Password input] ⚫👁️ ← Click toggle  │
│                                        │
│  1. showPassword = true               │
│  2. secureTextEntry = false           │
│  3. Texte visible                     │
│  4. Icône = 'eye' (ouvert)            │
│                                        │
│  Click à nouveau:                     │
│                                        │
│  [Password input] ⭕👁️‍🗨️                 │
│                                        │
│  1. showPassword = false              │
│  2. secureTextEntry = true            │
│  3. Texte masqué                      │
│  4. Icône = 'eye-off' (fermé)         │
│                                        │
│  [Login Button]                       │
│                                        │
└────────────────────────────────────────┘
```

---

## 🔐 Sécurité

### Points de Vigilance

| Aspect | Implémentation |
|--------|-----------------|
| **Presse-papiers** | TextInput gère natif (pas de copy) |
| **Screenshot** | Pas d'action spéciale |
| **Memory dump** | Impossible depuis app (natif) |
| **Cache clavier** | TextInput.autoCapitalize = 'none' |
| **Texte brut** | React Navigation ne log pas |

### Bonnes Pratiques

```typescript
// ✅ BON
<TextField
  secureTextEntry={true}  // Toujours utiliser
  placeholder="Mot de passe"
  autoCapitalize="none"
/>

// ❌ MAUVAIS
<TextField
  secureTextEntry={false}
  // Password visible par défaut!
/>
```

### Validation Avant Submit

```typescript
// ValidationUtils

export function validatePassword(password: string): string[] {
  const errors = [];

  if (password.length < 8) {
    errors.push('Minimum 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins 1 majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins 1 minuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Au moins 1 chiffre');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Au moins 1 caractère spécial');
  }

  return errors;
}
```

---

## ♿ Accessibilité

### Keyboard Navigation

```typescript
// Écran de login accessible

// 1. Email input → Tab → Focus email
// 2. Tab → Focus password input
// 3. Tab → Focus toggle button
// 4. Enter/Space → Toggle show/hide
// 5. Tab → Focus login button
// 6. Enter → Submit

<TextField
  accessible={true}
  accessibilityLabel="Champ email"
  accessibilityHint="Entrez votre adresse email"
/>
```

### Screen Reader Support

```typescript
// Pour voir/masquer password
<TouchableOpacity
  onPress={() => setShowPassword(!showPassword)}
  accessible={true}
  accessibilityLabel={showPassword ? 'Masquer mot de passe' : 'Afficher mot de passe'}
  accessibilityRole="button"
  accessibilityState={{ expanded: showPassword }}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
  <Icon name={showPassword ? 'eye' : 'eye-off'} />
</TouchableOpacity>
```

### Zone de Tap

```typescript
// Minimum 44x44 pixels (Apple HIG)

const styles = StyleSheet.create({
  toggleButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## 💻 Code Complet

### TextField.tsx

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import Icon from './Icon';
import { useTheme } from '../hooks/useTheme';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean;
  numberOfLines?: number;
  testID?: string;
}

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  multiline = false,
  secureTextEntry = false,
  editable = true,
  numberOfLines = 1,
  testID,
}: TextFieldProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Afficher toggle que si c'est un champ password
  const shouldShowToggle = secureTextEntry;
  const isPasswordVisible = showPassword;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? colors.error : colors.text,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <RNTextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingRight: shouldShowToggle ? 44 : 12,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          // ✅ Toggle du mode password
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          testID={testID}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* ✅ Bouton Eye/Eye-off */}
        {shouldShowToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityLabel={
              isPasswordVisible ? 'Masquer mot de passe' : 'Afficher mot de passe'
            }
            accessibilityRole="button"
            accessibilityState={{ expanded: isPasswordVisible }}
            style={styles.toggleButton}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Message d'erreur */}
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  toggleButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
```

---

## 💡 Bonnes Pratiques

### ✅ À Faire

1. **Toujours utiliser secureTextEntry pour passwords**
   ```typescript
   <TextField secureTextEntry={true} />
   ```

2. **Tester sur les deux thèmes**
   - Light: eye en noir
   - Dark: eye en gris clair

3. **Icônes cohérentes**
   - Feather 'eye' et 'eye-off'

4. **Hit area suffisante**
   - Minimum 44x44 pixels

5. **Accessibilité**
   ```typescript
   accessibilityLabel="Afficher/masquer mot de passe"
   ```

### ❌ À Éviter

1. **Montrer password par défaut**
   ```typescript
   // ❌ Non
   <TextInput secureTextEntry={false} />
   ```

2. **Oublier la validation**
   - Vérifier force du password
   - Regex ou validateur

3. **Icônes non cohérentes**
   - Utiliser toujours Feather

4. **Pas d'autoCapitalize='none'**
   - Clavier qui propose majuscules

---

## 🚀 Démarrage Rapide

### 1. Ajouter Toggle à TextField

```typescript
// src/components/TextField.tsx
const [showPassword, setShowPassword] = useState(false);
const secureEntry = secureTextEntry && !showPassword;
```

### 2. Utiliser dans LoginScreen

```typescript
<TextField
  label="Mot de passe"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}  // ← Active le toggle
/>
```

### 3. Tester

- Appuyer sur eye → Texte visible
- Appuyer sur eye-off → Texte masqué
- Fonctionne sur les deux thèmes

---

## 📚 Ressources

- **TextInput API**: https://reactnative.dev/docs/textinput
- **OWASP Password Security**: https://cheatsheetseries.owasp.org/
- **Accessibility**: https://reactnative.dev/docs/accessibility

---

**Prêt pour les passwords en toute sécurité ? 🔐**

Lis [09-dark-mode.md](09-dark-mode.md) si tu veux comprendre le système de thème.
