import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// interface Recipe {
//   title: string;
//   ingredients: string[];
//   instructions: string;
//   cookingTime: string;
// }

export default function HomeScreen() {
  const [ingredient, setIngredient] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addIngredient = (): void => {
    if (ingredient.trim() !== "") {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const removeIngredient = (index: number): void => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const fetchRecipe = async (): Promise<void> => {
    if (ingredients.length === 0) {
      Alert.alert("Please enter at least one ingredient");
      return;
    }

    const prompt = `[INST] I have these ingredients: ${ingredients}.
Please suggest a simple, delicious recipe I can make.
Include cooking steps, approximate cooking time, and any optional ingredients that would enhance the dish. [/INST]`;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.7,
              top_p: 0.9,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the generated text into a Recipe object
      const data = await response.json();

      let recipeText = "";
      if (Array.isArray(data)) {
        recipeText = data[0]?.generated_text || "";
      } else if (data.generated_text) {
        recipeText = data.generated_text;
      }

      recipeText = recipeText.replace(prompt, "").trim();

      setRecipe(
        recipeText || "No recipe could be generated with those ingredients."
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <View style={styles.container}>
        <Text style={styles.label}>Enter Ingredients:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., eggs, tomatoes, cheese"
          value={ingredient}
          onChangeText={setIngredient}
          onSubmitEditing={addIngredient}
        />
        <Button title="Add Ingredient" onPress={addIngredient} />

        {ingredients.length > 0 && (
          <View style={styles.ingredientList}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text>{item}</Text>
                <Button
                  title="Remove"
                  onPress={() => removeIngredient(index)}
                />
              </View>
            ))}
          </View>
        )}

        <Button title="Get Recipe" onPress={fetchRecipe} disabled={isLoading} />

        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {recipe ? <Text style={styles.recipe}>{recipe}</Text> : null}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
    width: "100%",
  },
  container: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  ingredientList: {
    marginTop: 10,
    width: "100%",
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  recipeContainer: {
    marginTop: 20,
    width: "100%",
  },
  recipe: { marginTop: 20, fontSize: 16, textAlign: "center", color: "#fff" },
});
