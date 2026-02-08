import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useGroupStore } from '../contexts/groupStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

export default function GroupListScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { getGroupsByUser, createGroup, joinGroupByCode } = useGroupStore();
  const groups = user ? getGroupsByUser(user.id) : [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleCreate = () => {
    if (!groupName.trim() || !user) return;
    const newGroup = createGroup(groupName.trim(), user.id, user.name);
    setGroupName('');
    setShowCreateModal(false);
    navigation.navigate('GroupDetail', { groupId: newGroup.id });
  };

  const handleJoin = () => {
    if (!joinCode.trim() || !user) return;
    const group = joinGroupByCode(joinCode.trim(), user.id, user.name);
    if (!group) {
      setJoinError('Code invalide.');
      return;
    }
    setJoinCode('');
    setJoinError('');
    setShowJoinModal(false);
    navigation.navigate('GroupDetail', { groupId: group.id });
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
      ...webMaxWidth(1100),
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    headerActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...webMaxWidth(1100),
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    groupCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    groupName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    groupMeta: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    groupMetaText: {
      ...typography.body2,
      color: colors.gray600,
    },
    groupCode: {
      marginTop: spacing.sm,
      alignSelf: 'flex-start',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    groupCodeText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.white,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      padding: spacing.lg,
      gap: spacing.lg,
      ...webMaxWidth(520),
    },
    modalTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
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
    },
    errorText: {
      ...typography.body2,
      color: colors.error,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groupes</Text>
        <Text style={styles.headerSubtitle}>Gérez vos groupes et vos membres.</Text>
        <View style={styles.headerActions}>
          {user?.role === 'teacher' && (
            <Button title="Créer" onPress={() => setShowCreateModal(true)} size="sm" />
          )}
          <Button title="Rejoindre" onPress={() => setShowJoinModal(true)} size="sm" variant="outline" />
          <Button
            title="Scanner"
            onPress={() => navigation.navigate('GroupInvite', { mode: 'scan' })}
            size="sm"
            variant="outline"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Mes groupes</Text>
        {groups.length > 0 ? (
          groups.map((group) => (
            <View key={group.id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}>
                  <Icon library="Feather" name="arrow-right" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.groupMeta}>
                <Text style={styles.groupMetaText}>{group.memberCount} membres</Text>
              </View>
              <View style={styles.groupCode}>
                <Text style={styles.groupCodeText}>Code: {group.code}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun groupe pour le moment.</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un groupe</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du groupe</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Groupe Alpha"
                placeholderTextColor={colors.gray400}
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                title="Annuler"
                onPress={() => {
                  setShowCreateModal(false);
                  setGroupName('');
                }}
                variant="secondary"
              />
              <Button title="Créer" onPress={handleCreate} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejoindre un groupe</Text>
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
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                title="Annuler"
                onPress={() => {
                  setShowJoinModal(false);
                  setJoinCode('');
                  setJoinError('');
                }}
                variant="secondary"
              />
              <Button title="Rejoindre" onPress={handleJoin} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
