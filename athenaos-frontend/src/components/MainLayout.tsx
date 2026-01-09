import { useMemo, useState } from 'react';
import {
  AppShell, Burger, Group, ScrollArea, NavLink, Button, Divider, Box, Image,
} from '@mantine/core';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  IconHome2, IconNotes, IconBriefcase, IconPhone, IconLogin,
  IconMessages, IconLogout, IconUser, IconBook2, IconLayoutDashboard,
  IconMicrophone, IconCalendar,  
} from '@tabler/icons-react';
import { useAuthStore } from '../context/authStore';
import { AppFooter } from './Footer';
import logo from '../images/logo.png';

type LinkItem = { label: string; to: string; icon: React.ReactNode };

export function MainLayout() {
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const publicLinks: LinkItem[] = useMemo(
    () => [
      { label: 'Home', to: '/', icon: <IconHome2 /> },
      { label: 'Blog', to: '/blog', icon: <IconNotes /> },
      { label: 'Tutorial', to: '/tutorial', icon: <IconBook2 /> },
      { label: 'Services', to: '/services', icon: <IconBriefcase /> },
      { label: 'Contact', to: '/contact', icon: <IconPhone /> },
    ],
    []
  );

  const authLinks: LinkItem[] = useMemo(
    () =>
      isAuthenticated
        ? [
            { label: 'Chat', to: '/chat', icon: <IconMessages /> },
            { label: 'Voice', to: '/voice', icon: <IconMicrophone /> },
            { label: 'Profile', to: '/profile', icon: <IconUser /> },
            { label: 'Dashboard', to: '/dashboard', icon: <IconLayoutDashboard /> },
            { label: 'Productivity', to: '/productivity', icon: <IconCalendar /> }, // ← added here
          ]
        : [{ label: 'Login', to: '/login', icon: <IconLogin /> }],
    [isAuthenticated]
  );

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpened(false);
  };

  const hideFooterOn = ['/chat', '/voice'];
  const shouldShowFooter = !hideFooterOn.includes(location.pathname);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 260,
          breakpoint: 'sm',
          collapsed: { mobile: !opened, desktop: !opened },
        }}
        padding="md"
      >
        <AppShell.Header style={{ position: 'sticky', zIndex: 2000 }}>
          <Group h="100%" px="md" justify="space-between" style={{ width: '100%', position: 'relative' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              aria-label="Toggle sidebar"
            />

            <Box style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Link
                to="/"
                onClick={() => setOpened(false)}
                aria-label="Go to Home"
              >
                <Image src={logo} h={40} alt="AthenaAI Logo" />
              </Link>
            </Box>

            {isAuthenticated ? (
              <Button
                leftSection={<IconLogout size={16} />}
                variant="subtle"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Box w={90} />
            )}
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="sm" onClick={() => setOpened(false)}>
          <ScrollArea style={{ height: '100%' }} type="never">
            <Box mb="sm">
              {publicLinks.map((l) => (
                <NavLink
                  key={l.to}
                  label={l.label}
                  leftSection={l.icon}
                  component={Link}
                  to={l.to}
                  active={isActive(l.to)}
                  style={{ borderRadius: 8 }}
                />
              ))}
            </Box>
            <Divider my="xs" />
            <Box mt="xs">
              {authLinks.map((l) => (
                <NavLink
                  key={l.to}
                  label={l.label}
                  leftSection={l.icon}
                  component={Link}
                  to={l.to}
                  active={isActive(l.to)}
                  style={{ borderRadius: 8 }}
                />
              ))}
            </Box>
            {isAuthenticated && (
              <Box mt="md">
                <Button
                  fullWidth
                  variant="light"
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            )}
          </ScrollArea>
        </AppShell.Navbar>

        <AppShell.Main style={{ flexGrow: 1 }}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      {shouldShowFooter && <AppFooter />}
    </Box>
  );
}

export default MainLayout;
