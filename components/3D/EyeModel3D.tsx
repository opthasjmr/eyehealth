import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Sphere, Box, Torus } from '@react-three/drei/native';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface EyeModel3DProps {
  condition?: 'normal' | 'diabetic_retinopathy' | 'glaucoma' | 'amd';
  animated?: boolean;
  size?: number;
}

function EyeballMesh({ condition = 'normal', animated = true }: { condition: string; animated: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const getEyeColor = () => {
    switch (condition) {
      case 'diabetic_retinopathy':
        return '#FF6B6B';
      case 'glaucoma':
        return '#4ECDC4';
      case 'amd':
        return '#FFD93D';
      default:
        return '#E8F4FD';
    }
  };

  const getPupilColor = () => {
    switch (condition) {
      case 'glaucoma':
        return '#2C3E50';
      default:
        return '#1A1A1A';
    }
  };

  return (
    <group ref={meshRef}>
      {/* Eyeball */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial color={getEyeColor()} shininess={100} />
      </Sphere>
      
      {/* Iris */}
      <Sphere args={[0.4, 32, 32]} position={[0, 0, 0.95]}>
        <meshPhongMaterial color="#4A90E2" shininess={50} />
      </Sphere>
      
      {/* Pupil */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0, 0.98]}>
        <meshBasicMaterial color={getPupilColor()} />
      </Sphere>
      
      {/* Optic Nerve (for glaucoma visualization) */}
      {condition === 'glaucoma' && (
        <Torus args={[0.2, 0.05, 8, 16]} position={[0.3, -0.2, 0.8]} rotation={[0, 0, Math.PI / 4]}>
          <meshPhongMaterial color="#FF9500" emissive="#FF9500" emissiveIntensity={0.2} />
        </Torus>
      )}
      
      {/* Blood vessels (for diabetic retinopathy) */}
      {condition === 'diabetic_retinopathy' && (
        <>
          <Box args={[0.02, 0.8, 0.02]} position={[0.2, 0, 0.9]} rotation={[0, 0, Math.PI / 6]}>
            <meshBasicMaterial color="#DC143C" />
          </Box>
          <Box args={[0.02, 0.6, 0.02]} position={[-0.15, 0.1, 0.9]} rotation={[0, 0, -Math.PI / 4]}>
            <meshBasicMaterial color="#DC143C" />
          </Box>
          <Box args={[0.02, 0.5, 0.02]} position={[0.1, -0.2, 0.9]} rotation={[0, 0, Math.PI / 3]}>
            <meshBasicMaterial color="#DC143C" />
          </Box>
        </>
      )}
      
      {/* Drusen deposits (for AMD) */}
      {condition === 'amd' && (
        <>
          <Sphere args={[0.05, 8, 8]} position={[0.1, 0.1, 0.9]}>
            <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.03, 8, 8]} position={[-0.08, 0.05, 0.9]}>
            <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.04, 8, 8]} position={[0.05, -0.1, 0.9]}>
            <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </Sphere>
        </>
      )}
    </group>
  );
}

function Scene({ condition, animated }: { condition: string; animated: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={0.8} />
      <EyeballMesh condition={condition} animated={animated} />
    </>
  );
}

export const EyeModel3D: React.FC<EyeModel3DProps> = ({ 
  condition = 'normal', 
  animated = true, 
  size = 200 
}) => {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <Scene condition={condition} animated={animated} />
      </Canvas>
    </View>
  );
};