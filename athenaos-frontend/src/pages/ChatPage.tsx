import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Paper, TextInput, Button, Stack, Group, Text, ScrollArea, Avatar, Title, Center,
  Drawer, NavLink, Divider, Box, Alert, Modal,
} from '@mantine/core';
import { IconMessage2, IconPlus, IconChartLine } from '@tabler/icons-react';
import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '../context/authStore';
import { useChatStore, type Message } from '../context/chatStore';
import { sendMessage, getEmotionHistory } from '../services/apiService';
import { EmotionChart } from '../components/EmotionChart';

interface Emotion { label: string; score: number; }
interface EmotionHistoryRecord { timestamp: string; emotions: Emotion[]; }

export function ChatPage() {
  const token = useAuthStore((s) => s.token);

  const {
    conversations,
    selectedConversation,
    fetchConversations,
    selectConversation,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [emotionData, setEmotionData] = useState<EmotionHistoryRecord[]>([]);

  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (token) {
      setError(null);
      fetchConversations(token).catch((e) => {
        console.error('Failed to fetch conversations:', e);
        setError(humanizeAxiosError(e));
      });
    }
  }, [token, fetchConversations]);
  
  useEffect(() => {
    if (selectedConversation && token) {
      getEmotionHistory(String(selectedConversation.id), token)
        .then(data => setEmotionData(data))
        .catch(e => console.error('Failed to fetch emotion data:', e));
    } else {
      setEmotionData([]);
    }
  }, [selectedConversation, token, conversations]);

  const msgs = useMemo(() => {
    if (!selectedConversation?.messages) return [];
    return [...selectedConversation.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [selectedConversation]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100);
  }, [msgs.length, selectedConversation]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Not authenticated. Please login again.');
      return;
    }
    const text = newMessage.trim();
    if (!text || loading) return;

    setError(null);
    setNewMessage('');
    setLoading(true);
    try {
      const conversationId = selectedConversation ? String(selectedConversation.id) : null;
      await sendMessage(text, conversationId, token);
      await fetchConversations(token);
    } catch (e) {
      console.error('Failed to send message:', e);
      setError(humanizeAxiosError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    selectConversation(null); 
    setDrawerOpen(false);
  };
  
  const convs = useMemo(() => {
    return [...conversations]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((c) => ({
        id: c.id,
        label: `Chat from ${new Date(c.createdAt).toLocaleDateString()}`,
      }));
  }, [conversations]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
       <Modal opened={chartModalOpen} onClose={() => setChartModalOpen(false)} title="Emotion Analysis" size="xl">
          <EmotionChart data={emotionData} />
       </Modal>
      <Title order={3} mb="xs">AthenaAI Chat</Title>
      {error && (
        <Alert color="red" mb="sm" title="Chat error" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Group mb="sm" justify="space-between">
        <Button variant="light" leftSection={<IconMessage2 size={16} />} onClick={() => setDrawerOpen(true)}>
          Conversations
        </Button>
        <Button 
          variant="outline" 
          leftSection={<IconChartLine size={16} />} 
          onClick={() => setChartModalOpen(true)}
          disabled={!selectedConversation}
        >
          View Emotion Chart
        </Button>
        <Button leftSection={<IconPlus size={16} />} onClick={handleNewConversation}>
          New Chat
        </Button>
      </Group>
      <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
        <Stack p="md" gap="lg">
          {selectedConversation ? (
            msgs.length > 0 ? (
              msgs.map((m: Message) => (
                <Group key={m.id} justify={m.sender === 'user' ? 'flex-end' : 'flex-start'}>
                  {m.sender === 'bot' && <Avatar color="blue" radius="xl">AI</Avatar>}
                  <Paper
                    shadow="sm" p="sm" radius="lg" withBorder
                    style={{
                      backgroundColor: m.sender === 'user' ? '#228be6' : '#f1f3f5',
                      color: m.sender === 'user' ? 'white' : 'black',
                      maxWidth: '70%',
                    }}
                  >
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{m.text}</Text>
                  </Paper>
                  {m.sender === 'user' && <Avatar color="cyan" radius="xl">ME</Avatar>}
                </Group>
              ))
            ) : (
              <Center style={{ height: 300 }}>
                <Title order={4}>Start the conversation by typing a message!</Title>
              </Center>
            )
          ) : (
            <Center style={{ height: 300 }}>
              <Title order={4}>Open “Conversations” or click “New Chat” to begin</Title>
            </Center>
          )}
        </Stack>
      </ScrollArea>
      <Paper component="form" onSubmit={handleSend} withBorder p="sm" radius="md" mt="md">
        <Group>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            disabled={!token || loading}
          />
          <Button type="submit" loading={loading} disabled={!token || !newMessage.trim()}>Send</Button>
        </Group>
      </Paper>
      <Text c="dimmed" ta="center" size="xs" mt="xs">
        Athena is a student project and can make mistakes. Emotion analysis may also be inaccurate. Please remember to clarify important information.
      </Text>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Conversations"
        position="right"
      >
        <Stack>
          <Button fullWidth leftSection={<IconPlus size={16} />} onClick={handleNewConversation}>
            New Chat
          </Button>
          <Divider />
          <Box>
            {convs.length === 0 ? (
              <Text c="dimmed">No conversations yet.</Text>
            ) : (
              convs.map((c) => (
                <NavLink
                  key={c.id}
                  label={c.label}
                  leftSection={<IconMessage2 size={16} />}
                  active={selectedConversation?.id === c.id}
                  onClick={() => {
                    selectConversation(c.id);
                    setDrawerOpen(false);
                  }}
                  style={{ borderRadius: 8 }}
                />
              ))
            )}
          </Box>
        </Stack>
      </Drawer>
    </div>
  );
}

function humanizeAxiosError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const error = e as AxiosError<{ message?: string, detail?: string }>;
    const code = error.response?.status;
    
    if (code === 400 && error.response?.data?.detail?.includes('harmful content')) {
      return "Your message was flagged by our safety filter. Please rephrase your message to focus on personal feelings and experiences.";
    }

    const msg = error.response?.data?.message || error.response?.data?.detail || error.response?.statusText || 'Request failed';
    if (code === 401) return 'Not authorized (401). Please login again.';
    if (code === 404) return 'Endpoint not found (404). Check API URL.';
    return `${msg} (HTTP ${code})`;
  }
  if (e instanceof Error) return e.message;
  return 'An unexpected error occurred';
}

export default ChatPage;