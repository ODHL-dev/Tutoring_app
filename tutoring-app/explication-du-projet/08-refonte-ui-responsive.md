# Refonte UI Responsive - Mise en Forme Mobile + Web

## 📋 Vue d'ensemble

Cette refonte vise à créer une expérience utilisateur cohérente sur mobile et web en utilisant **@expo/vector-icons** pour les icônes vectorielles, un **design system centralisé** avec StyleSheets purs, et une architecture layout responsive compatible React 19.

---

## 🎯 Objectifs

1. **Design unifié** : même palette, typographie, espacements sur mobile et web
2. **Responsivité** : conteneurs adaptatifs, breakpoints web, safe areas mobile
3. **Accessibilité** : contrastes, tailles, navigation au clavier (web)
4. **Performance** : images optimisées, lazy loading, listes virtualisées
5. **Cohérence UX** : parcours clairs, micro-interactions, feedbacks visuels

---

## 🏗️ Architecture de la mise en forme

### 1. **Design System (theme.ts)**

Le fichier `src/styles/theme.ts` centralise :

- **Couleurs** : palette cohérente (primary: indigo, secondary: emerald, accent: amber)
- **Espacements** : système d'échelle (xs: 4px → xxl: 32px)
- **Typographie** : h1 → caption, tailles et poids standardisés
- **Rayons** : sm → full (999px)
- **Ombres** : Platform.select() pour web (boxShadow) et mobile (shadowColor, elevation)
- **Styles globaux** : container, screenContainer, row, centerContent

### 2. **Stratégie Layout**

#### Mobile-first
- Padding horizontal : `spacing.lg` (16px)
- Sections empilées verticalement
- FlatList horizontal pour les listes scrollables
- SafeAreaView pour respecter les encoches/barres

#### Web-responsive
```
content: {
  width: '100%',
  maxWidth: 1100,      // Limite la largeur max
  alignSelf: 'center',  // Centre le contenu
  paddingHorizontal: spacing.lg,
}
```

## 🎨 Système d'Icônes

### Migration vers @expo/vector-icons

**Avant** : Utilisation d'emojis (❌ Inconsistant et mal supporté sur Android)
```tsx
<Text style={styles.icon}>💬</Text>
```

**Après** : Icônes vectorielles via @expo/vector-icons (✅ Consitant cross-platform)
```tsx
import { Feather } from '@expo/vector-icons';
<Icon library="Feather" name="message-circle" size={26} color={colors.primary} />
```

### Collections disponibles

- **Feather** : Icônes épurées (28+ icônes commune)
- **MaterialCommunity** : Collection importante (1000+ icônes)
- **Material Icons** : Material Design standard
- **Ionicons** : Icônes iOS/Android
- **FontAwesome5** : Populaire
- **AntDesign**, **Entypo**, **EvilIcons**

### Utilisation dans les composants

#### Component Icon.tsx (Wrapper)
```tsx
import { Icon, IconLibrary } from '../components/Icon';

<Icon 
  library="Feather"
  name="message-circle" 
  size={26} 
  color={colors.primary} 
/>
```

#### Icônes utilisées

| Composant | Icônes |
|-----------|--------|
| QuickActionButton | message-circle, edit-3, book-open, bar-chart-2 |
| SectionTitle | zap, book |
| StatsWidget | book, clock, target |
| StreakCounter | fire, star |
| CourseCard | star (for ratings) |
| HeaderUser | settings |
| HeroCard | zap, arrow-right |

---

## 🎨 Changements appliqués v2

### 📱 LoginScreen & RegisterScreen

#### Avant
```
- En-tête simple en haut
- Champs alignés à gauche sur toute la largeur
- Padding horizontal minimaliste
- Design linéaire
```

#### Après
```
✨ Branding section
├─ Badge couleur (TUTORIA / DÉMARRER)
├─ Titre accrocheur (Bon retour / Créer un compte)
└─ Sous-titre descriptif

📍 Carte centrée
├─ Maxwidth: 520px (LoginScreen) / 560px (RegisterScreen)
├─ Shadow élevée (elevation: 6)
├─ Border subtle (gray100)
└─ Padding généreux (spacing.xl)

👤 Rôles (RegisterScreen)
├─ Boutons bordurés avec couleur secondaire
├─ Toggle actif/inactif fluide
└─ Flex-wrap pour s'adapter aux petits écrans

🔗 Footer
└─ Navigation vers l'autre écran (centré, lisible)
```

### 🏠 HomeScreen

#### Avant
```
- Sections sans hiérarchie visuelle claire
- Padding incohérent (parfois paddingHorizontal, parfois non)
- Quick actions en ligne sans respirer
- Aucune maxWidth pour web
```

#### Après
```
📐 Conteneur wrapper
├─ maxWidth: 1100px (web)
├─ alignSelf: 'center' (centré sur écrans larges)
└─ Sections organisées avec spacing.xl

📂 Sections structurées
├─ Header (user info + settings)
├─ Streak Counter (XP + motivation)
├─ Quick Actions (4 raccourcis flexibles)
├─ Hero Card (continuer la leçon)
├─ Objectif du jour
├─ Vos cours (FlatList scrollable)
└─ Stats Widget (semaine)
└─ Bouton déconnexion

🎯 Quick Actions
├─ Layout 2 colonnes stable (width: 48%, marginBottom: spacing.md)
├─ Pas de gap conflictuel → justifyContent: 'space-between'
├─ Sur web → 2x2 ou 4x1 selon écran
├─ Icônes vectorielles (Feather) dans wrappers arrondi
└─ Pas de superposition d'éléments

📊 Spacing hiérarchique
├─ Entre sections : spacing.xl (24px)
├─ À l'intérieur : spacing.md/lg (12-16px)
└─ Padding bas (paddingBottom: spacing.xl) pour défilement confortable
```

---

## 🎨 Composants réutilisables

### **TextField**
```tsx
- Label + Input + Error message
- Border couleur error ou gray300
- Placeholder grisé (gray400)
- Padding uniforme (spacing.md)
```

### **Button**
```tsx
- Variantes : primary (indigo), secondary (emerald), outline
- Sizes : sm, md, lg
- fullWidth : flex: 1 pour remplir le conteneur
- État loading : texte → "Chargement..."
- activeOpacity: 0.7 (feedback utilisateur)
```

### **QuickActionButton**
```tsx
- Icon vectoriel dans wrapper arrondi (56x56px)
- Bordure gauche colorée (borderLeftWidth: 4)
- Label centré et lisible
- Feedback opacity sur tap
- Layout : 2 colonnes sur mobile (width: 48%)
- 4 colonnes sur web (auto avec spacing)
```

### **HeroCard**
```tsx
- Badge avec icône zap (Feather)
- Subject + Title + Progress bar
- CTA Button avec icône arrow-right (Feather)
- Shadow md pour se détacher
- Gradient subtle background
```

### **StatsWidget**
```tsx
- Icônes vectorielles dans wrappers colorés (36x36px)
- 3 stats en row avec spacing égal
- Bordure colorée à gauche (borderLeftColor)
- Layout : icon + value (grand) + label (petit)
- Responsive sur petits écrans
```

### **StreakCounter**
```tsx
- Icônes vectorielles (fire, star) dans wrappers colorés (32x32px)
- Deux colonnes : Streak + XP
- Texte de valeur en gros
- Background gray50
- Spacing cohérent
```

### **SectionTitle**
```tsx
- Icône vectorielle (Feather) + Title + Action text
- Row flex avec space-between
- Padding cohérent
- Icônes : zap (Raccourcis), book (Vos cours)
```

---

## 📏 Breakpoints & Responsive

### Mobile (< 576px)
- Padding : 16px (spacing.lg)
- Colonnes : 1
- Font sizes : réduites
- Touch targets : 44px min

### Tablet (576px - 992px)
- Padding : 20px
- Colonnes : 2
- Quick Actions : 2x2

### Desktop (> 992px)
- Max-width : 1100px
- Padding : 24px
- Colonnes : 4
- Quick Actions : 1x4

### Web vs Mobile
```typescript
// Platform.select() utilisé dans les ombres
shadows.md: Platform.select({
  web: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' },
  default: { shadowColor, shadowOffset, elevation },
})
```

---

## 🎯 Principes de Design appliqués

### 1. **Hiérarchie visuelle**
- Tailles de font décroissantes (h1 → caption)
- Couleurs : primary > secondary > gray > gray600
- Espacements amplifiés entre sections

### 2. **Contraste & Accessibilité**
- Couleur de fond : gray50 (très clair)
- Textes : gray900/gray800 (très foncé)
- Ratio WCAG AA minimum respecté

### 3. **Cohérence**
- Même palette partout
- Mêmes radiuses (14-16px)
- Mêmes espacements

### 4. **Feedback utilisateur**
- activeOpacity: 0.7 pour les touchers
- États hover/active pour web (via activeOpacity)
- Transitions fluides

### 5. **Performance**
- FlatList pour les listes longues
- Conteneurs maxWidth limités
- ScrollView optimisée (showsVerticalScrollIndicator: false)

---

## 🚀 Prochaines étapes

### Phase 2 : Polissage UI
- [x] Remplacer emojis par icônes vectorielles
- [x] Fixer layout Quick Actions
- [ ] Améliorer CourseCard avec étoiles animées
- [ ] Ajouter animations de transition (Reanimated)
- [ ] Peaufiner les shadows et radiuses

### Phase 3 : Animation & Transitions
- [ ] Framer Motion pour web
- [ ] React Native Reanimated pour mobile
- [ ] Micro-interactions (hover, tap, swipe)

### Phase 4 : Mode sombre
- [ ] Ajouter colorsDark dans theme.ts
- [ ] Context/Store pour toggle mode
- [ ] Adaptations dans tous les composants

### Phase 5 : Web-specific
- [ ] Navigation web (sidebar / top nav)
- [ ] Keyboard navigation complète
- [ ] Responsive breakpoints raffinés

### Phase 6 : Compléments
- [ ] Variantes de composants (card, badge, etc.)
- [ ] Tokens design avancés (shadows, borders)
- [ ] Loading states et skeletons
- [ ] Gestion des erreurs visuelles

---

## 📝 Fichiers modifiés

| Fichier | Changements |
|---------|------------|
| `src/screens/auth/LoginScreen.tsx` | Branding + card + maxWidth |
| `src/screens/auth/RegisterScreen.tsx` | Branding + role selector + card |
| `src/screens/HomeScreen.tsx` | Sections structurées + Quick Actions layout fixe + icônes vectorielles |
| `src/components/Icon.tsx` | Component wrapper pour @expo/vector-icons |
| `src/components/QuickActionButton.tsx` | Icônes vectorielles + wrapper arrondi |
| `src/components/SectionTitle.tsx` | Support icônes vectorielles |
| `src/components/StatsWidget.tsx` | Icônes vectorielles dans wrappers |
| `src/components/StreakCounter.tsx` | Icônes fire/star vectorielles |
| `src/components/CourseCard.tsx` | Icônes vectorielles + étoiles |
| `src/components/HeroCard.tsx` | Icônes zap et arrow-right |
| `src/components/HeaderUser.tsx` | Icône settings vectorielle |
| `src/styles/theme.ts` | ✓ Existant, inchangé |
| `package.json` | ✓ @expo/vector-icons installé |
| `babel.config.js` | ✓ Config nettoyée (sans NativeWind) |

---

## 🔗 Liens internes

- [01-architecture-generale.md](01-architecture-generale.md)
- [02-state-management.md](02-state-management.md)
- [06-design-system.md](06-design-system.md)

---

## 📚 Ressources

- **@expo/vector-icons** : https://icons.expo.fyi/ (voir tous les noms d'icônes)
- **Expo Icons** : https://github.com/expo/vector-icons
- **React Native Web** : https://necolas.github.io/react-native-web/
- **React Navigation** : https://reactnavigation.org/

---

**Dernière mise à jour** : 29 janvier 2026  
**Statut** : 🟢 En production (Phase 1 complétée, Phase 2 en cours)
