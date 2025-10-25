import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { updateUser, findUserById } from '@/lib/api';
import { useAuth } from '../context/AuthContext';

export default function EditUserScreen({ navigation }: any) {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!fullName || !mobile) {
      Alert.alert("Validation", "Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = { fullName, mobile };

      // Update backend
      const updatedUserFromBackend = await updateUser(user.id, updatedData);

      // Update AuthContext session
      if (setUser) {
        const updatedUser = await findUserById(user.id);
        setUser({ ...updatedUser, role: user.role });
      }

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };


  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E53E3E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
        />
      </View>

      {/* Email (readonly) */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email || ''}
          editable={false}
        />
      </View>

      {/* Mobile */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
        />
      </View>

      {/* Save Button */}
      <Pressable 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleUpdate} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F7FAFC',
    flexGrow: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#2D3748'
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#a0aec0'
  },
  button: {
    backgroundColor: '#E53E3E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: '#E99999'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
