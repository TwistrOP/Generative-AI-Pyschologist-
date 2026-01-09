import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Paper, Button, Stack, Group, Text, ScrollArea, Avatar, Title, Center,
  Drawer, NavLink, Divider, Box, Alert, Modal, ActionIcon,
} from '@mantine/core';
import { IconMessage2, IconPlus, IconChartLine, IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { useAuthStore } from '../context/authStore';
import { useChatStore, type Message } from '../context/chatStore';
import { sendMessage, getEmotionHistory, synthesizeSpeech } from '../services/apiService';
import { EmotionChart } from '../components/EmotionChart';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

interface Emotion { label: string; score: number; }
interface EmotionHistoryRecord { timestamp: string; emotions: Emotion[]; }

export function VoicePage() {
  const token = useAuthStore((s) => s.token);
  const { conversations, selectedConversation, fetchConversations, selectConversation } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionHistoryRecord[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');
  
  const viewport = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const scrollToBottom = () => viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!token || !text.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const conversationId = selectedConversation ? String(selectedConversation.id) : null;
      const aiResult = await sendMessage(text, conversationId, token);
      
      if (aiResult.response) {
        const ttsResponse = await synthesizeSpeech(aiResult.response, token);
        const audio = new Audio(`data:audio/mp3;base64,${ttsResponse.audioContent}`);
        
        audioRef.current = audio;

        audio.play();
        audio.onended = () => {
          audioRef.current = null;
        };
      }

      await fetchConversations(token);
    } catch (e: unknown) {
      console.error('Failed to process message:', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setTranscript('');
    }
  }, [token, selectedConversation, fetchConversations]);

  useEffect(() => {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      const transcriptToSend = finalTranscriptRef.current.trim();
      if (transcriptToSend) {
        handleSend(transcriptToSend);
      }
    };
  }, [handleSend]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      finalTranscriptRef.current = '';
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (token) {
      fetchConversations(token).catch(e => console.error('Failed to fetch conversations:', e));
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
    return [...selectedConversation.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [selectedConversation]);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [msgs.length, selectedConversation]);

  const handleNewConversation = () => {
    selectConversation(null);
    setDrawerOpen(false);
  };
  
  const convs = useMemo(() => {
    return [...conversations]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((c) => ({ id: c.id, label: `Chat from ${new Date(c.createdAt).toLocaleDateString()}` }));
  }, [conversations]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <Modal opened={chartModalOpen} onClose={() => setChartModalOpen(false)} title="Emotion Analysis" size="xl">
        <EmotionChart data={emotionData} />
      </Modal>
      <Title order={3} mb="xs">AthenaAI Voice Conversation</Title>
      {error && <Alert color="red" mb="sm" title="Error" withCloseButton onClose={() => setError(null)}>{error}</Alert>}
      <Group mb="sm" justify="space-between">
        <Button variant="light" leftSection={<IconMessage2 size={16} />} onClick={() => setDrawerOpen(true)}>Conversations</Button>
        <Button variant="outline" leftSection={<IconChartLine size={16} />} onClick={() => setChartModalOpen(true)} disabled={!selectedConversation}>View Emotion Chart</Button>
        <Button leftSection={<IconPlus size={16} />} onClick={handleNewConversation}>New Chat</Button>
      </Group>
      <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
        <Stack p="md" gap="lg">
          {selectedConversation ? (
            msgs.map((m: Message) => (
              <Group key={m.id} justify={m.sender === 'user' ? 'flex-end' : 'flex-start'}>
                {m.sender === 'bot' && <Avatar color="blue" radius="xl">AI</Avatar>}
                <Paper shadow="sm" p="sm" radius="lg" withBorder style={{ backgroundColor: m.sender === 'user' ? '#228be6' : '#f1f3f5', color: m.sender === 'user' ? 'white' : 'black', maxWidth: '70%' }}>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{m.text}</Text>
                </Paper>
                {m.sender === 'user' && <Avatar color="cyan" radius="xl">ME</Avatar>}
              </Group>
            ))
          ) : (
            <Center style={{ height: 300 }}>
              <Title order={4}>Open “Conversations” or click “New Chat” to begin</Title>
            </Center>
          )}
        </Stack>
      </ScrollArea>
      <Paper withBorder p="sm" radius="md" mt="md">
        <Group justify="center" align="center">
          <Text c="dimmed" style={{ flex: 1, minHeight: '24px' }}>{isRecording ? 'Listening...' : (transcript || 'Press the button to speak')}</Text>
          <ActionIcon 
            size="xl" 
            radius="xl"
            variant="filled"
            color={isRecording ? 'red' : 'blue'}
            onClick={handleToggleRecording}
            loading={loading}
            disabled={!token}
          >
            {isRecording ? <IconPlayerStop size={24} /> : <IconMicrophone size={24} />}
          </ActionIcon>
        </Group>
      </Paper>
      <Text c="dimmed" ta="center" size="xs" mt="xs">
        Athena is a student project and can make mistakes. Emotion analysis may also be inaccurate. Please remember to clarify important information.
      </Text>
      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Conversations" position="right">
        <Stack>
          <Button fullWidth leftSection={<IconPlus size={16} />} onClick={handleNewConversation}>New Chat</Button>
          <Divider />
          <Box>
            {convs.map((c) => (
              <NavLink key={c.id} label={c.label} leftSection={<IconMessage2 size={16} />} active={selectedConversation?.id === c.id} onClick={() => { selectConversation(c.id); setDrawerOpen(false); }} style={{ borderRadius: 8 }} />
            ))}
          </Box>
        </Stack>
      </Drawer>
    </div>
  );
}

export default VoicePage;