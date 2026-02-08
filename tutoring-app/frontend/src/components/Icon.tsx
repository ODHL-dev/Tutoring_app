import React from 'react';
import { 
    MaterialIcons, 
    MaterialCommunityIcons,
  Ionicons, 
  Feather,
  FontAwesome5,
  AntDesign,
  Entypo 
} from '@expo/vector-icons';

export type IconLibrary = 
  | 'Material' 
  | 'MaterialCommunity' 
  | 'Ionicons' 
  | 'Feather' 
  | 'FontAwesome5'
  | 'AntDesign'
  | 'Entypo';

interface IconProps {
  library?: IconLibrary;
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ library = 'Material', name, size = 24, color = '#000' }: IconProps) {
    switch (library) {
    case 'Material':
        return <MaterialIcons name={name as any} size={size} color={color} />;
    case 'MaterialCommunity':
        return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case 'Ionicons':
        return <Ionicons name={name as any} size={size} color={color} />;
    case 'Feather':
        return <Feather name={name as any} size={size} color={color} />;
    case 'FontAwesome5':
        return <FontAwesome5 name={name as any} size={size} color={color} />;
    case 'AntDesign':
        return <AntDesign name={name as any} size={size} color={color} />;
    case 'Entypo':
        return <Entypo name={name as any} size={size} color={color} />;
    default:
        return <MaterialIcons name={name as any} size={size} color={color} />;
    }
}

// Export des collections directement si besoin
export { 
  MaterialIcons, 
  MaterialCommunityIcons,
  Ionicons, 
  Feather,
  FontAwesome5,
  AntDesign,
  Entypo 
};
