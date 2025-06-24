import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Eye, Brain, Shield, Users, FileText, TrendingUp, CircleCheck as CheckCircle, ArrowRight, Stethoscope, Activity, Award, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze retinal images with 95%+ accuracy',
    },
    {
      icon: Eye,
      title: 'Multi-Modal Imaging',
      description: 'Support for fundus photography, OCT scans, and visual field tests',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security ensuring patient data protection',
    },
    {
      icon: FileText,
      title: 'Clinical Reports',
      description: 'Generate comprehensive diagnostic reports for patient records',
    },
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Integrated patient tracking and history management system',
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Track disease progression and treatment outcomes over time',
    },
  ];

  const conditions = [
    'Diabetic Retinopathy',
    'Glaucoma',
    'Age-related Macular Degeneration',
    'Retinal Detachment',
    'Hypertensive Retinopathy',
    'Optic Nerve Disorders',
  ];

  const stats = [
    { number: '500K+', label: 'Images Analyzed' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '2,000+', label: 'Healthcare Providers' },
    { number: '24/7', label: 'Support Available' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    loginButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    loginButtonText: {
      color: theme.colors.primary,
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
    signupButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    signupButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
    hero: {
      padding: 40,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    heroTitle: {
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 56,
    },
    heroSubtitle: {
      fontSize: 20,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
      maxWidth: 600,
      lineHeight: 28,
    },
    ctaButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    ctaButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      marginRight: 8,
    },
    heroImage: {
      width: '100%',
      height: 400,
      borderRadius: 16,
      marginTop: 40,
    },
    section: {
      padding: 40,
    },
    sectionTitle: {
      fontSize: 36,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionSubtitle: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 48,
      maxWidth: 600,
      alignSelf: 'center',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 24,
      justifyContent: 'center',
    },
    featureCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      width: (width - 120) / 2,
      minWidth: 280,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    featureIcon: {
      marginBottom: 16,
    },
    featureTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    featureDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    conditionsSection: {
      backgroundColor: theme.colors.surface,
    },
    conditionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'center',
    },
    conditionChip: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    conditionText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    statsSection: {
      backgroundColor: theme.colors.primary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 40,
      justifyContent: 'center',
    },
    statCard: {
      alignItems: 'center',
      minWidth: 120,
    },
    statNumber: {
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    complianceSection: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    complianceContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
    },
    complianceItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    complianceText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginLeft: 8,
    },
    footer: {
      backgroundColor: theme.colors.text,
      padding: 40,
      alignItems: 'center',
    },
    footerText: {
      color: '#FFFFFF',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 8,
    },
    disclaimer: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 12,
      textAlign: 'center',
      maxWidth: 600,
      lineHeight: 18,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Eye size={32} color={theme.colors.primary} />
          <Text style={styles.logoText}>EyeAI Diagnostics</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
            <Text style={styles.signupButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>AI-Powered Eye Health Diagnostics</Text>
        <Text style={styles.heroSubtitle}>
          Advanced artificial intelligence for accurate, fast, and reliable retinal disease detection. 
          Empowering healthcare professionals with cutting-edge diagnostic tools.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/signup')}>
          <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Features</Text>
        <Text style={styles.sectionSubtitle}>
          Comprehensive AI-powered tools designed specifically for eye care professionals
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <feature.icon size={32} color={theme.colors.primary} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Conditions Section */}
      <View style={[styles.section, styles.conditionsSection]}>
        <Text style={styles.sectionTitle}>Detectable Conditions</Text>
        <Text style={styles.sectionSubtitle}>
          Our AI can accurately identify and assess multiple retinal conditions
        </Text>
        <View style={styles.conditionsGrid}>
          {conditions.map((condition, index) => (
            <View key={index} style={styles.conditionChip}>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={[styles.section, styles.statsSection]}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Trusted by Professionals</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Compliance Section */}
      <View style={[styles.section, styles.complianceSection]}>
        <Text style={styles.sectionTitle}>Medical Grade Security</Text>
        <View style={styles.complianceContent}>
          <View style={styles.complianceItem}>
            <Shield size={24} color={theme.colors.success} />
            <Text style={styles.complianceText}>HIPAA Compliant</Text>
          </View>
          <View style={styles.complianceItem}>
            <Award size={24} color={theme.colors.success} />
            <Text style={styles.complianceText}>FDA Cleared</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={24} color={theme.colors.success} />
            <Text style={styles.complianceText}>SOC 2 Certified</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 EyeAI Diagnostics. All rights reserved.</Text>
        <Text style={styles.disclaimer}>
          For Medical Professional Use Only. This software is intended for use by qualified healthcare professionals 
          as an aid in the detection of retinal abnormalities. It is not intended to replace clinical judgment or 
          serve as a substitute for professional medical advice, diagnosis, or treatment.
        </Text>
      </View>
    </ScrollView>
  );
}