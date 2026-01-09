// src/pages/DashboardPage.tsx
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Progress,
  Select,
  MultiSelect,
  Stack,
  Text,
  Title,
  Divider,
  Anchor,
} from "@mantine/core";
import {
  IconChevronRight,
  IconFilterX,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import "./DashboardPage.css";

export function DashboardPage() {
  // --- mock values (swap with real analysis later) ---
  const kpis = [
    {
      label: "Mood Score",
      value: "72%",
      sub: "This week",
      progress: 72,
      tone: "teal" as const,
      delta: "+3%",
      deltaDir: "up" as const,
    },
    {
      label: "Positive Affect",
      value: "64%",
      sub: "vs baseline",
      progress: 64,
      tone: "blue" as const,
      delta: "+2.1%",
      deltaDir: "up" as const,
    },
    {
      label: "Stress Level",
      value: "28%",
      sub: "Lower is better",
      progress: 28,
      tone: "red" as const,
      delta: "-1.2%",
      deltaDir: "down" as const,
    },
    {
      label: "Sleep Quality",
      value: "6.8h",
      sub: "Self-report",
      progress: 68,
      tone: "grape" as const,
      delta: "+0.3h",
      deltaDir: "up" as const,
    },
    {
      label: "Sessions This Week",
      value: "5",
      sub: "Conversations",
      progress: 50,
      tone: "cyan" as const,
      delta: "+1",
      deltaDir: "up" as const,
    },
    {
      label: "Risk Alerts",
      value: "Low",
      sub: "Flagged items",
      progress: 20,
      tone: "green" as const,
      delta: "0",
      deltaDir: "up" as const,
    },
  ];

  // Example chart data (0–100 scale)
  const dailyMood = [
    { label: "Mon", pos: 58, neg: 22 },
    { label: "Tue", pos: 65, neg: 18 },
    { label: "Wed", pos: 55, neg: 27 },
    { label: "Thu", pos: 78, neg: 12 },
    { label: "Fri", pos: 70, neg: 20 },
    { label: "Sat", pos: 80, neg: 10 },
    { label: "Sun", pos: 68, neg: 19 },
  ];

  const emotionIntensity = [
    { label: "Joy", v: 63 },
    { label: "Calm", v: 58 },
    { label: "Sadness", v: 35 },
    { label: "Anger", v: 28 },
    { label: "Fear", v: 31 },
    { label: "Surprise", v: 22 },
  ];

  return (
    <div className="dashboard-root">
      {/* Breadcrumb / Title row */}
      <Group justify="space-between" align="center" className="dash-header">
        <Group gap="xs" className="dash-breadcrumb">
          <Title order={3} className="crumb-muted">
            Dashboard
          </Title>
          <IconChevronRight size={16} />
          <Title order={3}>Emotional Overview</Title>
        </Group>

        <Button variant="light" size="sm" className="btn-outline">
          View data in detail
        </Button>
      </Group>

      {/* Summary + filters */}
      <Paper withBorder radius="md" p="md" className="section-card">
        <Stack gap="xs">
          <Title order={3} className="section-title">
            Conversation-based mental state
          </Title>
          <Text c="dimmed" size="sm">
            Aggregated signals from recent chats: mood score, affect balance, stress risk, and
            dominant emotions. Use filters to slice by time range or goal.
          </Text>

          <Group wrap="wrap" gap="sm" mt="xs" className="filter-row">
            <Select
              label="Time range"
              placeholder="This week"
              data={["Today", "This week", "This month", "Last 3 months", "All time"]}
              className="filter"
              defaultValue="This week"
              comboboxProps={{ shadow: "md" }}
            />
            <Select
              label="Primary goal"
              placeholder="All"
              data={["All", "Anxiety", "Low mood", "Sleep", "Stress management"]}
              className="filter"
              comboboxProps={{ shadow: "md" }}
            />
            <MultiSelect
              label="Risk level"
              placeholder="All levels"
              data={["Low", "Medium", "High"]}
              className="filter"
              comboboxProps={{ shadow: "md" }}
            />
            <Button
              variant="subtle"
              leftSection={<IconFilterX size={16} />}
              className="clear-btn"
            >
              Clear
            </Button>
          </Group>
        </Stack>
      </Paper>

      {/* KPI cards */}
      <Grid gutter="md" mt="md">
        {kpis.map((kpi, i) => (
          <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <Card withBorder radius="md" className="kpi-card">
              <Group justify="space-between" align="flex-start">
                <Text size="sm" fw={600}>
                  {kpi.label}
                </Text>
                <Badge variant="light" color={kpi.tone} radius="sm" className="kpi-badge">
                  {kpi.sub}
                </Badge>
              </Group>

              <Group mt="xs" align="baseline" gap="xs">
                <Text className="kpi-value">{kpi.value}</Text>
                <Group gap={4} className={`kpi-delta ${kpi.deltaDir}`}>
                  {kpi.deltaDir === "up" ? (
                    <IconArrowUpRight size={14} />
                  ) : (
                    <IconArrowDownRight size={14} />
                  )}
                  <Text size="sm" fw={600}>
                    {kpi.delta}
                  </Text>
                </Group>
              </Group>

              <Progress value={kpi.progress} color={kpi.tone} radius="xl" size="sm" mt="md" />
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Charts row */}
      <Grid gutter="md" mt="md" className="charts-grid">
        {/* Daily mood (Positive vs Negative affect) */}
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card withBorder radius="md" className="dashboard-card">
            <Stack gap={4}>
              <Text fw={600}>Daily mood score (0–100)</Text>
              <Text size="sm" c="dimmed">
                Positive vs negative affect from chats this week
              </Text>
            </Stack>
            <Divider my="sm" />
            <div className="chart-placeholder bar-chart">
              {dailyMood.map((d, idx) => (
                <div key={idx} className="bar-group">
                  <div className="bar bar-done" style={{ height: `${d.pos}%` }} />
                  <div className="bar bar-progress" style={{ height: `${d.neg}%` }} />
                  <span className="bar-caption">{d.label}</span>
                </div>
              ))}
              <div className="bar-legend">
                <span className="legend-box legend-done" /> Positive
                <span className="legend-gap" />
                <span className="legend-box legend-progress" /> Negative
              </div>
            </div>
          </Card>
        </Grid.Col>

        {/* Emotion intensity by category */}
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card withBorder radius="md" className="dashboard-card">
            <Stack gap={4}>
              <Text fw={600}>Emotion intensity</Text>
              <Text size="sm" c="dimmed">
                Peak strength of detected emotions (0–100)
              </Text>
            </Stack>
            <Divider my="sm" />
            <div className="chart-placeholder bar-chart">
              {emotionIntensity.map((b, idx) => (
                <div key={idx} className="bar-group single">
                  <div className="bar bar-done" style={{ height: `${b.v}%` }} />
                  <span className="bar-caption">{b.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </Grid.Col>

        {/* Emotion share donut */}
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
          <Card withBorder radius="md" className="dashboard-card">
            <Stack gap={4}>
              <Text fw={600}>Emotion share (this week)</Text>
              <Text size="sm" c="dimmed">
                Proportion of dominant emotions across chats
              </Text>
            </Stack>
            <Divider my="sm" />
            <div className="chart-placeholder donut-wrap">
              <div className="donut">
                {/* pure CSS donut; replace with real chart lib later */}
                <div className="donut-hole" />
              </div>
              <div className="donut-legend">
                <div>
                  <span className="legend-dot l1" /> Joy
                </div>
                <div>
                  <span className="legend-dot l2" /> Calm
                </div>
                <div>
                  <span className="legend-dot l3" /> Sadness
                </div>
                <div>
                  <span className="legend-dot l4" /> Anxiety
                </div>
              </div>
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Insights / footer */}
      <Group justify="space-between" mt="lg" className="foot-row">
        <Text size="sm" c="dimmed">
          These insights summarize emotional signals inferred from conversations. For wellness
          support only—not a diagnosis.
        </Text>
        <Group gap="md">
          <Anchor size="sm" c="dimmed">
            Export
          </Anchor>
          <Anchor size="sm" c="dimmed">
            Sort
          </Anchor>
          <Anchor size="sm" c="dimmed">
            🔍
          </Anchor>
        </Group>
      </Group>
    </div>
  );
}

export default DashboardPage;
