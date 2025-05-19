/**
 * Custom Button Component for HMS Mobile
 */

// This is a placeholder for a React Native button component
// In a real application, this would import React and React Native components

const Button = (props) => {
  const { title, onPress, color } = props;

  // In a real app, this would return JSX with React Native components
  console.log(`Button: ${title}, Color: ${color}`);

  return {
    type: "button",
    props: {
      title,
      onPress,
      color,
    },
  };
};

export default Button;
