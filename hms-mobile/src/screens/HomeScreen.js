/**
 * Home Screen for HMS Mobile
 */

// This is a placeholder for a React Native screen
// In a real application, this would import React and React Native components

import Button from "../components/Button";

const HomeScreen = () => {
  // Mock function to handle button press
  const handleLogin = () => {
    console.log("Login button pressed");
  };

  // In a real app, this would return JSX with React Native components
  console.log("Rendering HomeScreen");

  // Sample use of the Button component
  const loginButton = Button({
    title: "Login",
    onPress: handleLogin,
    color: "#3B82F6",
  });

  return {
    type: "screen",
    name: "Home",
    components: [loginButton],
  };
};

export default HomeScreen;
