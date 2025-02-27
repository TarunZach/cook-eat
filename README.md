# 🍽️ Recipe Generator App

A simple **React Native** application that generates recipes based on user-provided ingredients. The app interacts with Hugging Face's Mistral-7B-Instruct model to suggest delicious recipes.

---

## 📜 Features

### ✅ **Ingredient Input**

- Users can enter ingredients manually.
- Ingredients are stored in a list.
- Users can remove ingredients if needed.

### 🍳 **Recipe Generation**

- The app sends a request to the **Hugging Face API** with a list of ingredients.
- The AI model generates a recipe, including:
  - **Cooking steps** 🥘
  - **Approximate cooking time** ⏳
  - **Optional ingredients for enhancement** 🍋

### 🎨 **UI & UX Enhancements**

- Uses **Parallax scrolling** for a smooth experience.
- Custom-themed components (`ThemedText`, `ThemedView`).
- **Dark mode** support.

---

## 🚀 Installation & Setup

### 1️⃣ **Clone the Repository**

```sh
 git clone https://github.com/TarunZach/recipe-generator-app.git
 cd recipe-generator-app
```

### 2️⃣ **Install Dependencies**

```sh
npm install  # or yarn install
```

### 3️⃣ **Set Up Environment Variables**

Create a `.env` file in the root directory and add:

```sh
HF_ACCESS_TOKEN=your_huggingface_token_here
```

🚨 **Important:** Never expose your API key in a public repository! Use `.gitignore` to exclude `.env`.

### 4️⃣ **Run the App**

For **Expo** projects:

```sh
npx expo start
```

For **React Native CLI**:

```sh
npx react-native run-android   # For Android
tnpx react-native run-ios      # For iOS
```

---

## 🔧 Project Structure

```
recipe-generator-app/
│-- app/
│   ├── components/
│   │   ├── HelloWave.tsx
│   │   ├── ParallaxScrollView.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedView.tsx
│   ├── (tabs)/index.tsx  # Main screen
│   ├── assets/
│   ├── styles/
│-- babel.config.js
│-- package.json
│-- .env
│-- README.md
```

---

## 🔥 API Integration

The app makes a `POST` request to Hugging Face's **Mistral-7B-Instruct** model:

```js
const apiUrl =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
```

---

## 📌 To-Do / Future Improvements

- [ ] **Offline mode** for storing past recipes.
- [ ] **Save favorite recipes** locally.
- [ ] **Share recipes** via social media.
- [ ] **Add more AI models** for better recipe suggestions.

---

## 💡 Contributing

Contributions are welcome! Feel free to submit **issues** or **pull requests**.

---

## 📜 License

This project is licensed under the **MIT License**.

---

### 💬 Need Help?

If you have any questions, feel free to **open an issue** or reach out!
