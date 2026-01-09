import { Link, useNavigate } from 'react-router-dom';
import { Box, Center, Overlay, Text, ThemeIcon, Title, Container, SimpleGrid, Image, Divider, Group, Blockquote, ActionIcon, Button, Card, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import { FaFeatherAlt, FaQuoteLeft } from 'react-icons/fa';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { TbClockHour4, TbMessageChatbot, TbShieldCheck, TbMicrophone } from "react-icons/tb";
import { useAuthStore } from '../context/authStore';

import heroImg from '../images/Hero.jpeg';
import aiBlogImg from '../images/AI.jpeg';
import wellbeingImg from '../images/WellBeing.jpeg';
import logoImg from '../images/logo.jpg';
import welcomeImg from '../images/WelcomePic.jpeg';

const HeroSection = ({ onCTAClick }: { onCTAClick: (to: string) => void }) => (
  <Box
    mx={"calc(var(--app-shell-padding) * -1)"}
    pos="relative"
    h="calc(100vh - var(--app-shell-header-height))"
    style={{
      backgroundImage: `url(${heroImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <Overlay color="#000" opacity={0.3} zIndex={1} />
    <Center pos="relative" h="100%" style={{ zIndex: 2 }}>
      <Box ta="center" c="white">
        <ThemeIcon variant="outline" color="white" radius="xl" size={60} mb="lg">
            <FaFeatherAlt style={{ width: '60%', height: '60%' }} />
        </ThemeIcon>
        <Title order={1} fz={{ base: '3.5rem', md: '5rem' }} style={{ fontFamily: "'Playfair Display', serif" }}>
          AthenaAI
        </Title>
        <Text size="xl" mt="md" style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.05em' }}>
          Personalized Support for Your Mental Well-being
        </Text>
        
        <Group justify="center" mt={40}>
          <Button
            size="lg"
            radius="xl"
            onClick={() => onCTAClick('/chat')}
            leftSection={<TbMessageChatbot size={20} />}
          >
            Start Chat
          </Button>
          <Button
            size="lg"
            radius="xl"
            variant="default"
            onClick={() => onCTAClick('/voice')}
            leftSection={<TbMicrophone size={20} />}
          >
            Try Voice
          </Button>
        </Group>

      </Box>
    </Center>
  </Box>
);

const WelcomeSection = () => (
  <Container
    size="lg"
    py={{ base: 'xl', md: 80 }}
    bg="white"
    p="xl"
    style={{
      marginTop: '-80px',
      position: 'relative',
      zIndex: 10,
    }}
  >
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
      <Image
        radius="sm"
        src={welcomeImg}
        alt="Welcome illustration"
      />
      <Center>
        <Box ta={{ base: 'center', md: 'left' }}>
          <Title order={2} style={{ fontFamily: "'Playfair Display', serif" }} fw={500}>
            A New Era of Support
          </Title>
          <Text size="xl" mt="sm" mb="md" style={{ fontFamily: "'Playfair Display', serif" }}>
            Accessible, Anytime, Anywhere.
          </Text>
          <Text c="dimmed">
            Embarking on a journey towards mental wellness is a significant step. AthenaAI harnesses the power of Generative AI to provide you with a personalized and confidential space to explore your thoughts. Our system is designed to complement traditional therapy, offering real-time, evidence-based support whenever you need it.
          </Text>
          <Text
            component={Link}
            to="/services"
            c="dark"
            fw={500}
            mt="lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Discover Our Services <IoIosArrowRoundForward size={24} />
          </Text>
        </Box>
      </Center>
    </SimpleGrid>
  </Container>
);

const HowCanWeHelpSection = () => {
  const features = [
    {
      icon: <TbClockHour4 size={40} />,
      title: 'ACCESSIBLE',
      description: 'Our platform is available 24/7, providing you with support whenever you need it. Break down barriers of time and location, and access therapeutic conversations from the comfort of your own space.',
    },
    {
      icon: <TbMessageChatbot size={40} />,
      title: 'PERSONALIZED',
      description: 'Leveraging Generative AI, AthenaOS tailors each interaction to your unique needs and goals. The conversation evolves with you, ensuring a truly personal and adaptive therapeutic journey.',
    },
    {
      icon: <TbShieldCheck size={40} />,
      title: 'EFFECTIVE & SECURE',
      description: 'Built on the principles of Cognitive Behavioral Therapy (CBT), our methods are evidence-based. Your privacy is our priority; all data is encrypted and stored securely, ensuring a confidential experience.',
    },
  ];

  return (
    <Container size="lg" py={{ base: 'xl', md: 80 }}>
      <Group mb="xl">
        <Title order={2} style={{ fontFamily: "'Playfair Display', serif" }} fw={500}>How Can We Help?</Title>
        <Divider style={{ flex: 1 }} />
      </Group>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 'xl', md: 50 }}>
        {features.map((feature) => (
          <Box key={feature.title} ta="center">
            <ThemeIcon variant="transparent" c="dark" size={60} mx="auto" mb="md">
              {feature.icon}
            </ThemeIcon>
            <Text fw={600} tt="uppercase" mb="sm">{feature.title}</Text>
            <Text c="dimmed" fz="sm">{feature.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    "For the first time, I felt like I had a space to talk without judgment, any time of day. AthenaAI was there for me during late-night anxiety peaks. It's truly revolutionary.",
    "The AI's ability to remember and connect my thoughts from previous sessions is incredible. It feels deeply personal, like it genuinely understands my journey. It helped me see patterns I never noticed before.",
    "As someone hesitant about therapy, this was the perfect first step. The CBT-based approach gave me practical tools and exercises that I could apply immediately to my daily life. It's empowering.",
    "I was worried about privacy, but knowing everything is encrypted gave me the confidence to be completely open. This level of security is something I value immensely.",
    "I've recommended AthenaOS to friends who are struggling. It's not a replacement for my therapist, but it's an amazing companion that supports the work we do together. A fantastic tool for in-between sessions."
  ];

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <Box bg="gray.1" py={{ base: 'xl', md: 80 }}>
      <Container size="md">
        <Blockquote
          color="gray"
          cite=""
          icon={<FaQuoteLeft />}
          iconSize={40}
          p="xl"
          style={{ borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', minHeight: '250px', display: 'flex', alignItems: 'center' }}
        >
          <Text size="lg" ta="center" style={{ fontFamily: "'Playfair Display', serif" }}>
            {testimonials[activeIndex]}
          </Text>
        </Blockquote>

        <Group justify="space-between" mt="xl">
          <Text c="dimmed" fz="sm">
            {activeIndex + 1} / {testimonials.length}
          </Text>
          <Group gap="xs">
            <ActionIcon onClick={handlePrev} variant="transparent" c="dark" size="lg">
              <IoIosArrowRoundBack size={30} />
            </ActionIcon>
            <ActionIcon onClick={handleNext} variant="transparent" c="dark" size="lg">
              <IoIosArrowRoundForward size={30} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

const MeetAthenaSection = ({ onLinkClick }: { onLinkClick: (to: string) => void }) => (
    <Container size="lg" py={{ base: 'xl', md: 80 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} verticalSpacing={50}>
            <Center>
                <Box ta={{ base: 'center', md: 'left' }}>
                    <Title order={2} style={{ fontFamily: "'Playfair Display', serif" }} fw={500}>Meet Athena</Title>
                    <Text c="dimmed" mt="lg">
                        My name is Athena, and I am a generative AI companion engineered for empathetic conversation. My core purpose is to provide a safe, non-judgmental space for you to explore your thoughts and feelings.
                    </Text>
                    <Text c="dimmed" mt="md">
                        I am built upon the proven principles of Cognitive Behavioral Therapy (CBT) and trained on a diverse range of therapeutic dialogues. While I am not a replacement for a human therapist, I am designed to be a powerful, evidence-based tool to help you build resilience, understand your own mind, and develop practical coping strategies.
                    </Text>
                    <Text
                        component="button"
                        onClick={() => onLinkClick('/chat')}
                        c="dark"
                        fw={500}
                        mt="lg"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        Learn more about the technology <IoIosArrowRoundForward size={24} />
                    </Text>
                </Box>
            </Center>
            <Box pos="relative">
                <Image
                    radius="sm"
                    src={logoImg}
                    alt="Athena Logo"
                />
                <ThemeIcon
                    variant="filled"
                    color="#F8F7F4"
                    c="dark"
                    radius="xl"
                    size={80}
                    style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: '-20px',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Text fz={40} fw={500} style={{ fontFamily: "'Playfair Display', serif" }}>A</Text>
                </ThemeIcon>
            </Box>
        </SimpleGrid>
    </Container>
);

const BlogSection = () => {
    const blogPosts = [
        { title: 'Techniques for Managing Daily Anxiety', image: wellbeingImg },
        { title: 'How AI Can Support Your Therapy Journey', image: aiBlogImg },
        { title: 'The Importance of Self-Compassion', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2940&auto=format=fit=crop' }
    ];
    return (
        <Box bg="white" py={{ base: 'xl', md: 80 }}>
            <Container size="lg">
                <Center>
                    <Box ta="center" mb={50}>
                        <Title order={2} style={{ fontFamily: "'Playfair Display', serif" }} fw={500}>On the Blog</Title>
                        <Text mt="sm" style={{ fontFamily: "'Playfair Display', serif" }}>Educational Advice & Tips</Text>
                    </Box>
                </Center>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    {blogPosts.map(post => (
                        <Card key={post.title} shadow="sm" p="lg" radius="md" withBorder component="a" href="#">
                            <Card.Section>
                                <Image src={post.image} height={160} alt={post.title} />
                            </Card.Section>
                            <Text fw={500} ta="center" mt="md">{post.title}</Text>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export function HomePage() {
  const [modalOpened, setModalOpened] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const handleProtectedLinkClick = (to: string) => {
    if (isAuthenticated) {
      navigate(to);
    } else {
      setModalOpened(true);
    }
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Authentication Required"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack align="center" gap="md">
            <Text ta="center">You need to be logged in to access this feature.</Text>
            <Title order={4}>Already have an account?</Title>
            <Button fullWidth component={Link} to="/login" onClick={() => setModalOpened(false)}>
                Sign In
            </Button>
            <Divider label="OR" labelPosition="center" my="xs" style={{ width: '100%' }} />
            <Text ta="center">Don't have an account yet?</Text>
            <Button fullWidth variant="default" component={Link} to="/login" onClick={() => setModalOpened(false)}>
                Sign Up
            </Button>
        </Stack>
      </Modal>

      <HeroSection onCTAClick={handleProtectedLinkClick} />
      <WelcomeSection />
      <HowCanWeHelpSection />
      <TestimonialsSection />
      <MeetAthenaSection onLinkClick={handleProtectedLinkClick} />
      <BlogSection />
    </>
  );
}