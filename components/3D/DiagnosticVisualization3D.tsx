import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Sphere, Box, Cylinder, Torus } from '@react-three/drei/native';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface DiagnosticVisualization3DProps {
  findings: Array<{
    condition: string;
    severity: string;
    confidence: number;
    location: string;
  }>;
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  animated?: boolean;
}

function RiskVisualization({ risk, animated }: { risk: string; animated: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getRiskColor = () => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getRiskHeight = () => {
    switch (risk) {
      case 'low': return 0.5;
      case 'moderate': return 1.0;
      case 'high': return 1.5;
      case 'critical': return 2.0;
      default: return 0.5;
    }
  };

  return (
    <group ref={meshRef}>
      <Cylinder args={[0.3, 0.3, getRiskHeight(), 8]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color={getRiskColor()} 
          emissive={getRiskColor()} 
          emissiveIntensity={0.2}
          shininess={100}
        />
      </Cylinder>
      
      {/* Risk level indicators */}
      {Array.from({ length: Math.ceil(getRiskHeight() * 2) }, (_, i) => (
        <Torus 
          key={i}
          args={[0.4 + i * 0.1, 0.02, 8, 16]} 
          position={[0, -getRiskHeight()/2 + i * 0.3, 0]}
        >
          <meshBasicMaterial color={getRiskColor()} transparent opacity={0.6} />
        </Torus>
      ))}
    </group>
  );
}

function FindingNodes({ findings }: { findings: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const getSeveritySize = (severity: string) => {
    switch (severity) {
      case 'mild': return 0.1;
      case 'moderate': return 0.15;
      case 'severe': return 0.2;
      default: return 0.05;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#FCD34D';
      case 'moderate': return '#F97316';
      case 'severe': return '#DC2626';
      default: return '#10B981';
    }
  };

  return (
    <group ref={groupRef}>
      {findings.map((finding, index) => {
        const angle = (index / findings.length) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={index}>
            <Sphere 
              args={[getSeveritySize(finding.severity), 16, 16]} 
              position={[x, 0, z]}
            >
              <meshPhongMaterial 
                color={getSeverityColor(finding.severity)}
                emissive={getSeverityColor(finding.severity)}
                emissiveIntensity={0.3}
              />
            </Sphere>
            
            {/* Connection line to center */}
            <Cylinder 
              args={[0.01, 0.01, radius, 8]} 
              position={[x/2, 0, z/2]}
              rotation={[0, -angle, Math.PI/2]}
            >
              <meshBasicMaterial color="#4B5563" transparent opacity={0.4} />
            </Cylinder>
          </group>
        );
      })}
    </group>
  );
}

function ConfidenceRings({ findings }: { findings: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {findings.map((finding, index) => {
        const radius = 1 + (finding.confidence / 100) * 2;
        const opacity = finding.confidence / 100;
        
        return (
          <Torus 
            key={index}
            args={[radius, 0.05, 8, 32]} 
            position={[0, index * 0.1 - findings.length * 0.05, 0]}
          >
            <meshBasicMaterial 
              color="#3B82F6" 
              transparent 
              opacity={opacity * 0.6}
            />
          </Torus>
        );
      })}
    </group>
  );
}

function Scene({ findings, overallRisk, animated }: { 
  findings: any[]; 
  overallRisk: string; 
  animated: boolean; 
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />
      
      <RiskVisualization risk={overallRisk} animated={animated} />
      <FindingNodes findings={findings} />
      <ConfidenceRings findings={findings} />
    </>
  );
}

export const DiagnosticVisualization3D: React.FC<DiagnosticVisualization3DProps> = ({
  findings,
  overallRisk,
  animated = true,
}) => {
  const { theme } = useTheme();
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const getRiskColor = () => {
    switch (overallRisk) {
      case 'low': return theme.colors.success;
      case 'moderate': return theme.colors.warning;
      case 'high': return theme.colors.error;
      case 'critical': return '#DC2626';
      default: return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: width * 0.8,
      height: 300,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    header: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      zIndex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    riskBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: getRiskColor(),
    },
    riskText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
    legend: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      zIndex: 1,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    legendText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnostic Visualization</Text>
        <View style={styles.riskBadge}>
          <Text style={styles.riskText}>{overallRisk} Risk</Text>
        </View>
      </View>
      
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        <Scene findings={findings} overallRisk={overallRisk} animated={animated} />
      </Canvas>
      
      <View style={styles.legend}>
        {findings.slice(0, 3).map((finding, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendDot, 
                { backgroundColor: finding.severity === 'severe' ? '#DC2626' : finding.severity === 'moderate' ? '#F97316' : '#FCD34D' }
              ]} 
            />
            <Text style={styles.legendText}>
              {finding.condition} ({finding.severity})
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};