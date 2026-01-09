// src/components/Footer.tsx
import { Text, Container, ActionIcon, Group, rem, Anchor, Stack } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
// THAY ĐỔI 1: Import useNavigate thay vì Link
import { useNavigate } from 'react-router-dom';
import classes from './Footer.module.css';

const footerLinks = [
  {
    title: 'About',
    links: [
      { label: 'Features', link: '/services' },
      { label: 'Tutorial', link: '/tutorial' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Blog', link: '/blog' },
      { label: 'Contact Us', link: '/contact' },
    ],
  },
];

export function AppFooter() {
  const navigate = useNavigate();

  const groups = footerLinks.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor<'a'>
        key={index}
        className={classes.link}
        href={link.link}
        onClick={(event) => {
          event.preventDefault();
          navigate(link.link);
        }}
      >
        {link.label}
      </Anchor>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        <Stack gap={rem(3)} mt={rem(5)}>
            {links}
        </Stack>
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
            <Text size="xl" fw={700}>AthenaAI</Text>
            <Text size="xs" c="dimmed">
                Personalized Support for Your Mental Well-being
            </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2025 AthenaAI. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}