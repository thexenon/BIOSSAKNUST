import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
