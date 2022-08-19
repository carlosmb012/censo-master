import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export default function AppButton (props) {
  const {action, title, color, width, size} = props;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color || '#808080',
        width: width || '95%',
        alignItems: 'center',
        marginVertical: 6,
        padding: 8,
        borderRadius: 10,
      }}
      onPress={action}
    >
      <Text
        style={{
          color: 'white',
          fontSize: size || 14,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
