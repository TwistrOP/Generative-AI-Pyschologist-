// src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FileButton,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAt,
  IconCalendarEvent,
  IconCamera,
  IconCheck,
  IconCirclePlus,
  IconMapPin,
  IconMessageDots,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { useChatStore } from "../context/chatStore";
import "./ProfilePage.css";

// Type definitions for type safety
type Message = {
  content: string;
};

type Conversation = {
  id: string;
  title?: string;
  preview?: string;
  updatedAt: string | number;
  createdAt: string | number;
  messages: Message[];
};

type UserLike = {
  id?: string | number;
  username?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  phone?: string;
  dob?: string;
};

type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

const makeKey = (userId: string | number | undefined, what: "checklist" | "avatar") =>
  `athena_profile_${userId ?? "anon"}_${what}`;

// Helper function from the updated file, needed for the UI
function timeAgo(ts: number) {
  const sec = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}

export function ProfilePage() {
  const navigate = useNavigate();

  // Use `any` with eslint-disable for robust interaction with untyped stores
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated as boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useAuthStore((s: any) => s.token as string | undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAuthStore((s: any) => s.user as UserLike | undefined);
  const displayName = user?.name || user?.username || "User";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = useChatStore((s: any) => s.conversations as Conversation[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchConversations = useChatStore((s: any) => s.fetchConversations);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectConversation = useChatStore((s: any) => s.selectConversation);

  useEffect(() => {
    if (token && (!conversations || conversations.length === 0)) {
      fetchConversations(token);
    }
  }, [token, conversations, fetchConversations]);

  // Data processing with variable names matching the new UI
  const totalConversations = Array.isArray(conversations) ? conversations.length : 0;
  const totalMessages = useMemo(() => {
    if (!Array.isArray(conversations)) return 0;
    return conversations.reduce(
      (sum: number, c: Conversation) => sum + (c.messages?.length ?? 0),
      0
    );
  }, [conversations]);

  const recentActive = Math.min(totalConversations, 1);
  const recent = useMemo(() => {
    const arr = Array.isArray(conversations) ? [...conversations] : [];
    return arr
      .sort(
        (a: Conversation, b: Conversation) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [conversations]);

  // Avatar Logic
  const avatarKey = makeKey(user?.id, "avatar");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(avatarKey);
      if (saved) setAvatarDataUrl(saved);
    } catch (error) {
      console.warn("Failed to read avatar from localStorage:", error);
    }
  }, [user?.id, avatarKey]);

  const handleAvatarFile = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarDataUrl(dataUrl);
      try {
        localStorage.setItem(avatarKey, dataUrl);
      } catch (error) {
        console.warn("Failed to save avatar to localStorage:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetAvatar = () => {
    setAvatarDataUrl(null);
    try {
      localStorage.removeItem(avatarKey);
    } catch (error) {
      console.warn("Failed to remove avatar from localStorage:", error);
    }
  };

  // Checklist Logic
  const checklistKey = makeKey(user?.id, "checklist");
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(checklistKey);
      setItems(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.warn("Failed to read checklist from localStorage:", error);
      setItems([]);
    }
  }, [user?.id, checklistKey]);

  useEffect(() => {
    try {
      localStorage.setItem(checklistKey, JSON.stringify(items));
    } catch (error) {
      console.warn("Failed to save checklist to localStorage:", error);
    }
  }, [items, checklistKey]);

  const completed = items.filter((i) => i.done).length;
  const pct = items.length === 0 ? 0 : Math.round((completed / items.length) * 100);

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    const id = window.crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
    setItems((prev) => [{ id, text, done: false, createdAt: Date.now() }, ...prev]);
    setNewText("");
  };

  const toggleItem = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  // RENDER LOGIC
  if (!isAuthenticated) {
    return (
      <Stack align="center" gap="md" className="profile-container">
        <Title order={2}>Profile</Title>
        <Text c="dimmed">You’re not logged in.</Text>
        <Button component={Link} to="/login">Login</Button>
      </Stack>
    );
  }

  // ===== FINAL JSX from the updated (correct layout) file =====
  return (
    <Box className="profile-container">
      {/* Header row: breadcrumb-ish + Edit profile */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Text fw={600} c="dimmed">Dashboard</Text>
          <Text c="dimmed">›</Text>
          <Title order={2}>Profile</Title>
        </Group>
      </Group>

      {/* Top stat tiles */}
      <Grid className="stats-grid" gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="stat-card">
            <Text size="sm" fw={600}>Total conversations</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{totalConversations}</Text>
            </Group>
            <Progress value={Math.min(100, totalConversations * 10)} mt="sm" />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="stat-card">
            <Text size="sm" fw={600}>Messages (sum)</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{totalMessages}</Text>
            </Group>
            <Progress color="green" value={Math.min(100, totalMessages * 5)} mt="sm" />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="stat-card">
            <Text size="sm" fw={600}>Recent active</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{recentActive}</Text>
            </Group>
            <Progress color="violet" value={recentActive > 0 ? 40 : 0} mt="sm" />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid mt="md" gutter="md">
        {/* LEFT COLUMN — Profile panel + Checklist */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          {/* Profile card */}
          <Card withBorder radius="md" className="profile-card">
            <Group align="flex-start" justify="space-between" wrap="nowrap">
              <Group align="center">
                <Avatar src={avatarDataUrl ?? user?.avatarUrl ?? undefined} size={80} radius="xl">
                  <IconUser />
                </Avatar>
                <Box>
                  <Group gap="sm">
                    <Text fw={700} size="lg">{displayName}</Text>
                    <Badge color="teal" variant="light">Authenticated</Badge>
                  </Group>
                  <Text size="sm" c="dimmed">No description provided yet.</Text>
                </Box>
              </Group>

              <Group gap="xs">
                <FileButton onChange={handleAvatarFile} accept="image/png,image/jpeg,image/webp">
                  {(props) => (
                    <Button variant="light" leftSection={<IconCamera size={16} />} {...props}>
                      Change
                    </Button>
                  )}
                </FileButton>
                <Button variant="subtle" color="red" onClick={resetAvatar}>
                  Reset
                </Button>
              </Group>
            </Group>

            <Divider my="md" />

            <Stack gap="sm">
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text fw={600}>Address</Text>
              </Group>
              <Text c="dimmed">{user?.address || "—"}</Text>

              <Divider variant="dashed" />

              <Group gap="xs">
                <IconAt size={18} />
                <Text fw={600}>Email</Text>
              </Group>
              <Text c="dimmed">{user?.email ?? "—"}</Text>

              <Divider variant="dashed" />

              <Group gap="xs">
                <IconPhone size={18} />
                <Text fw={600}>Phone</Text>
              </Group>
              <Text c="dimmed">{user?.phone ?? "—"}</Text>

              <Divider variant="dashed" />

              <Group gap="xs">
                <IconCalendarEvent size={18} />
                <Text fw={600}>DOB</Text>
              </Group>
              <Text c="dimmed">{user?.dob ?? "—"}</Text>
            </Stack>

            <Text size="sm" c="dimmed" mt="lg">
              Profile data is synced to your account
            </Text>
          </Card>

          {/* Checklist card */}
          <Card withBorder radius="md" className="profile-card" mt="md">
            <Group justify="space-between" align="center">
              <Text fw={700}>To-do checklist</Text>
              <Group gap="sm" align="center" wrap="nowrap" style={{ minWidth: 220 }}>
                <Text size="sm" c="dimmed">
                  {completed}/{items.length} complete
                </Text>
                <Progress value={pct} w={120} />
              </Group>
            </Group>

            <Group mt="md" wrap="nowrap" align="flex-end">
              <TextInput
                label="Add an item"
                placeholder="e.g., Verify email, try TTS, complete onboarding"
                value={newText}
                onChange={(e) => setNewText(e.currentTarget.value)}
                className="flex-1"
              />
              <Button onClick={addItem} leftSection={<IconCirclePlus size={16} />}>
                Add
              </Button>
            </Group>

            <Divider my="md" />

            {items.length === 0 ? (
              <Text c="dimmed">No tasks yet — add your first one above.</Text>
            ) : (
              <Stack gap="xs">
                {items.map((it) => (
                  <Paper
                    key={it.id}
                    withBorder
                    radius="md"
                    p="xs"
                    className={`checklist-row ${it.done ? "is-done" : ""}`}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group wrap="nowrap" gap="sm" align="center">
                        <Button
                          size="xs"
                          variant={it.done ? "light" : "default"}
                          onClick={() => toggleItem(it.id)}
                          leftSection={it.done ? <IconCheck size={14} /> : undefined}
                        >
                          {it.done ? "Done" : "Mark done"}
                        </Button>
                        <Text
                          className="checklist-text"
                          td={it.done ? "line-through" : undefined}
                          c={it.done ? "dimmed" : undefined}
                        >
                          {it.text}
                        </Text>
                      </Group>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => removeItem(it.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Card>
        </Grid.Col>

        {/* RIGHT COLUMN — Chat history */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" className="profile-card">
            <Group justify="space-between" align="center" mb="sm">
              <Group gap="xs" align="center">
                <IconMessageDots size={20} />
                <Title order={3}>Chat history</Title>
              </Group>
              <Anchor onClick={() => navigate("/chat")}>Go to chat</Anchor>
            </Group>

            <Divider mb="sm" />

            {(!recent || recent.length === 0) ? (
              <Text c="dimmed">No conversations yet.</Text>
            ) : (
              <Table striped highlightOnHover withRowBorders={false} verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Last activity</Table.Th>
                    <Table.Th>Messages</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recent.map((conv: Conversation) => {
                    const label =
                      conv?.title ||
                      conv?.preview ||
                      (conv?.messages?.[0]?.content?.slice(0, 48) ?? "Conversation");
                    const when = new Date(conv?.updatedAt || conv?.createdAt || Date.now());
                    const ago = timeAgo(when.getTime());
                    const msgCount = conv?.messages?.length ?? 0;

                    return (
                      <Table.Tr key={conv?.id}>
                        <Table.Td>
                          <Group gap="xs" align="center">
                            <Avatar size={20} radius="xl">💬</Avatar>
                            <Text>{label}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{when.toLocaleString()} ({ago})</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light">{msgCount}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              if (selectConversation) {
                                  selectConversation(conv.id);
                              }
                              navigate("/chat");
                            }}
                          >
                            Resume
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}