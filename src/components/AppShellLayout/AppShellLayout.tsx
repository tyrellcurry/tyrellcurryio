import { AppShell, Burger, Group, Skeleton, ScrollArea, Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import DarkModeToggle from '../Button/DarkModeToggle/DarkModeToggle';
import SocialButton from '../Button/SocialButton/SocialButton';
import { IconDownload } from '@tabler/icons-react';
interface AppShellLayoutProps {
  children: React.ReactNode;
}

const AppShellLayout = ({ children }: AppShellLayoutProps) => {
  const [navOpened, { toggle: toggleNav }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !navOpened, desktop: !navOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={navOpened} onClick={toggleNav} size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar px="md" pb="md">
        <AppShell.Section grow component={ScrollArea}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section mb={12}>
          <Button fullWidth rightSection={<IconDownload size={14} />}>
            Download My Resume
          </Button>
        </AppShell.Section>
        <AppShell.Section>
          <Group justify="space-between">
            <Group>
              <SocialButton platform="Github" />
              <SocialButton platform="Linkedin" />
            </Group>
            <DarkModeToggle />
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default AppShellLayout;
