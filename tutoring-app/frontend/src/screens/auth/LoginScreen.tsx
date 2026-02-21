import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
// On commente validateLoginForm temporairement car elle vérifie probablement le format email (@)
// import { validateLoginForm } from '../../utils/validation'; 
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { spacing, typography, webMaxWidth } from '../../styles/theme';

export default function LoginScreen({ navigation }: any) {
  const { login, isLoading, error } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  
  // Remplacement de 'email' par 'username'
  const { values, errors, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: { username: '', password: '' },
    onSubmit: async (vals) => {
      // Validation manuelle basique pour autoriser "admin" ou tout autre pseudo
      if (!vals.username.trim()) {
        setFieldError('username', 'Le nom d\'utilisateur est requis');
        return;
      }
      if (!vals.password) {
        setFieldError('password', 'Le mot de passe est requis');
        return;
      }
      
      // Appel de la fonction login avec username
      await login(vals.username, vals.password);
    },
  });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.gray50, position: 'relative' },
    backgroundTop: { position: 'absolute', top: -120, right: -120, width: 260, height: 260, borderRadius: 999, backgroundColor: colors.primaryLight, opacity: 0.6 },
    backgroundBottom: { position: 'absolute', bottom: -140, left: -120, width: 300, height: 300, borderRadius: 999, backgroundColor: colors.secondaryLight, opacity: 0.5 },
    page: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, alignItems: isWide ? 'center' : 'stretch' },
    content: { width: '100%', ...webMaxWidth(1100) },
    shell: { flexDirection: isWide ? 'row' : 'column', alignItems: isWide ? 'stretch' : 'center', gap: spacing.xl },
    panel: { flex: 1, justifyContent: 'center', paddingRight: spacing.xl, display: isWide ? 'flex' : 'none' },
    panelBadge: { alignSelf: 'flex-start', backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginBottom: spacing.md },
    panelBadgeText: { ...typography.label, color: colors.primary, fontWeight: '700', letterSpacing: 0.3 },
    panelTitle: { ...typography.h2, color: colors.gray900, marginBottom: spacing.sm },
    panelSubtitle: { ...typography.body1, color: colors.gray600, marginBottom: spacing.lg },
    panelList: { gap: spacing.sm },
    panelItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    panelDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    panelText: { ...typography.body2, color: colors.gray700 },
    authColumn: { flex: 1, maxWidth: isWide ? 520 : undefined },
    brand: { alignItems: 'center', marginBottom: spacing.xl },
    brandBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999, marginBottom: spacing.md },
    brandBadgeText: { ...typography.label, color: colors.primary, fontWeight: '700', letterSpacing: 0.4 },
    brandTitle: { ...typography.h2, color: colors.gray900, marginBottom: spacing.sm, textAlign: 'center' },
    brandSubtitle: { ...typography.body2, color: colors.gray600, textAlign: 'center' },
    card: { backgroundColor: colors.white, borderRadius: 16, padding: spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6, borderWidth: 1, borderColor: colors.gray100 },
    cardHeader: { marginBottom: spacing.lg },
    cardTitle: { ...typography.h3, color: colors.gray900, marginBottom: spacing.xs },
    cardSubtitle: { ...typography.body2, color: colors.gray600 },
    errorBox: { backgroundColor: colors.errorLight, borderColor: colors.error, borderWidth: 1, borderRadius: 10, padding: spacing.md, marginBottom: spacing.md },
    errorText: { color: colors.error, ...typography.body2 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
    footerText: { ...typography.body2, color: colors.gray600 },
    linkText: { ...typography.body2, color: colors.primary, marginLeft: spacing.xs, fontWeight: '600' },
  });

  return (
    <SafeAreaView style={styles.container}>
      {isWeb && (
        <>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />
        </>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.page} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.shell}>
              <View style={styles.panel}>
                {/* ... Contenu du panel conservé ... */}
                <View style={styles.panelBadge}>
                  <Text style={styles.panelBadgeText}>TUTORAT IA</Text>
                </View>
                <Text style={styles.panelTitle}>Votre apprentissage, plus clair.</Text>
                <Text style={styles.panelSubtitle}>Des parcours sur mesure et un suivi régulier pour progresser.</Text>
                <View style={styles.panelList}>
                  <View style={styles.panelItem}><View style={styles.panelDot} /><Text style={styles.panelText}>Suivi intelligent et objectifs hebdomadaires.</Text></View>
                  <View style={styles.panelItem}><View style={styles.panelDot} /><Text style={styles.panelText}>Sessions IA et exercices adaptes.</Text></View>
                  <View style={styles.panelItem}><View style={styles.panelDot} /><Text style={styles.panelText}>Communautés et entraide entre apprenants.</Text></View>
                </View>
              </View>

              <View style={styles.authColumn}>
                <View style={styles.brand}>
                  <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>TUTORIA</Text></View>
                  <Text style={styles.brandTitle}>Bon retour</Text>
                  <Text style={styles.brandSubtitle}>Continuez votre parcours d'apprentissage personnalise.</Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Connexion</Text>
                    <Text style={styles.cardSubtitle}>Accedez a votre plateforme de tutorat</Text>
                  </View>

                  {error && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  {/* Modification du champ Email vers Nom d'utilisateur */}
                  <TextField
                    label="Nom d'utilisateur"
                    placeholder="Votre identifiant (ex: admin)"
                    value={values.username}
                    onChangeText={(text: string) => handleChange('username', text)}
                    error={errors.username}
                    autoCapitalize="none"
                  />

                  <TextField
                    label="Mot de passe"
                    placeholder="••••••••"
                    value={values.password}
                    onChangeText={(text: string) => handleChange('password', text)}
                    error={errors.password}
                    secureTextEntry
                  />

                  <Button
                    title="Se connecter"
                    onPress={handleSubmit}
                    fullWidth
                    loading={isLoading}
                  />
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Pas de compte ?</Text>
                  <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
                    S'inscrire
                  </Text>
                </View>
              </View>
            </View>
          </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}