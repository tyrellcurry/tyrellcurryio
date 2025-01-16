import { AppShell, Burger, Group, Skeleton, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
interface AppShellLayoutProps {
  children: React.ReactNode;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const [navOpened, { toggle: toggleNav }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !navOpened, desktop: !navOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={navOpened} onClick={toggleNav} size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>Navbar header</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          Navbar footer – always at the bottom
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
