import { useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Divider,
  Group,
  Highlight,
  Kbd,
  List,
  Paper,
  Progress,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCheck, IconInfoCircle, IconPlayerPlay, IconRocket, IconShield, IconWaveSquare, IconMessages, IconAlertTriangle, IconBulb, IconTerminal2 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import "./TutorialPage.css";

type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { key: "env", label: "Environment set up (Node, pnpm/npm, .env)", done: false },
  { key: "backend", label: "Backend running (Express + PostgreSQL)", done: false },
  { key: "frontend", label: "Frontend running locally", done: false },
  { key: "ai", label: "AI Service running", done: false },
  { key: "auth", label: "Register & Login tested", done: false },
  { key: "chat", label: "Chat page sends & receives messages", done: false },
  { key: "tts", label: "Text-to-Speech toggled and speaking", done: false },
];

const LS_KEY = "athena_tutorial_checklist_v1";

export function TutorialPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
    } catch {
      return DEFAULT_CHECKLIST;
    }
  });

  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const toggle = (key: string) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, done: !it.done } : it)));

  return (
    <Box className="page-container">
      <Title order={1} className="page-title">
        Athena <Highlight highlight="Tutorial">Tutorial</Highlight>{" "}
        <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
          Getting Started
        </Badge>
      </Title>

      <Text className="page-subtitle" c="dimmed">
        A quick, guided path to get your AthenaAI (TTS-enabled) running smoothly. Work through
        the tabs from left to right. Your progress auto-saves locally.
      </Text>

      <Paper className="page-progress" radius="md" p="md" withBorder>
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon variant="light" radius="xl">
              <IconRocket size={18} />
            </ThemeIcon>
            <Text fw={600}>Progress</Text>
          </Group>
          <Text c="dimmed">
            {completed}/{items.length} complete
          </Text>
        </Group>
        <Progress value={pct} mt="sm" />
      </Paper>

      <Tabs defaultValue="overview" className="page-tabs" keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="overview" leftSection={<IconInfoCircle size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="setup" leftSection={<IconWaveSquare size={16} />}>
            Setup
          </Tabs.Tab>
          <Tabs.Tab value="guide" leftSection={<IconBulb size={16} />}>
            Usage Guide
          </Tabs.Tab>
          <Tabs.Tab value="chat" leftSection={<IconMessages size={16} />}>
            Chat
          </Tabs.Tab>
          <Tabs.Tab value="voice" leftSection={<IconPlayerPlay size={16} />}>
            Voice (TTS)
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="faq" leftSection={<IconInfoCircle size={16} />}>
            FAQ
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
            <Title order={3} className="card-title">What this page covers</Title>
            <Text mt="xs">
              You’ll connect the <b>backend</b>, run the <b>frontend</b>, sign in, send a chat, and enable{" "}
              <b>Text-to-Speech</b>. If you get stuck, jump to the FAQ tab.
            </Text>

            <Divider my="md" />
            <Title order={4}>Fast links</Title>
            <List mt="xs">
              <List.Item>
                <Anchor onClick={() => navigate("/dashboard")}>Dashboard</Anchor>
              </List.Item>
              <List.Item>
                <Anchor onClick={() => navigate("/profile")}>Profile</Anchor>
              </List.Item>
              <List.Item>
                <Anchor onClick={() => navigate("/chat")}>Chat</Anchor>
              </List.Item>
              <List.Item>
                <Anchor onClick={() => navigate("/voice")}>Voice</Anchor>
              </List.Item>
            </List>

            <Alert mt="md" variant="light" color="blue" icon={<IconInfoCircle />}>
              Tip: Use <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to stop servers, and re-run after config changes.
            </Alert>
          </Card>

          <Card className="page-card checklist-card" withBorder padding="lg" radius="md">
            <Group justify="space-between" align="center">
              <Title order={3} className="card-title">Checklist</Title>
              <Badge variant="light" color={pct === 100 ? "teal" : "blue"}>
                {pct}% complete
              </Badge>
            </Group>

            <Stack mt="md" gap="sm">
              {items.map((it) => (
                <Button
                  key={it.key}
                  variant={it.done ? "light" : "default"}
                  className={`checklist-item ${it.done ? "done" : ""}`}
                  leftSection={it.done ? <IconCheck size={16} /> : null}
                  onClick={() => toggle(it.key)}
                >
                  {it.label}
                </Button>
              ))}
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="setup" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
             <Alert color="cyan" icon={<IconTerminal2 />} title="Important: Use Separate Terminals" mb="lg">
              Each of the three services (Backend, Frontend, AI Service) must be run in its own, separate terminal window or tab. The `dev` commands will occupy the terminal to run continuously.
            </Alert>
          
            <Title order={3} className="card-title">1) Backend</Title>
            <Text mt="xs">
              In your <b>first</b> terminal, from the project root:
            </Text>
            <Paper className="code-block" withBorder p="sm" radius="md">
              <Code block>{`cd athenaos-backend
# Rename .env.example to .env and update values
npm install           # or pnpm i
npm start           # http://localhost:8888 by default`}</Code>
            </Paper>

            <Text mt="md">
              Confirm health:
              <List mt="xs">
                <List.Item><Code>GET /health</Code> returns 200</List.Item>
                <List.Item>DB connection successful</List.Item>
                <List.Item><Code>CORS</Code> allows your Frontend URL</List.Item>
              </List>
            </Text>

            <Divider my="md" />

            <Title order={3} className="card-title">2) Frontend</Title>
            <Text mt="xs">
              In a <b>second</b> terminal, from the project root:
            </Text>
            <Paper className="code-block" withBorder p="sm" radius="md">
              <Code block>{`cd athenaos-frontend
# Rename .env.example to .env and update values
npm install           # or pnpm i
npm run dev           # http://localhost:5173`}</Code>
            </Paper>
            
            <Divider my="md" />

            <Title order={3} className="card-title">3) AI Service</Title>
            <Text mt="xs">
              In a <b>third</b> terminal, from the project root:
            </Text>
            <Paper className="code-block" withBorder p="sm" radius="md">
              <Code block>{`cd athenaos-ai-service
pip install -r requirements.txt
uvicorn main:app --reload`}</Code>
            </Paper>

            <Alert mt="lg" variant="light" color="orange" title="Note on Registration" icon={<IconAlertTriangle />}>
              When testing registration, remember that both <b>usernames and emails must be unique</b>. If you try to register with credentials that are already in the database, the request will fail.
            </Alert>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="guide" pt="md">
            <Card className="page-card" withBorder padding="lg" radius="md">
                <Title order={3} className="card-title">How to Talk to Athena</Title>
                <Text mt="xs">
                    Athena is an AI therapist specializing in mental and emotional well-being. To get the most helpful responses, it's best to interact with it as you would in a therapy session.
                </Text>

                <Divider my="md" />

                <Title order={4} c="teal">✅ What to Ask (In-Scope Topics)</Title>
                <Text mt="xs">Focus on your personal feelings, thoughts, and experiences. Athena is designed to help with:</Text>
                <List mt="sm" spacing="xs">
                    <List.Item><b>Exploring Emotions:</b> "I'm feeling really anxious about my exam tomorrow."</List.Item>
                    <List.Item><b>Difficult Situations:</b> "I had an argument with my friend and I don't know what to do."</List.Item>
                    <List.Item><b>Understanding Thoughts:</b> "I keep thinking that I'm not good enough for my job."</List.Item>
                    <List.Item><b>Self-Improvement:</b> "How can I build more confidence?"</List.Item>
                </List>

                <Divider my="md" />

                <Title order={4} c="red">❌ What Not to Ask (Out-of-Scope Topics)</Title>
                <Text mt="xs">Athena is not a general knowledge chatbot. It will decline to answer questions that are not related to its purpose, such as:</Text>
                <List mt="sm" spacing="xs">
                    <List.Item><b>General Knowledge:</b> "What is the capital of Australia?"</List.Item>
                    <List.Item><b>Instructions & Recipes:</b> "How do I cook pasta?"</List.Item>
                    <List.Item><b>Technical or Factual Questions:</b> "Write a python script for me."</List.Item>
                    <List.Item><b>Financial or Legal Advice:</b> "What stock should I buy?"</List.Item>
                </List>

                 <Alert mt="md" variant="light" color="blue" title="What Happens If You Ask an Out-of-Scope Question?" icon={<IconInfoCircle />}>
                    If you ask a question outside of Athena's expertise, it is programmed to respond with a polite refusal, like this:
                    <Paper withBorder p="xs" radius="sm" mt="xs">
                        <Text fz="sm" ff="monospace" c="dimmed">
                            "I'm sorry, I can only answer questions related to mental and emotional well-being. How are you feeling today?"
                        </Text>
                    </Paper>
                    This is expected behavior and confirms the system is working correctly.
                </Alert>

                <Divider my="md" />

                <Title order={4}>Safety Features</Title>
                 <List mt="sm" spacing="xs" icon={<ThemeIcon color="red" size={24} radius="xl"><IconShield size={16} /></ThemeIcon>}>
                    <List.Item>
                        <b>Crisis Detection:</b> If you express thoughts of self-harm or being in immediate danger, Athena is programmed to pause the conversation and provide immediate contact information for professional crisis services. Your safety is the top priority.
                    </List.Item>
                    <List.Item>
                        <b>Content Moderation:</b> Messages containing clear hate speech or abusive language will be automatically blocked by a safety filter to maintain a constructive environment.
                    </List.Item>
                </List>
            </Card>
        </Tabs.Panel>

        <Tabs.Panel value="chat" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
            <Group justify="space-between" align="center">
              <Title order={3} className="card-title">Test Text Chat</Title>
              <Badge color="blue" variant="light">Core Feature</Badge>
            </Group>
            <Text mt="xs">
              On the Chat page, type your message into the input box and press <b>Send</b>. The AI will respond in text. This is the primary way to interact with Athena.
            </Text>
            <Divider my="md" />
            <Title order={4}>Functionality</Title>
            <List mt="xs">
              <List.Item>Real-time conversation with the AI.</List.Item>
              <List.Item>Emotion analysis is performed on every message.</List.Item>
              <List.Item>Conversation history is saved to your profile.</List.Item>
            </List>
            <Group mt="md">
              <Button leftSection={<IconPlayerPlay size={16} />} onClick={() => navigate("/chat")}>
                Try it in Chat
              </Button>
            </Group>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="voice" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
            <Group justify="space-between" align="center">
              <Title order={3} className="card-title">Enable Voice Conversation</Title>
              <Badge color="teal" variant="light">TTS Enabled build</Badge>
            </Group>
            <Text mt="xs">
              On the <b>Voice</b> page, press the <b>microphone icon</b> to start a voice conversation. If your browser prompts for microphone permissions, click <b>Allow</b>.
            </Text>
            <Divider my="md" />
            <Title order={4}>Troubleshooting</Title>
            <List mt="xs">
              <List.Item>
                No sound? Check your system's audio output device and browser settings.
              </List.Item>
              <List.Item>
                Voice not recognized? Ensure you have allowed microphone permissions for this site.
              </List.Item>
              <List.Item>
                AI voice sounds robotic? The quality depends on the TTS provider configured on the backend.
              </List.Item>
            </List>
            <Group mt="md">
              <Button leftSection={<IconPlayerPlay size={16} />} onClick={() => navigate("/voice")}>
                Try it in Voice
              </Button>
            </Group>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
            <Title order={3} className="card-title">Security quick-wins</Title>
            <List mt="xs">
              <List.Item>Never commit real secrets — use <Code>.env</Code> and a secrets manager in prod.</List.Item>
              <List.Item>
                CORS locked to your known origins (e.g., <Code>http://localhost:5173</Code> and your deployed FE).
              </List.Item>
              <List.Item>Use HTTPS in production and secure cookies if you store tokens.</List.Item>
              <List.Item>Validate inputs on both client and server.</List.Item>
            </List>

            <Accordion mt="md" variant="separated">
              <Accordion.Item value="cors">
                <Accordion.Control>Example CORS allowlist (backend)</Accordion.Control>
                <Accordion.Panel>
                  <Paper className="code-block" withBorder p="sm" radius="md">
                    <Code block>{`const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked for origin: ' + origin));
  },
  credentials: true,
}));`}</Code>
                  </Paper>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="faq" pt="md">
          <Card className="page-card" withBorder padding="lg" radius="md">
            <Title order={3} className="card-title">FAQ</Title>
            <Accordion mt="md" variant="separated">
              <Accordion.Item value="blank-screen">
                <Accordion.Control>Blank screen on localhost?</Accordion.Control>
                <Accordion.Panel>
                  Check your console for TypeScript import errors, then verify routes in <Code>App.tsx</Code>.
                  Restart <Code>npm run dev</Code> after fixing.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="unique-user-error">
                <Accordion.Control>Why is my new account registration failing?</Accordion.Control>
                <Accordion.Panel>
                  This almost always means the <b>username or email you chose is already taken</b>. The system requires every user to have a unique username and a unique email address. Please try registering again with different credentials.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="auth-fail">
                <Accordion.Control>Login/Registration failing?</Accordion.Control>
                <Accordion.Panel>
                  Test the API directly:
                  <Paper className="code-block" withBorder p="sm" radius="md" mt="xs">
                    <Code block>{`# Example (PowerShell):
$body = @{ username='testuser'; email='test@example.com'; password='Secret123!' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8888/api/auth/register -ContentType 'application/json' -Body $body`}</Code>
                  </Paper>
                  If API works but FE fails, check <Code>VITE_API_BASE</Code> and network tab.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="chat-connection">
                <Accordion.Control>Chat responds with 'lost connection' or other errors?</Accordion.Control>
                <Accordion.Panel>
                  The system may be undergoing maintenance, which can cause temporary errors. Please try again after a few minutes.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="tts-not-speaking">
                <Accordion.Control>TTS toggle on but no audio?</Accordion.Control>
                <Accordion.Panel>
                  Ensure your browser has microphone/speaker permissions and no tab is muted. Try another voice
                  in your OS settings or refresh the page.
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="http-error">
                <Accordion.Control>Getting HTTP errors (e.g., 404, 500)?</Accordion.Control>
                <Accordion.Panel>
                  This can sometimes happen due to a temporary server or connection issue. The first step is to try reloading the page using <Kbd>Ctrl</Kbd> + <Kbd>R</Kbd>. If the problem persists, logging out and logging back in often resolves it by re-establishing a fresh connection state.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Card>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={() => setItems(DEFAULT_CHECKLIST)}>Reset checklist</Button>
        <Button color="teal" leftSection={<IconCheck size={16} />} onClick={() => navigate("/chat")}>
          All set — go to Chat
        </Button>
      </Group>
    </Box>
  );
}

export default TutorialPage;