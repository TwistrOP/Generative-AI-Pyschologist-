// src/pages/ContactPage.tsx
import { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Card,
  Group,
  Stack,
  Divider,
  Notification,
  Badge,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { TbMail, TbUser, TbMessage2, TbCheck, TbPhone, TbExternalLink, TbAlertTriangle } from 'react-icons/tb';

type Helpline = {
  name: string;
  desc: string;
  phone: string;
  tel: string;
  hours?: string;
  website?: string;
  tags?: string[];
};

export function ContactPage() {
  // ---- Contact form state ----
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; msg?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!msg.trim()) e.msg = 'Please enter your message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    console.log({ name, email, message: msg });
    setSent(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  // ---- Emergency helplines ----
  const helplines: Helpline[] = useMemo(
    () => [
      { name: 'Triple Zero (000)', desc: 'Police, Fire, or Ambulance — if you or someone else is in immediate danger.', phone: '000', tel: '000', tags: ['Emergency'] },
      { name: 'Lifeline', desc: '24/7 crisis support and suicide prevention.', phone: '13 11 14', tel: '13 11 14', hours: '24/7', website: 'https://www.lifeline.org.au', tags: ['Crisis', 'Counselling'] },
      { name: 'Beyond Blue', desc: 'Support for anxiety, depression and mental wellbeing.', phone: '1300 22 4636', tel: '1300224636', hours: '24/7', website: 'https://www.beyondblue.org.au', tags: ['Mental Health'] },
      { name: 'Suicide Call Back Service', desc: '24/7 phone and online counselling for people at risk of suicide.', phone: '1300 659 467', tel: '1300659467', hours: '24/7', website: 'https://www.suicidecallbackservice.org.au', tags: ['Crisis'] },
      { name: 'Kids Helpline (5–25)', desc: 'Free, confidential counselling for young people.', phone: '1800 55 1800', tel: '1800551800', hours: '24/7', website: 'https://kidshelpline.com.au', tags: ['Youth'] },
      { name: '1800RESPECT', desc: 'National sexual assault, domestic and family violence counselling service.', phone: '1800 737 732', tel: '1800737732', hours: '24/7', website: 'https://www.1800respect.org.au', tags: ['Safety', 'DV'] },
    ],
    []
  );

  return (
    <Container size="lg" py="xl">
      {/* Contact header */}
      <Group justify="space-between" mb="md">
        <Title order={2} style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact Us
        </Title>
      </Group>

      {sent && (
        <Notification
          withCloseButton
          onClose={() => setSent(false)}
          icon={<TbCheck />}
          color="teal"
          mb="md"
        >
          Thanks! Your message has been sent.
        </Notification>
      )}

      {/* Contact form + info */}
      <Group align="flex-start" grow mb="xl">
        {/* Form */}
        <Card withBorder radius="md" p="lg" shadow="sm" style={{ background: 'white', flex: 1 }}>
          <form onSubmit={onSubmit}>
            <Stack gap="md">
              <TextInput
                label="Full name"
                placeholder="Jane Doe"
                leftSection={<TbUser />}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                error={errors.name}
                required
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                leftSection={<TbMail />}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                error={errors.email}
                required
              />
              <Textarea
                label="Message"
                placeholder="How can we help?"
                minRows={5}
                leftSection={<TbMessage2 />}
                value={msg}
                onChange={(e) => setMsg(e.currentTarget.value)}
                error={errors.msg}
                required
              />
              <Group justify="flex-start" mt="sm">
                <Button type="submit">Send message</Button>
              </Group>
            </Stack>
          </form>
        </Card>

        {/* Info */}
        <Card withBorder radius="md" p="lg" shadow="sm" style={{ background: 'white', flex: 1 }}>
          <Title order={4} mb="xs">Contact Information</Title>
          <Text c="dimmed" size="sm" mb="md">
            We aim to reply within one business day.
          </Text>
          <Divider my="sm" />
          <Stack gap={4}>
            <Text><strong>Email:</strong> support@athena_ai.app</Text>
            <Text><strong>Hours:</strong> Mon–Fri, 9:00–17:00 AEST</Text>
            <Text c="dimmed" size="sm">
              For urgent help, see the helplines below.
            </Text>
          </Stack>
        </Card>
      </Group>

      {/* Divider with label */}
      <Divider
        my="xl"
        label="Emergency Contacts"
        labelPosition="center"
        size="md"
        color="red"
      />

      {/* Emergency & Helplines */}
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <TbAlertTriangle size={24} />
          <Title order={3} style={{ fontFamily: "'Playfair Display', serif" }}>
            Emergency & Helplines
          </Title>
        </Group>
        <Badge size="lg" variant="light" color="red">
          AUSTRALIA
        </Badge>
      </Group>
      <Text c="dimmed" mb="lg">
        If you are in immediate danger, call <Text span fw={700}>000</Text> now. These services are independent from AthenaAI.
      </Text>

      <Stack gap="md">
        {helplines.map((h) => (
          <Card key={h.name} withBorder radius="md" p="lg" shadow="sm" style={{ background: 'white' }}>
            <Group justify="space-between" align="flex-start" mb="xs">
              <div>
                <Title order={4}>{h.name}</Title>
                <Text size="sm" c="dimmed">{h.desc}</Text>
                {h.tags && (
                  <Group gap={6} mt="xs">
                    {h.tags.map((t) => (
                      <Badge key={t} variant="light">{t}</Badge>
                    ))}
                  </Group>
                )}
              </div>
              <Badge variant="outline">{h.hours ?? 'Hours vary'}</Badge>
            </Group>

            <Divider my="sm" />

            <Group gap="sm" wrap="wrap">
              <Button leftSection={<TbPhone />} component="a" href={`tel:${h.tel}`}>
                Call {h.phone}
              </Button>

              <CopyButton value={h.phone} timeout={1200}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy number'}>
                    <Button variant="light" onClick={copy} leftSection={<TbMessage2 />}>
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>

              {h.website && (
                <Button
                  variant="subtle"
                  component="a"
                  href={h.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftSection={<TbExternalLink />}
                >
                  Website
                </Button>
              )}
            </Group>
          </Card>
        ))}
      </Stack>

      {/* Disclaimer */}
      <Card withBorder radius="md" mt="xl" p="lg" style={{ background: 'white' }}>
        <Title order={5} mb={6}>Important Disclaimer</Title>
        <Text size="sm" c="dimmed">
          AthenaAI is <Text span fw={700}>not</Text> a crisis service and does not provide medical or emergency assistance.
          If you are in danger, experiencing a medical emergency, or thinking about harming yourself, call <Text span fw={700}>000</Text> or go to your nearest emergency department immediately.
          The helpline information above is provided for convenience and may change; please verify details directly with each service.
        </Text>
      </Card>
    </Container>
  );
}

export default ContactPage;
