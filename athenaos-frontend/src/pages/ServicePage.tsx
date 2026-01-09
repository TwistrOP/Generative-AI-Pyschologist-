import {
  Accordion,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrain,
  IconMessage2,
  IconChartBar,
  IconNotebook,
  IconShieldLock,
  IconPhoneCall,
  IconChevronRight,
  IconClock,
  IconMicrophone,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import "./ServicePage.css";

export function ServicesPage() {
  const features = [
    {
      icon: <IconBrain size={22} />,
      title: "AI-Guided Therapy",
      desc:
        "Evidence-informed conversations that help you explore thoughts and emotions safely, anytime.",
    },
    {
      icon: <IconMessage2 size={22} />,
      title: "24/7 Chat & Voice",
      desc:
        "Reach out by text or voice whenever you need. Get grounding tips, coping tools, and gentle check-ins.",
    },
    {
      icon: <IconChartBar size={22} />,
      title: "Mood & Progress",
      desc:
        "Track mood, stress, and sleep over time. See patterns and small wins after each session.",
    },
    {
      icon: <IconNotebook size={22} />,
      title: "Journaling & Prompts",
      desc:
        "Guided prompts and reflection cards that turn quick notes into meaningful insights.",
    },
    {
      icon: <IconShieldLock size={22} />,
      title: "Privacy by Design",
      desc:
        "End-to-end TLS, role-based access, and strict retention controls. You’re in control of data.",
    },
    {
      icon: <IconPhoneCall size={22} />,
      title: "Crisis Resources",
      desc:
        "If stronger support is needed, we surface relevant helplines and local services fast.",
    },
  ];

  const steps = [
    {
      title: "Start a conversation",
      desc: "Say or type how you’re feeling, or pick a quick topic (stress, sleep, study, relationships).",
    },
    {
      title: "Get tools that fit",
      desc: "Receive bite-size skills (CBT, grounding, mindfulness) you can try immediately.",
    },
    {
      title: "Track & review",
      desc: "Your mood and notes update the dashboard so you can see trends week to week.",
    },
  ];

  return (
    <div className="services-page">
      <Container size="lg" py={32}>
        <Paper radius="md" p="xl" className="services-hero" withBorder>
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Stack gap={6} className="hero-copy">
              <Title order={1} className="services-title">
                Support that meets you where you are
              </Title>
              <Text c="dimmed" className="services-subtitle">
                Athena helps you manage stress, understand emotions, and build healthy habits —
                privately, on your schedule, through text or voice.
              </Text>
              <Group gap="xs" mt={6}>
                <Badge variant="light" size="sm">24/7</Badge>
                <Badge variant="light" size="sm" leftSection={<IconShieldLock size={14} />}>
                  Private
                </Badge>
                <Badge variant="light" size="sm" leftSection={<IconClock size={14} />}>
                  5-min check-ins
                </Badge>
              </Group>
            </Stack>

            <Group>
                <Button
                    size="md"
                    className="services-cta-button"
                    rightSection={<IconChevronRight size={16} />}
                    component={Link}
                    to="/chat"
                >
                    Start a chat
                </Button>
                <Button
                    size="md"
                    variant="default"
                    rightSection={<IconMicrophone size={16} />}
                    component={Link}
                    to="/voice"
                >
                    Try Voice
                </Button>
            </Group>
          </Group>
        </Paper>

        <Grid gutter="lg" mt={24}>
          {features.map((f, i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
              <Card className="service-card" shadow="sm" p="lg" radius="md" withBorder>
                <ThemeIcon size={40} radius="md" className="service-icon">
                  {f.icon}
                </ThemeIcon>
                <Title order={3} className="service-title">
                  {f.title}
                </Title>
                <Text className="service-desc">{f.desc}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Grid mt={32} gutter="lg" align="stretch">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" p="lg" className="why-card">
              <Title order={3}>Why people choose Athena</Title>
              <Divider my="sm" />
              <List spacing="xs" className="why-list">
                <List.Item>
                  Personalized suggestions after each conversation — you’ll always know “what to try next.”
                </List.Item>
                <List.Item>
                  Trackers that are simple by default: mood, stress, sleep, and one optional note.
                </List.Item>
                <List.Item>
                  Friendly reminders you control (daily, weekly, or off) — no spam, no pressure.
                </List.Item>
                <List.Item>
                  Clear data controls — export or delete your records from Settings anytime.
                </List.Item>
              </List>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" p="lg" className="steps-card">
              <Title order={3}>How it works</Title>
              <Divider my="sm" />
              <Grid gutter="md">
                {steps.map((s, i) => (
                  <Grid.Col key={i} span={12}>
                    <Group align="flex-start" gap="sm" wrap="nowrap">
                      <div className="step-number">{i + 1}</div>
                      <div>
                        <Text fw={700}>{s.title}</Text>
                        <Text c="dimmed" size="sm">
                          {s.desc}
                        </Text>
                      </div>
                    </Group>
                  </Grid.Col>
                ))}
              </Grid>
              <Button
                size="sm"
                mt="md"
                variant="light"
                component={Link}
                to="/chat"
                rightSection={<IconChevronRight size={16} />}
              >
                Try a 2-minute check-in
              </Button>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder radius="md" p="lg" mt={32} className="faq-card">
          <Title order={3}>Frequently asked questions</Title>
          <Divider my="sm" />
          <Accordion variant="separated">
            <Accordion.Item value="privacy">
              <Accordion.Control>How is my data protected?</Accordion.Control>
              <Accordion.Panel>
                All traffic uses TLS. Only minimal data is stored for your charts and is never sold.
                You can export or delete your records from Settings at any time.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="emergency">
              <Accordion.Control>Is Athena a replacement for therapy?</Accordion.Control>
              <Accordion.Panel>
                No. Athena is a wellness companion. If you’re in crisis or thinking about self-harm,
                contact emergency services or a local helpline immediately.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="cost">
              <Accordion.Control>Does it cost anything?</Accordion.Control>
              <Accordion.Panel>
                The core chat and check-ins are free for students. Premium features (advanced trends
                and export formats) are optional.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card>

        <Stack align="center" mt={36}>
          <Title order={2} className="services-cta-title">
            Ready to start your journey?
          </Title>
          <Text className="services-cta-desc">
            Open a private chat or voice session and take the first small step today.
          </Text>
          <Group>
            <Button
                className="services-cta-button"
                size="lg"
                component={Link}
                to="/chat"
                rightSection={<IconChevronRight size={18} />}
            >
                Start with Text
            </Button>
            <Button
                size="lg"
                variant="default"
                component={Link}
                to="/voice"
                rightSection={<IconMicrophone size={18} />}
            >
                Start with Voice
            </Button>
          </Group>
        </Stack>
      </Container>
    </div>
  );
}

export default ServicesPage;