import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
  Button,
} from "react-native";
import { HF_ACCESS_TOKEN } from "@env";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";

export default function HomeScreen() {
  const [ingredient, setIngredient]: [string, any] = useState("");
  const [ingredients, setIngredients]: [string[] | any, any] = useState([]);
  const [recipe, setRecipe]: [string, any] = useState("");

  const addIngredient = () => {
    if (ingredient.trim() !== "") {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_: any, i: number) => i !== index));
  };

  const fetchRecipe = async () => {
    if (ingredients.length === 0) {
      Alert.alert("Please enter at least one ingredient");
      return;
    }

    const apiUrl =
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

    const prompt = `[INST] I have these ingredients: ${ingredients}. 
    Please suggest a simple, delicious recipe I can make. 
    Include cooking steps, approximate cooking time, and any optional ingredients that would enhance the dish. [/INST]`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
      Alert.alert("Error", "Could not fetch recipe.");
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
          value={ingredients}
          onChangeText={setIngredients}
        />
        <Button title="Get Recipe" onPress={fetchRecipe} />
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
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
  },
  container: { padding: 20, alignItems: "center" },
  recipe: { marginTop: 20, fontSize: 16, textAlign: "center", color: "#fff" },
});
