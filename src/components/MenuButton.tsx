import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuButtonProps {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    color: string;
    onPress: () => void;
}

export default function MenuButton({ iconName, title, color, onPress }: MenuButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, { borderColor: color }]} onPress={onPress}>
            <Ionicons name={iconName} size={28} color={color} style={styles.icon} />
            <Text style={[styles.text, { color: color }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderRadius: 24,
        height: 65,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        width: '100%',
    },
    icon: {
        position: 'absolute',
        left: 24,
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});