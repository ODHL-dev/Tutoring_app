# 🎨 Design System & Styles

## Qu'est-ce qu'un Design System ?

Un **Design System** est un ensemble cohérent et réutilisable de :
- **Couleurs** : Palette standardisée
- **Typography** : Polices et tailles de texte
- **Spacing** : Marges et padding
- **Ombre & Radius** : Profondeur et arrondi
- **Composants** : Boutons, champs, cartes réutilisables

### Avantages

| Avantage | Bénéfice |
|----------|----------|
| **Cohérence** | Même look partout |
| **Rapidité** | Pas besoin de redéfinir styles |
| **Maintenabilité** | Change une couleur → partout change |
| **Évolutivité** | Facile de ajouter nouveaux composants |
| **Accessibilité** | Contraste suffisant, tailles lisibles |

---

## 🎯 Architecture Design System

```
┌─────────────────────────────────────┐
│    Application (Screens/Components) │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│    Design System (src/styles)       │
│                                     │
│  ├── colors                         │
│  ├── typography                     │
│  ├── spacing                        │
│  ├── borderRadius                   │
│  ├── shadows                        │
│  └── globalStyles                   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│    React Native StyleSheet          │
│    (Compilé en CSS pour web)        │
└─────────────────────────────────────┘
```

---

## 🎨 Fichier Theme (src/styles/theme.ts)

### 1. Couleurs

```typescript
export const colors = {
  // Primary (Indigo - Logo/CTA)
  primary: '#6366F1',
  primaryLight: '#E0E7FF',

  // Secondary (Émeraude - Actions)
  secondary: '#10B981',
  secondaryLight: '#D1FAE5',

  // Accent (Ambre - Warning)
  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  // Neutrals (Grays - Texte, background)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Status
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

// Utilisation :
<Text style={{ color: colors.primary }}>Texte bleu</Text>
<View style={{ backgroundColor: colors.primaryLight }}>...</View>
```

### Palette Expliquée

```
┌──────────────────────────────────────────┐
│  Primary (Indigo) - #6366F1              │ ← Buttons, Links, Main action
├──────────────────────────────────────────┤
│  Secondary (Émeraude) - #10B981          │ ← Success, Positive action
├──────────────────────────────────────────┤
│  Accent (Ambre) - #F59E0B                │ ← Warning, Attention
├──────────────────────────────────────────┤
│  Grays (Multiple shades)                 │ ← Text, BG, Borders
│  gray50 (lightest) → gray900 (darkest)   │
├──────────────────────────────────────────┤
│  Status Colors                           │
│  - Error (Rouge)   - Success (Vert)      │
│  - Warning (Orange) - Info (Bleu)        │
└──────────────────────────────────────────┘
```

### 2. Typography

```typescript
export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',  // Bold
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',  // Semi-bold
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',  // Regular
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',  // Semi-bold for emphasis
    lineHeight: 18,
  },
});

// Utilisation :
<Text style={typography.h1}>Bienvenue</Text>
<Text style={typography.body1}>Contenu normal</Text>
<Text style={typography.caption}>Petit texte</Text>
```

**Hiérarchie Typographique** :
- h1 : Titres principaux (34px)
- h2, h3, h4 : Sous-titres (28, 24, 20px)
- body1, body2 : Contenu (16, 14px)
- caption : Petit texte, aide (12px)
- label : Labels de formulaire (12px bold)

### 3. Spacing

```typescript
export const spacing = {
  xs: 4,      // Minimal space
  sm: 8,      // Small
  md: 12,     // Medium (par défaut)
  lg: 16,     // Large
  xl: 24,     // Extra large
  xxl: 32,    // Double extra large
};

// Utilisation :
<View style={{ marginBottom: spacing.lg }}>  {/* 16 */}
<View style={{ padding: spacing.md }}>       {/* 12 */}
<View style={{ marginTop: spacing.xl }}>     {/* 24 */}
```

**Système 4-8** : Chaque valeur est multiple de 4, facile à combiner

### 4. Border Radius

```typescript
export const borderRadius = {
  sm: 4,      // Légèrement arrondi
  md: 8,      // Normal
  lg: 12,     // Arrondi
  xl: 16,     // Très arrondi
  full: 9999, // Complètement circulaire
};

// Utilisation :
<View style={{ borderRadius: borderRadius.md }}>
<Image style={{ borderRadius: borderRadius.full }}>  {/* Avatar circulaire */}
```

### 5. Ombres

```typescript
export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,  // Android
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
});

// Utilisation :
<View style={{ ...shadows.md }}>  {/* Card avec ombre moyenne */}
```

### 6. Global Styles

```typescript
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});

// Utilisation :
<SafeAreaView style={globalStyles.screenContainer}>
  <View style={[globalStyles.row, globalStyles.spaceBetween]}>
    {/* ... */}
  </View>
</SafeAreaView>
```

---

## 📱 Utilisation dans les Composants

### Button.tsx

```typescript
import { colors, typography, spacing, borderRadius, shadows } from '@styles/theme';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) {
  const getBackgroundColor = () => {
    if (disabled) return colors.gray300;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    return 'transparent';
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      ...shadows.sm,
    },
    text: {
      color: colors.white,
      ...typography.label,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

// Utilisation :
<Button title="Se connecter" variant="primary" />
<Button title="Plus tard" variant="secondary" />
<Button title="Annuler" disabled />
```

### TextField.tsx

```typescript
export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.label,
      color: colors.gray700,
      marginBottom: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: error ? colors.error : colors.gray300,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body2,
      backgroundColor: colors.white,
      color: colors.gray900,
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        value={value}
        onChangeText={onChangeText}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Utilisation :
<TextField
  label="Email"
  placeholder="votre@email.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

---

## 🎨 Exemples de Composants Customisés

### Card

```typescript
import { colors, spacing, shadows, borderRadius } from '@styles/theme';

export function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          ...shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Utilisation :
<Card>
  <Text style={typography.h4}>Titre</Text>
  <Text style={typography.body2}>Contenu</Text>
</Card>
```

### Badge

```typescript
export function Badge({ text, variant = 'primary' }) {
  const getBgColor = (v) => {
    if (v === 'primary') return colors.primaryLight;
    if (v === 'success') return colors.successLight;
    if (v === 'error') return colors.errorLight;
    return colors.gray100;
  };

  const getTextColor = (v) => {
    if (v === 'primary') return colors.primary;
    if (v === 'success') return colors.success;
    if (v === 'error') return colors.error;
    return colors.gray600;
  };

  return (
    <View
      style={{
        backgroundColor: getBgColor(variant),
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: getTextColor(variant),
          ...typography.caption,
          fontWeight: '600',
        }}
      >
        {text}
      </Text>
    </View>
  );
}

// Utilisation :
<Badge text="Débutant" variant="primary" />
<Badge text="Réussi" variant="success" />
<Badge text="Erreur" variant="error" />
```

---

## 🌓 Dark Mode (Futur)

```typescript
// Pouvoir switcher entre light/dark
export function getTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    return {
      colors: {
        primary: '#818CF8',      // Lighter indigo
        background: colors.gray900,
        text: colors.white,
      },
    };
  }

  return {
    colors: {
      primary: colors.primary,
      background: colors.white,
      text: colors.gray900,
    },
  };
}
```

---

## 📏 Responsive Design

### Mobile-First Approach

```typescript
export function ResponsiveText({ children }) {
  const isTablet = useWindowDimensions().width > 600;

  return (
    <Text
      style={{
        ...typography[isTablet ? 'h2' : 'h3'],
        marginBottom: spacing[isTablet ? 'xl' : 'lg'],
      }}
    >
      {children}
    </Text>
  );
}
```

---

## 🔄 Évolution du Design System

### Ajouter une Nouvelle Couleur

```typescript
// 1. Ajouter à theme.ts
colors = {
  // ... existing colors
  teal: '#14B8A6',
  tealLight: '#CCFBF1',
};

// 2. Utiliser partout immédiatement
<Button variant="teal" />
<Badge variant="teal" />
```

### Ajouter une Nouvelle Typography

```typescript
// 1. Ajouter à theme.ts
typography = {
  // ... existing
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
};

// 2. Utiliser
<Text style={typography.subtitle}>Sous-titre</Text>
```

---

## 🎯 Points Clés

✅ **Centralisation** - Une seule source de vérité  
✅ **Cohérence** - Même look partout  
✅ **Maintenabilité** - Change une fois, impacte tout  
✅ **Évolutivité** - Facile d'ajouter nouveaux styles  
✅ **Performance** - StyleSheet optimisé  

---

## 📊 Résumé Design System

| Element | Fichier | Utilisation |
|---------|---------|-------------|
| **Couleurs** | colors | Texte, background, buttons |
| **Typography** | typography | h1-h4, body1-2, label |
| **Spacing** | spacing | Padding, margin, gap |
| **Radius** | borderRadius | Arrondi coins |
| **Ombres** | shadows | Profondeur cartes |
| **Global** | globalStyles | Containers, flex layouts |

---

**Status** : ✅ Design system professionnel et scalable
