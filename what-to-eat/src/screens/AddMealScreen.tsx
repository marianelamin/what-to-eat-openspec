import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createMeal, uploadMealPhoto } from '../services/mealService';
import { supabase } from '../services/supabase';

export function AddMealScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [saveError, setSaveError] = useState('');

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setSaveError('Photo library permission is required to add a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setNameError('Meal name is required');
      return;
    }
    setNameError('');
    setSaveError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let photoUrl: string | undefined;
      if (imageUri) {
        photoUrl = await uploadMealPhoto(imageUri, user.id);
      }

      const ingredientLines = ingredients
        .split('\n')
        .filter((l) => l.trim().length > 0);

      await createMeal({
        name: name.trim(),
        recipe: recipe.trim() || undefined,
        photo_url: photoUrl,
        ingredients: ingredientLines,
      });

      navigation.goBack();
    } catch (e: any) {
      setSaveError(e?.message ?? 'Failed to save meal. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const placeholderBg = isDark ? '#292524' : '#e7e5e4';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={[styles.photoArea, { backgroundColor: placeholderBg }]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialCommunityIcons
                name="camera-plus"
                size={40}
                color={isDark ? '#78716c' : '#a8a29e'}
              />
              <Text variant="bodySmall" style={styles.photoLabel}>
                Add Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="Meal name *"
          value={name}
          onChangeText={(v) => { setName(v); setNameError(''); }}
          mode="outlined"
          style={styles.input}
          error={!!nameError}
        />
        {!!nameError && <HelperText type="error">{nameError}</HelperText>}

        <TextInput
          label="Ingredients (one per line)"
          value={ingredients}
          onChangeText={setIngredients}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <TextInput
          label="Recipe / Notes"
          value={recipe}
          onChangeText={setRecipe}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        {!!saveError && (
          <HelperText type="error" style={styles.saveError}>
            {saveError}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
          buttonColor={isDark ? '#d97706' : '#f59e0b'}
        >
          Save Meal
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  photoArea: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoLabel: { marginTop: 8, opacity: 0.6 },
  input: { marginBottom: 12 },
  saveError: { marginBottom: 8 },
  saveButton: { marginTop: 8 },
});
