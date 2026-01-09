import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Tabs,
  Loader,
  Center,
  Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/apiService';
import { useAuthStore } from '../context/authStore';
import './LoginPage.css';

type TabValue = 'login' | 'register';

export function LoginPage() {
  const navigate = useNavigate();

  const loginAction = useAuthStore((s) => s.login);

  const [tab, setTab] = useState<TabValue>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmitLogin = validEmail(loginEmail) && loginPassword.trim().length >= 6 && !isLoading;
  const canSubmitRegister =
    registerUsername.trim().length >= 2 &&
    validEmail(registerEmail) &&
    registerPassword.trim().length >= 6 &&
    !isLoading;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmitLogin) return;
    setIsLoading(true);
    setErrMsg(null);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      loginAction(data.token);
      // Go to HOME after login
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setErrMsg('Login failed. Please check your email/password and try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmitRegister) return;
    setIsLoading(true);
    setErrMsg(null);
    try {
      await registerUser(registerUsername, registerPassword, registerEmail);
      setTab('login'); // go back to login tab
      setIsLoading(false);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrMsg('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  return (
    <div className="login-page">
      <Container size={420} my={40} className="fade-in">
        <Title className="login-title" ta="center">
          Welcome to AthenaAI 
        </Title>

        {errMsg && (
          <Text c="red" ta="center" mt="sm" mb="sm">
            {errMsg}
          </Text>
        )}

        <Paper withBorder shadow="lg" className="login-card">
          <Tabs value={tab} onChange={(v) => setTab((v as TabValue) ?? 'login')}>
            <Tabs.List grow>
              <Tabs.Tab value="login">Sign In</Tabs.Tab>
              <Tabs.Tab value="register">Sign Up</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login" pt="xs">
              <form onSubmit={handleLogin}>
                <Stack>
                  <TextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.currentTarget.value)}
                  />
                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Minimum 6 characters"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.currentTarget.value)}
                  />
                  <Button type="submit" fullWidth className="glow-button" disabled={!canSubmitLogin}>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>

            <Tabs.Panel value="register" pt="xs">
              <form onSubmit={handleRegister}>
                <Stack>
                  <TextInput
                    required
                    label="Username"
                    placeholder="Your username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.currentTarget.value)}
                  />
                  <TextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.currentTarget.value)}
                  />
                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Minimum 6 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.currentTarget.value)}
                  />
                  <Button type="submit" fullWidth className="glow-button" disabled={!canSubmitRegister}>
                    Sign up
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </div>
  );
}
