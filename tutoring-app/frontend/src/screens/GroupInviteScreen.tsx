import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useGroupStore } from '../contexts/groupStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

const INVITE_BASE_URL = 'https://tutoringapp.com/join';

type Mode = 'share' | 'scan' | 'join';

export default function GroupInviteScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { getGroupById, joinGroupByCode } = useGroupStore();

  const groupId = route?.params?.groupId as string | undefined;
  const initialMode = (route?.params?.mode as Mode | undefined) ?? 'share';
  const linkCode = route?.params?.code as string | undefined;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanError, setScanError] = useState('');
  const [scanned, setScanned] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const group = groupId ? getGroupById(groupId) : undefined;

  const inviteLink = useMemo(() => {
    if (!group) return '';
    return `${INVITE_BASE_URL}/${group.code}`;
  }, [group]);

  useEffect(() => {
    if (mode !== 'scan') return;
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [mode, permission, requestPermission]);

  useEffect(() => {
    if (!linkCode) return;
    if (!user) {
      setJoinError('Connectez-vous pour rejoindre un groupe.');
      setMode('join');
      setJoinCode(linkCode.toUpperCase());
      return;
    }
    const joinedGroup = joinGroupByCode(linkCode, user.id, user.name);
    if (!joinedGroup) {
      setJoinError('Code invalide.');
      setMode('join');
      setJoinCode(linkCode.toUpperCase());
      return;
    }
    navigation.replace('GroupDetail', { groupId: joinedGroup.id });
  }, [linkCode, user, joinGroupByCode, navigation]);

  const extractCode = (data: string) => {
    const trimmed = data.trim();
    if (!trimmed) return null;

    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const url = new URL(trimmed);
        const codeParam = url.searchParams.get('code');
        if (codeParam) return codeParam.toUpperCase();
        const segments = url.pathname.split('/').filter(Boolean);
        const joinIndex = segments.findIndex((segment) => segment.toLowerCase() === 'join');
        if (joinIndex >= 0 && segments[joinIndex + 1]) {
          return segments[joinIndex + 1].toUpperCase();
        }
      }
    } catch (error) {
      // Ignore invalid URLs and fallback to raw code.
    }

    return trimmed.toUpperCase();
  };

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    setScanError('');

    const code = extractCode(data);
    if (!code) {
      setScanError('Code invalide.');
      return;
    }

    if (!user) {
      setScanError('Connectez-vous pour rejoindre un groupe.');
      return;
    }

    const joinedGroup = joinGroupByCode(code, user.id, user.name);
    if (!joinedGroup) {
      setScanError('Code invalide.');
      return;
    }

    navigation.replace('GroupDetail', { groupId: joinedGroup.id });
  };

  const handleJoin = () => {
    if (!joinCode.trim()) {
      setJoinError('Entrez un code.');
      return;
    }
    if (!user) {
      setJoinError('Connectez-vous pour rejoindre un groupe.');
      return;
    }
    const joinedGroup = joinGroupByCode(joinCode.trim(), user.id, user.name);
    if (!joinedGroup) {
      setJoinError('Code invalide.');
      return;
    }
    setJoinError('');
    setJoinCode('');
    navigation.replace('GroupDetail', { groupId: joinedGroup.id });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    header: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      ...webMaxWidth(1100),
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      justifyContent: 'center',
      ...webMaxWidth(1100),
    },
    qrCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray100,
      marginBottom: spacing.lg,
    },
    qrTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    qrSubtitle: {
      ...typography.body2,
      color: colors.gray600,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    linkBox: {
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.gray100,
      width: '100%',
    },
    linkText: {
      ...typography.body2,
      color: colors.gray700,
      textAlign: 'center',
    },
    scannerBox: {
      flex: 1,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    scannerOverlay: {
      position: 'absolute',
      bottom: spacing.lg,
      left: spacing.lg,
      right: spacing.lg,
      alignItems: 'center',
    },
    scannerHint: {
      ...typography.body2,
      color: colors.white,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    errorText: {
      ...typography.body2,
      color: colors.error,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.gray200,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body1,
      color: colors.gray900,
    },
    inputLabel: {
      ...typography.label,
      color: colors.gray700,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    inputGroup: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="Feather" name="arrow-left" size={20} color={colors.gray700} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Invitation</Text>
            <Text style={styles.headerSubtitle}>
              {mode === 'share'
                ? 'Partagez le lien ou le QR code.'
                : mode === 'scan'
                  ? 'Scannez un QR code.'
                  : 'Saisissez un code d\'invitation.'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {mode === 'share' ? (
          group ? (
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>Inviter au groupe</Text>
              <QRCode value={inviteLink} size={200} />
              <Text style={styles.qrSubtitle}>Demandez au membre de scanner ce QR code.</Text>
              <View style={styles.linkBox}>
                <Text style={styles.linkText}>{inviteLink}</Text>
              </View>
              <View style={styles.actionRow}>
                <Button title="Scanner" onPress={() => setMode('scan')} variant="outline" />
                <Button title="Entrer un code" onPress={() => setMode('join')} />
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>Aucun groupe selectionne.</Text>
          )
        ) : mode === 'scan' ? (
          <>
            {permission?.status === 'denied' && (
              <Text style={styles.emptyText}>Permission camera refusee.</Text>
            )}
            {!permission && (
              <Text style={styles.emptyText}>Demande d'acces a la camera...</Text>
            )}
            {permission?.status === 'granted' && (
              <View style={styles.scannerBox}>
                <CameraView
                  onBarcodeScanned={handleScan}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  style={{ flex: 1 }}
                />
                <View style={styles.scannerOverlay}>
                  <Text style={styles.scannerHint}>Placez le QR code dans le cadre.</Text>
                  <View style={styles.actionRow}>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="Annuler"
                        onPress={() => (groupId ? setMode('share') : navigation.goBack())}
                        variant="secondary"
                        fullWidth
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        title={scanned ? 'Reessayer' : 'Scanner'}
                        onPress={() => {
                          setScanned(false);
                          setScanError('');
                        }}
                        fullWidth
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
            {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}
          </>
        ) : (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Rejoindre un groupe</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Code du groupe</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: ALPHA1"
                placeholderTextColor={colors.gray400}
                value={joinCode}
                onChangeText={(text) => {
                  setJoinCode(text);
                  setJoinError('');
                }}
                autoCapitalize="characters"
              />
              {joinError ? <Text style={styles.errorText}>{joinError}</Text> : null}
            </View>
            <View style={styles.actionRow}>
              <Button title="Scanner" onPress={() => setMode('scan')} variant="outline" />
              <Button title="Rejoindre" onPress={handleJoin} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
