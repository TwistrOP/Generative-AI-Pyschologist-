import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar, Badge, Box, Button, Card, Divider, Grid, Group,
  Progress, Stack, Table, Text, TextInput, Title, Select, Switch
} from "@mantine/core";
import { IconCalendarEvent, IconCirclePlus, IconClock, IconNote, IconTrash } from "@tabler/icons-react";
import "./ProductivityPage.css";

type NoteColor = "Yellow" | "Pink" | "Blue" | "Green";
type Note = {
  id: string;
  text: string;
  color: NoteColor;
  pinned: boolean;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
};

type Reminder = {
  id: string;
  title: string;
  whenISO: string; // local ISO
  done: boolean;
  createdAt: string;
};

type ThemeKey =
  | "theme-calm"
  | "theme-dark"
  | "theme-professional"
  | "theme-aesthetic"
  | "theme-ocean"
  | "theme-forest"
  | "theme-sunset"
  | "theme-slate"
  | "theme-lavender"
  | "theme-contrast";

const THEME_LS_KEY = "athena_productivity_theme";

const THEME_OPTIONS: { value: ThemeKey; label: string }[] = [
  { value: "theme-calm", label: "Calm" },
  { value: "theme-dark", label: "Dark" },
  { value: "theme-professional", label: "Professional" },
  { value: "theme-aesthetic", label: "Aesthetic" },
  { value: "theme-ocean", label: "Ocean" },
  { value: "theme-forest", label: "Forest" },
  { value: "theme-sunset", label: "Sunset" },
  { value: "theme-slate", label: "Slate" },
  { value: "theme-lavender", label: "Lavender" },
  { value: "theme-contrast", label: "High Contrast" },
];

const LS = {
  notes: "athena_productivity_notes_v1",
  reminders: "athena_productivity_reminders_v1",
  month: "athena_productivity_month_v1",
};

const COLOR_MAP: Record<NoteColor, string> = {
  Yellow: "#FFF59D",
  Pink: "#F8BBD0",
  Blue: "#BBDEFB",
  Green: "#C8E6C9",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** ======= Sticky Note (draggable) ======= */
function StickyNote({
  note,
  onChange,
  onDelete,
}: {
  note: Note;
  onChange: (n: Note) => void;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".note-drag")) return;
      drag.current = { sx: note.x, sy: note.y, ox: e.clientX, oy: e.clientY };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      if (!drag.current || !ref.current) return;
      const container = ref.current.parentElement!;
      const rectC = container.getBoundingClientRect();
      const rectN = ref.current.getBoundingClientRect();
      const dx = e.clientX - drag.current.ox;
      const dy = e.clientY - drag.current.oy;
      const maxX = rectC.width - rectN.width;
      const maxY = rectC.height - rectN.height;
      const x = clamp(drag.current.sx + dx, 0, Math.max(0, maxX));
      const y = clamp(drag.current.sy + dy, 0, Math.max(0, maxY));
      onChange({ ...note, x, y, updatedAt: nowISO() });
    };
    const onUp = () => {
      drag.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
  }, [note, onChange]);

  return (
    <div
      ref={ref}
      className="sticky-note"
      style={{
        left: note.x,
        top: note.y,
        background: COLOR_MAP[note.color],
        border: note.pinned ? "2px solid var(--accent)" : "1px solid var(--border)",
      }}
    >
      <div className="note-header note-drag">
        <Group gap="xs" align="center">
          <Select
            value={note.color}
            onChange={(val) =>
              val && onChange({ ...note, color: val as NoteColor, updatedAt: nowISO() })
            }
            data={["Yellow", "Pink", "Blue", "Green"]}
            aria-label="Note color"
            allowDeselect={false}
            comboboxProps={{ withinPortal: false }}
          />
          <Group gap={6}>
            <Switch
              size="xs"
              checked={note.pinned}
              onChange={(e) => onChange({ ...note, pinned: e.currentTarget.checked, updatedAt: nowISO() })}
              aria-label="Pin note"
            />
            <Text size="xs">Pin</Text>
          </Group>
        </Group>
        <Button
          size="compact-sm"
          variant="subtle"
          color="red"
          onClick={() => onDelete(note.id)}
          title="Delete note"
        >
          <IconTrash size={16} />
        </Button>
      </div>
      <textarea
        className="note-textarea"
        value={note.text}
        onChange={(e) => onChange({ ...note, text: e.target.value, updatedAt: nowISO() })}
        placeholder="Write something..."
      />
      <div className="note-footer">
        <Text size="xs" c="dimmed">
          Updated {new Date(note.updatedAt).toLocaleString()}
        </Text>
      </div>
    </div>
  );
}

/** ======= Lightweight Month Calendar ======= */
function MonthCalendar({
  monthDate,
  eventsByDay,
  onPrev,
  onNext,
  onToday,
}: {
  monthDate: Date;
  eventsByDay: Record<string, Reminder[]>;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Monday first

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  const fmtDay = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Group gap="xs">
          <Button size="compact-sm" variant="default" onClick={onPrev}>◀</Button>
          <Button size="compact-sm" variant="light" onClick={onToday} className="accent-outline">Today</Button>
          <Button size="compact-sm" variant="default" onClick={onNext}>▶</Button>
        </Group>
        <Title order={4}>
          {monthDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </Title>
        <div />
      </Group>

      <div className="cal-head">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="cal-head-cell">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((d) => {
          const inMonth = d.getMonth() === monthDate.getMonth();
          const key = fmtDay(d);
          const items = eventsByDay[key] || [];
          return (
            <div key={key} className={`cal-cell ${inMonth ? "" : "dim"}`}>
              <div className="cal-day">{d.getDate()}</div>
              <div className="cal-body">
                {items.slice(0, 3).map((r) => (
                  <div key={r.id} className="cal-pill" title={r.title}>{r.title}</div>
                ))}
                {items.length > 3 && <div className="cal-more">+{items.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Stack>
  );
}

/** ======= Page ======= */
export default function ProductivityPage() {
  // Theme (persisted)
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem(THEME_LS_KEY) as ThemeKey | null;
    return saved || "theme-calm";
  });
  useEffect(() => {
    localStorage.setItem(THEME_LS_KEY, theme);
  }, [theme]);

  // Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS.notes) || "[]"); } catch { return []; }
  });
  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS.reminders) || "[]"); } catch { return []; }
  });
  // Calendar month
  const [month, setMonth] = useState<Date>(() => {
    const s = localStorage.getItem(LS.month);
    return s ? new Date(s) : new Date();
  });

  useEffect(() => localStorage.setItem(LS.notes, JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem(LS.reminders, JSON.stringify(reminders)), [reminders]);
  useEffect(() => localStorage.setItem(LS.month, month.toISOString()), [month]);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [notes]
  );

  // Reminders: simple due checker
  useEffect(() => {
    const t = setInterval(() => {
      setReminders((list) =>
        list.map((r) => {
          if (!r.done && new Date(r.whenISO) <= new Date()) {
            alert(`Reminder: ${r.title}\nDue: ${new Date(r.whenISO).toLocaleString()}`);
            return { ...r, done: true };
          }
          return r;
        })
      );
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  const eventsByDay = useMemo(() => {
    const map: Record<string, Reminder[]> = {};
    for (const r of reminders) {
      const key = r.whenISO.slice(0, 10);
      (map[key] ||= []).push(r);
    }
    return map;
  }, [reminders]);

  // Reminder form
  const [rt, setRt] = useState("");
  const [rd, setRd] = useState(""); // YYYY-MM-DD
  const [rh, setRh] = useState(""); // HH:mm

  const addReminder = () => {
    if (!rt || !rd || !rh) return alert("Please fill Title, Date, and Time.");
    const whenISO = new Date(`${rd}T${rh}`).toISOString();
    setReminders((rs) => [
      ...rs,
      { id: uid(), title: rt.trim(), whenISO, done: false, createdAt: nowISO() },
    ]);
    setRt(""); setRd(""); setRh("");
  };

  const toggleRem = (id: string) =>
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  const delRem = (id: string) =>
    setReminders((rs) => rs.filter((r) => r.id !== id));

  // Notes ops
  const addNote = () =>
    setNotes((ns) => [
      ...ns,
      {
        id: uid(),
        text: "",
        color: "Yellow",
        pinned: false,
        x: 24 + ((ns.length % 4) * 260),
        y: 24 + (Math.floor(ns.length / 4) * 220),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
    ]);
  const updNote = (n: Note) => setNotes((ns) => ns.map((x) => (x.id === n.id ? n : x)));
  const delNote = (id: string) => setNotes((ns) => ns.filter((x) => x.id !== id));

  // Calendar nav
  const prev = () => setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const today = () => setMonth(new Date());

  return (
    <Box className={`services-page productivity-theme ${theme}`} p="md">
      {/* Header row */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Text fw={600} c="dimmed">Dashboard</Text>
          <Text c="dimmed">›</Text>
          <Title order={2}>Productivity</Title>
        </Group>
        <Group gap="xs" align="center">
          {/* Theme picker */}
          <Select
            aria-label="Theme"
            title="Theme"
            w={180}
            value={theme}
            onChange={(v) => v && setTheme(v as ThemeKey)}
            data={THEME_OPTIONS}
          />
          <Button variant="default" onClick={addNote} leftSection={<IconNote size={16} />}>
            New note
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() => {
              if (confirm("Clear ALL notes?")) setNotes([]);
            }}
          >
            Clear notes
          </Button>
        </Group>
      </Group>

      {/* Stats tiles */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="service-card">
            <Text size="sm" fw={600}>Notes</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{notes.length}</Text>
            </Group>
            <Progress value={Math.min(100, notes.length * 10)} mt="sm" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="service-card">
            <Text size="sm" fw={600}>Reminders</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{reminders.length}</Text>
            </Group>
            <Progress color="green" value={Math.min(100, reminders.length * 12)} mt="sm" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder radius="md" className="service-card">
            <Text size="sm" fw={600}>Pinned notes</Text>
            <Group justify="space-between" mt={8}>
              <Text size="xl" fw={700}>{notes.filter(n => n.pinned).length}</Text>
            </Group>
            <Progress color="violet" value={Math.min(100, notes.filter(n => n.pinned).length * 20)} mt="sm" />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid mt="md" gutter="md">
        {/* LEFT COLUMN: Reminder form + list + calendar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" className="service-card">
            <Group gap="xs" align="center" mb="xs">
              <IconClock size={18} />
              <Title order={4}>Create reminder</Title>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Title"
                placeholder="e.g., Standup meeting"
                value={rt}
                onChange={(e) => setRt(e.currentTarget.value)}
              />
              <TextInput
                label="Date"
                type="date"
                value={rd}
                onChange={(e) => setRd(e.currentTarget.value)}
              />
              <TextInput
                label="Time"
                type="time"
                value={rh}
                onChange={(e) => setRh(e.currentTarget.value)}
              />
              <Button leftSection={<IconCirclePlus size={16} />} onClick={addReminder} className="accent-btn">
                Add reminder
              </Button>
            </Stack>
          </Card>

          <Card withBorder radius="md" className="service-card" mt="md">
            <Group gap="xs" align="center" mb="xs">
              <IconCalendarEvent size={18} />
              <Title order={4}>Reminders</Title>
            </Group>
            {reminders.length === 0 ? (
              <Text c="dimmed">No reminders yet.</Text>
            ) : (
              <Table highlightOnHover verticalSpacing="xs" withRowBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>When</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reminders
                    .slice()
                    .sort((a, b) => +new Date(a.whenISO) - +new Date(b.whenISO))
                    .map((r) => (
                      <Table.Tr key={r.id}>
                        <Table.Td>{r.title}</Table.Td>
                        <Table.Td>{new Date(r.whenISO).toLocaleString()}</Table.Td>
                        <Table.Td>
                          <Badge color={r.done ? "teal" : "gray"} variant="light">
                            {r.done ? "Done" : "Pending"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" justify="flex-end">
                            <Button size="xs" variant="default" onClick={() => toggleRem(r.id)}>
                              Toggle
                            </Button>
                            <Button size="xs" variant="subtle" color="red" onClick={() => delRem(r.id)}>
                              Delete
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>

          <Card withBorder radius="md" className="service-card" mt="md">
            <MonthCalendar
              monthDate={month}
              eventsByDay={eventsByDay}
              onPrev={prev}
              onNext={next}
              onToday={today}
            />
          </Card>
        </Grid.Col>

        {/* RIGHT COLUMN: Sticky notes canvas */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" className="service-card">
            <Group justify="space-between" align="center" mb="xs">
              <Group gap="xs" align="center">
                <Avatar size={22} radius="xl">🗒️</Avatar>
                <Title order={3}>Sticky notes</Title>
              </Group>
              <Group gap="xs">
                <Button size="xs" variant="default" onClick={addNote}>
                  New note
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() =>
                    setNotes((ns) =>
                      ns.map((n, i) => ({
                        ...n,
                        x: 24 + ((i % 3) * 280),
                        y: 24 + (Math.floor(i / 3) * 230),
                        updatedAt: nowISO(),
                      }))
                    )
                  }
                  className="accent-outline"
                >
                  Snap to grid
                </Button>
              </Group>
            </Group>

            <Divider mb="sm" />

            <div className="notes-canvas">
              {sortedNotes.map((n) => (
                <StickyNote key={n.id} note={n} onChange={updNote} onDelete={delNote} />
              ))}
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
