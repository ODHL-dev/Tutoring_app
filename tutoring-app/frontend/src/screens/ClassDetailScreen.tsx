import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTeacherStore } from '../contexts/teacherStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

export default function ClassDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { classId } = route.params;
  const { getClassById, getPDFsByClass, addPDF, getClassProgress } = useTeacherStore();
  const classData = getClassById(classId);
  const pdfs = getPDFsByClass(classId);
  const studentProgress = getClassProgress(classId);
  
  const [activeTab, setActiveTab] = useState<'pdfs' | 'progress'>('pdfs');
  const [showAddPDFModal, setShowAddPDFModal] = useState(false);
  const [pdfName, setPdfName] = useState('');

  const handleAddPDF = () => {
    if (pdfName.trim() && classData) {
      addPDF({
        id: `pdf-${Date.now()}`,
        name: pdfName,
        fileName: `${pdfName}.pdf`,
        classId,
        subject: classData.subject,
        uploadedAt: new Date(),
        vectorized: false,
        size: Math.floor(Math.random() * 5000000),
      });
      setPdfName('');
      setShowAddPDFModal(false);
    }
  };

  if (!classData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray50 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Classe non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      marginBottom: spacing.lg,
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
    headerInfo: {
      flex: 1,
      gap: spacing.xs,
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
    statsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    statNumber: {
      ...typography.h4,
      color: colors.primary,
      fontWeight: '700',
    },
    statLabel: {
      ...typography.body2,
      fontSize: 12,
      color: colors.primary,
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.white,
      ...webMaxWidth(1100),
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
      alignItems: 'center',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...typography.label,
      color: colors.gray600,
      fontWeight: '600',
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...webMaxWidth(1100),
    },
    pdfCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      flexDirection: 'row',
      gap: spacing.md,
    },
    pdfIcon: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.md,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pdfInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    pdfName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    pdfMeta: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    pdfMetaText: {
      ...typography.body2,
      fontSize: 12,
      color: colors.gray600,
    },
    vectorBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginTop: spacing.xs,
    },
    vectorBadgeActive: {
      backgroundColor: colors.primaryLight,
    },
    vectorBadgeInactive: {
      backgroundColor: colors.gray200,
    },
    vectorBadgeText: {
      ...typography.label,
      fontSize: 11,
      fontWeight: '600',
    },
    vectorBadgeTextActive: {
      color: colors.primary,
    },
    vectorBadgeTextInactive: {
      color: colors.gray600,
    },
    pdfActions: {
      justifyContent: 'space-around',
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    studentName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginVertical: spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    statName: {
      ...typography.body2,
      fontSize: 12,
      color: colors.gray600,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: spacing.lg,
      right: spacing.lg,
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
  });

  const renderPDFsTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {pdfs.length > 0 ? (
        pdfs.map((pdf) => (
          <View key={pdf.id} style={styles.pdfCard}>
            <View style={styles.pdfIcon}>
              <Icon library="Feather" name="file-text" size={24} color={colors.white} />
            </View>
            <View style={styles.pdfInfo}>
              <Text style={styles.pdfName}>{pdf.name}</Text>
              <View style={styles.pdfMeta}>
                <Text style={styles.pdfMetaText}>{(pdf.size / 1024 / 1024).toFixed(2)} MB</Text>
                <Text style={styles.pdfMetaText}>•</Text>
                <Text style={styles.pdfMetaText}>{new Date(pdf.uploadedAt).toLocaleDateString('fr-FR')}</Text>
              </View>
              <View
                style={[
                  styles.vectorBadge,
                  pdf.vectorized ? styles.vectorBadgeActive : styles.vectorBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.vectorBadgeText,
                    pdf.vectorized ? styles.vectorBadgeTextActive : styles.vectorBadgeTextInactive,
                  ]}
                >
                  {pdf.vectorized ? '✓ Vectorisé' : 'En cours...'}
                </Text>
              </View>
            </View>
            <View style={styles.pdfActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon library="Feather" name="eye" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon library="Feather" name="trash-2" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyRow}>
            <Icon library="Feather" name="file-text" size={18} color={colors.gray500} />
            <Text style={styles.emptyText}>Aucun PDF pour cette classe</Text>
          </View>
          <Text style={styles.emptyText}>Ajoutez votre premier PDF en appuyant sur le bouton +</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderProgressTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {studentProgress.length > 0 ? (
        studentProgress.map((student) => (
          <View key={student.studentId} style={styles.progressCard}>
            <Text style={styles.studentName}>{student.studentName}</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${student.progressionPercentage}%` }]}
              />
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{student.completedExercises}</Text>
                <Text style={styles.statName}>Exercices</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{student.averageScore}%</Text>
                <Text style={styles.statName}>Moyenne</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(student.progressionPercentage)}%</Text>
                <Text style={styles.statName}>Progression</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyRow}>
            <Icon library="Feather" name="bar-chart-2" size={18} color={colors.gray500} />
            <Text style={styles.emptyText}>Pas de données de progression</Text>
          </View>
          <Text style={styles.emptyText}>Les progrès des élèves apparaîtront ici</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="Feather" name="arrow-left" size={20} color={colors.gray700} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{classData.name}</Text>
            <Text style={styles.headerSubtitle}>{classData.subject}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pdfs.length}</Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{classData.studentCount}</Text>
            <Text style={styles.statLabel}>Élèves</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ ...styles.statLabel, fontSize: 14 }}>
              {classData.code}
            </Text>
            <Text style={{ ...styles.statLabel, fontSize: 10 }}>Code</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pdfs' && styles.tabActive]}
          onPress={() => setActiveTab('pdfs')}
        >
          <Text style={[styles.tabText, activeTab === 'pdfs' && styles.tabTextActive]}>
            Supports ({pdfs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>
            Progression ({studentProgress.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'pdfs' ? renderPDFsTab() : renderProgressTab()}

      {activeTab === 'pdfs' && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddPDFModal(true)}>
          <Icon library="Feather" name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      <Modal visible={showAddPDFModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un PDF</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du document</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Chapitre 5 - Algèbre"
                placeholderTextColor={colors.gray400}
                value={pdfName}
                onChangeText={setPdfName}
              />
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text style={styles.inputLabel}>ou sélectionnez un fichier</Text>
              <TouchableOpacity style={{ ...styles.input, justifyContent: 'center', alignItems: 'center' }}>
                <Icon library="Feather" name="upload-cloud" size={24} color={colors.primary} />
                <Text style={{ ...typography.body2, color: colors.gray600, marginTop: spacing.xs }}>
                  Appuyez pour choisir un PDF
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                title="Annuler"
                onPress={() => {
                  setShowAddPDFModal(false);
                  setPdfName('');
                }}
                variant="secondary"
              />
              <Button title="Ajouter" onPress={handleAddPDF} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
