import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Modal, useWindowDimensions,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validateName, validatePassword } from '../../utils/validation';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Icon } from '../../components/Icon';
import { spacing, typography, webMaxWidth } from '../../styles/theme';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading, error } = useAuth();
  const { colors } = useTheme();
  const [profession, setProfession] = useState<'student' | 'teacher'>('student');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  const [selectConfig, setSelectConfig] = useState<{
    title: string; options: string[]; onSelect: (value: string) => void;
  } | null>(null);

  const primaryClasses = useMemo(() => ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'], []);
  const secondaryClasses = useMemo(() => ['6e', '5e', '4e', '3e', '2nde', '1ere', 'Terminale'], []);
  const seriesOptions = useMemo(() => ['A', 'C', 'D'], []);

  const { values, errors, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: {
      username: '', // <-- AJOUT DU USERNAME
      firstName: '',
      lastName: '',
      email: '',
      classCycle: '',
      password: '',
      confirmPassword: '',
      classLevel: '',
      series: '',
      teachingCycle: '',
    },
    onSubmit: async (vals) => {
      try {
        // Appel de la fonction register mise à jour avec le username
        await register(
          vals.username, // <-- On l'envoie au store
          vals.firstName,
          vals.lastName,
          vals.email,
          vals.password,
          profession,
          profession === 'student' ? (vals.classCycle as any) : undefined,
          profession === 'student' ? vals.classLevel : undefined,
          profession === 'student' ? vals.series : undefined,
          profession === 'teacher' ? (vals.teachingCycle as any) : undefined
        );
        // Redirection vers le login après succès
        navigation.navigate('Login');
      } catch (err) {
        // L'erreur est gérée par le store et affichée via la variable `error`
      }
    },
  });

  const openSelect = (title: string, options: string[], onSelect: (value: string) => void) => {
    setSelectConfig({ title, options, onSelect });
  };

  const applyErrors = (stepErrors: Record<string, string>) => {
    Object.entries(stepErrors).forEach(([key, value]) => {
      setFieldError(key, value);
    });
  };

  const handleNextStep = () => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!values.username.trim()) stepErrors.username = "Le nom d'utilisateur est requis";
      
      const firstNameError = validateName(values.firstName);
      if (firstNameError) stepErrors.firstName = firstNameError;

      const lastNameError = validateName(values.lastName);
      if (lastNameError) stepErrors.lastName = lastNameError;

      if (!values.email) {
        stepErrors.email = 'L\'email est requis';
      } else if (!validateEmail(values.email)) {
        stepErrors.email = 'Email invalide';
      }
    }

    if (step === 2) {
      if (profession === 'student') {
        if (!values.classCycle) stepErrors.classCycle = 'Le cycle est requis';
        if (!values.classLevel) stepErrors.classLevel = 'La classe est requise';
        const needsSeries = ['2nde', '1ere', 'Terminale'].includes(values.classLevel);
        if (values.classCycle === 'secondaire' && needsSeries && !values.series) {
          stepErrors.series = 'La serie est requise';
        }
      }
      if (profession === 'teacher' && !values.teachingCycle) {
        stepErrors.teachingCycle = 'Le cycle est requis';
      }
    }

    if (step === 3) {
      const passwordError = validatePassword(values.password);
      if (passwordError) stepErrors.password = passwordError;
      if (!values.confirmPassword || values.password !== values.confirmPassword) {
        stepErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      applyErrors(stepErrors);
      return;
    }

    if (step < 3) setStep((prev) => (prev + 1) as 2 | 3);
  };

  const stepSubtitle = step === 1 ? 'Identite et contact.' : step === 2 ? 'Informations scolaires.' : 'Securisez votre compte.';
  const classOptions = values.classCycle === 'secondaire' ? secondaryClasses : primaryClasses;
  const needsSeries = ['2nde', '1ere', 'Terminale'].includes(values.classLevel);

  // Styles simplifiés pour gagner de la place ici (identiques aux tiens)
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.gray50, position: 'relative' },
    backgroundTop: { position: 'absolute', top: -120, right: -120, width: 260, height: 260, borderRadius: 999, backgroundColor: colors.secondaryLight, opacity: 0.5 },
    backgroundBottom: { position: 'absolute', bottom: -140, left: -120, width: 300, height: 300, borderRadius: 999, backgroundColor: colors.primaryLight, opacity: 0.5 },
    page: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, alignItems: isWide ? 'center' : 'stretch' },
    content: { width: '100%', ...webMaxWidth(1120) },
    shell: { flexDirection: isWide ? 'row' : 'column', alignItems: isWide ? 'stretch' : 'center', gap: spacing.xl },
    panel: { flex: 1, justifyContent: 'center', paddingRight: spacing.xl, display: isWide ? 'flex' : 'none' },
    panelBadge: { alignSelf: 'flex-start', backgroundColor: colors.secondaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginBottom: spacing.md },
    panelBadgeText: { ...typography.label, color: colors.secondary, fontWeight: '700', letterSpacing: 0.3 },
    panelTitle: { ...typography.h2, color: colors.gray900, marginBottom: spacing.sm },
    panelSubtitle: { ...typography.body1, color: colors.gray600, marginBottom: spacing.lg },
    panelList: { gap: spacing.sm },
    panelItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    panelDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.secondary },
    panelText: { ...typography.body2, color: colors.gray700 },
    authColumn: { flex: 1, maxWidth: isWide ? 560 : undefined },
    brand: { alignItems: 'center', marginBottom: spacing.xl },
    brandBadge: { backgroundColor: colors.secondaryLight, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999, marginBottom: spacing.md },
    brandBadgeText: { ...typography.label, color: colors.secondary, fontWeight: '700', letterSpacing: 0.4 },
    brandTitle: { ...typography.h2, color: colors.gray900, marginBottom: spacing.sm, textAlign: 'center' },
    brandSubtitle: { ...typography.body2, color: colors.gray600, textAlign: 'center' },
    card: { backgroundColor: colors.white, borderRadius: 16, padding: spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6, borderWidth: 1, borderColor: colors.gray100 },
    cardHeader: { marginBottom: spacing.lg },
    stepBadge: { alignSelf: 'flex-start', backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginBottom: spacing.sm },
    stepBadgeText: { ...typography.label, color: colors.primary, fontWeight: '700' },
    cardTitle: { ...typography.h3, color: colors.gray900, marginBottom: spacing.xs },
    cardSubtitle: { ...typography.body2, color: colors.gray600 },
    errorBox: { backgroundColor: colors.errorLight, borderColor: colors.error, borderWidth: 1, borderRadius: 10, padding: spacing.md, marginBottom: spacing.md },
    errorText: { color: colors.error, ...typography.body2 },
    roleSection: { marginBottom: spacing.lg },
    roleLabel: { ...typography.label, color: colors.gray700, marginBottom: spacing.md },
    roleContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
    extraSection: { marginBottom: spacing.lg, gap: spacing.sm },
    selectField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.gray300, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.white },
    selectFieldError: { borderColor: colors.error },
    selectTextPlaceholder: { ...typography.body2, color: colors.gray400 },
    selectTextValue: { ...typography.body2, color: colors.gray900, fontWeight: '600' },
    selectLabel: { ...typography.label, color: colors.gray700, marginBottom: spacing.xs },
    selectError: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
    stepActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.lg, maxHeight: '60%' },
    modalTitle: { ...typography.h4, color: colors.gray900, fontWeight: '700', marginBottom: spacing.md },
    optionItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
    optionText: { ...typography.body1, color: colors.gray900 },
    modalClose: { marginTop: spacing.md },
    roleButton: { flex: 1, paddingVertical: spacing.md, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
    roleButtonActive: { borderColor: colors.secondary, backgroundColor: colors.secondaryLight },
    roleButtonInactive: { borderColor: colors.gray300, backgroundColor: colors.white },
    roleButtonText: { ...typography.body2, fontWeight: '600' },
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.shell}>
            <View style={styles.panel}>
              <View style={styles.panelBadge}><Text style={styles.panelBadgeText}>COMMENCER</Text></View>
              <Text style={styles.panelTitle}>Creez votre espace d'apprentissage.</Text>
              <Text style={styles.panelSubtitle}>Choisissez votre profil et commencez a progresser avec un suivi adapte.</Text>
            </View>

            <View style={styles.authColumn}>
              <View style={styles.brand}>
                <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>DEMARRER</Text></View>
                <Text style={styles.brandTitle}>Creer un compte</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>Etape {step}/3</Text></View>
                  <Text style={styles.cardTitle}>Inscription</Text>
                  <Text style={styles.cardSubtitle}>{stepSubtitle}</Text>
                </View>

                {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

            {step === 1 && (
              <>
                <TextField
                  label="Nom d'utilisateur"
                  placeholder="ex: boureima123"
                  value={values.username}
                  onChangeText={(text: string) => handleChange('username', text)}
                  error={errors.username}
                  autoCapitalize="none"
                />
                <TextField
                  label="Prénom"
                  placeholder="Boureima"
                  value={values.firstName}
                  onChangeText={(text: string) => handleChange('firstName', text)}
                  error={errors.firstName}
                />
                <TextField
                  label="Nom"
                  placeholder="Sanou"
                  value={values.lastName}
                  onChangeText={(text: string) => handleChange('lastName', text)}
                  error={errors.lastName}
                />
                <TextField
                  label="Email"
                  placeholder="votre@email.com"
                  value={values.email}
                  onChangeText={(text: string) => handleChange('email', text)}
                  error={errors.email}
                  keyboardType="email-address"
                />
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.roleSection}>
                  <Text style={styles.roleLabel}>Profession :</Text>
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                      style={[styles.roleButton, profession === 'student' ? styles.roleButtonActive : styles.roleButtonInactive]}
                      onPress={() => { setProfession('student'); handleChange('teachingCycle', ''); }}
                    >
                      <Text style={[styles.roleButtonText, { color: profession === 'student' ? colors.secondary : colors.gray600 }]}>Étudiant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.roleButton, profession === 'teacher' ? styles.roleButtonActive : styles.roleButtonInactive]}
                      onPress={() => { setProfession('teacher'); handleChange('classCycle', ''); handleChange('classLevel', ''); handleChange('series', ''); }}
                    >
                      <Text style={[styles.roleButtonText, { color: profession === 'teacher' ? colors.secondary : colors.gray600 }]}>Enseignant</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {profession === 'student' && (
                  <>
                    <View style={styles.extraSection}>
                      <Text style={styles.selectLabel}>Cycle</Text>
                      <TouchableOpacity style={[styles.selectField, errors.classCycle ? styles.selectFieldError : null]} onPress={() => openSelect('Choisir un cycle', ['primaire', 'secondaire'], (value) => { handleChange('classCycle', value); handleChange('classLevel', ''); handleChange('series', ''); })}>
                        <Text style={values.classCycle ? styles.selectTextValue : styles.selectTextPlaceholder}>{values.classCycle ? (values.classCycle === 'primaire' ? 'Primaire' : 'Secondaire') : 'Choisir un cycle'}</Text>
                        <Icon library="Feather" name="chevron-down" size={18} color={colors.gray600} />
                      </TouchableOpacity>
                      {errors.classCycle && <Text style={styles.selectError}>{errors.classCycle}</Text>}
                    </View>

                    <View style={styles.extraSection}>
                      <Text style={styles.selectLabel}>Classe</Text>
                      <TouchableOpacity style={[styles.selectField, errors.classLevel ? styles.selectFieldError : null]} onPress={() => { if (!values.classCycle) { setFieldError('classCycle', 'Le cycle est requis'); return; } openSelect('Choisir une classe', classOptions, (value) => { handleChange('classLevel', value); if (!['2nde', '1ere', 'Terminale'].includes(value)) handleChange('series', ''); }); }}>
                        <Text style={values.classLevel ? styles.selectTextValue : styles.selectTextPlaceholder}>{values.classLevel || 'Choisir une classe'}</Text>
                        <Icon library="Feather" name="chevron-down" size={18} color={colors.gray600} />
                      </TouchableOpacity>
                      {errors.classLevel && <Text style={styles.selectError}>{errors.classLevel}</Text>}
                    </View>

                    {values.classCycle === 'secondaire' && needsSeries && (
                      <View style={styles.extraSection}>
                        <Text style={styles.selectLabel}>Série</Text>
                        <TouchableOpacity style={[styles.selectField, errors.series ? styles.selectFieldError : null]} onPress={() => openSelect('Choisir une série', seriesOptions, (value) => { handleChange('series', value); })}>
                          <Text style={values.series ? styles.selectTextValue : styles.selectTextPlaceholder}>{values.series || 'Choisir une série'}</Text>
                          <Icon library="Feather" name="chevron-down" size={18} color={colors.gray600} />
                        </TouchableOpacity>
                        {errors.series && <Text style={styles.selectError}>{errors.series}</Text>}
                      </View>
                    )}
                  </>
                )}

                {profession === 'teacher' && (
                  <View style={styles.extraSection}>
                    <Text style={styles.selectLabel}>Cycle d'enseignement</Text>
                    <TouchableOpacity style={[styles.selectField, errors.teachingCycle ? styles.selectFieldError : null]} onPress={() => openSelect('Choisir un cycle', ['primaire', 'secondaire'], (value) => { handleChange('teachingCycle', value); })}>
                      <Text style={values.teachingCycle ? styles.selectTextValue : styles.selectTextPlaceholder}>{values.teachingCycle ? (values.teachingCycle === 'primaire' ? 'Primaire' : 'Secondaire') : 'Choisir un cycle'}</Text>
                      <Icon library="Feather" name="chevron-down" size={18} color={colors.gray600} />
                    </TouchableOpacity>
                    {errors.teachingCycle && <Text style={styles.selectError}>{errors.teachingCycle}</Text>}
                  </View>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <TextField label="Mot de passe" placeholder="••••••••" value={values.password} onChangeText={(text: string) => handleChange('password', text)} error={errors.password} secureTextEntry />
                <TextField label="Confirmer le mot de passe" placeholder="••••••••" value={values.confirmPassword} onChangeText={(text: string) => handleChange('confirmPassword', text)} error={errors.confirmPassword} secureTextEntry />
              </>
            )}

            <View style={styles.stepActions}>
              {step > 1 && <View style={{ flex: 1 }}><Button title="Retour" onPress={() => setStep((prev) => (prev - 1) as 1 | 2)} variant="secondary" fullWidth /></View>}
              <View style={{ flex: 1 }}>{step < 3 ? <Button title="Suivant" onPress={handleNextStep} fullWidth /> : <Button title="S'inscrire" onPress={handleSubmit} fullWidth loading={isLoading} />}</View>
            </View>
          </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Deja inscrit ?</Text>
                  <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>Se connecter</Text>
                </View>
              </View>
            </View>
          </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={!!selectConfig} transparent animationType="slide" onRequestClose={() => setSelectConfig(null)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectConfig?.title}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectConfig?.options.map((option) => (
                <TouchableOpacity key={option} style={styles.optionItem} onPress={() => { selectConfig?.onSelect(option); setSelectConfig(null); }}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalClose}><Button title="Fermer" onPress={() => setSelectConfig(null)} variant="outline" fullWidth /></View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}