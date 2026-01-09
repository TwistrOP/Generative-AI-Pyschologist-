import React, { useEffect, useState } from "react";
import "./Blog.css";

import blog1Image from "../images/blog1.jpg";
import blog2Image from "../images/blog2.jpg";
import blog3Image from "../images/blog3.jpg";
import blog4Image from "../images/blog4.jpg";
import blog5Image from "../images/blog5.jpg";
import blog6Image from "../images/blog6.jpg";
import blog7Image from "../images/blog7.jpg";
import blog8Image from "../images/blog8.jpg";
import blog9Image from "../images/blog9.jpg";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  details: string;
  image: string;
  category?: string;
  authorName?: string;
  authorAvatar?: string;
  comments?: number;
}

type UserReaction = "like" | "dislike" | null;

interface StoredPostState {
  likes: number;
  dislikes: number;
  favorited: boolean;
  userReaction: UserReaction;
  comments: Array<{ id: string; author?: string; text: string; createdAt: string }>;
}

type PostStateMap = Record<string, StoredPostState>;
type StoredData = Record<string, Partial<StoredPostState>>;

const STORAGE_KEY = "athena_blog_interactions_v2";

const blogImages = [
  blog1Image,
  blog2Image,
  blog3Image,
  blog4Image,
  blog5Image,
  blog6Image,
  blog7Image,
  blog8Image,
  blog9Image,
];

const initialBlogPosts: Omit<BlogPost, "image">[] = [
  {
    id: "right-therapist",
    title: "How to Choose the Right Therapist",
    date: "September 05, 2025",
    excerpt: "Modalities, qualifications, and the first-session checklist to find a good fit.",
    details: "We cover licensing, evidence-based approaches, cost/insurance, cultural fit, and how to evaluate your comfort level after session one.",
    category: "Therapy",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=therapist",
    comments: 4,
  },
  {
    id: "cbt-basics",
    title: "CBT Basics: Rethinking Unhelpful Thoughts",
    date: "August 28, 2025",
    excerpt: "A practical intro to cognitive restructuring with simple worksheets.",
    details: "Learn the ABC model, common thinking traps, and how to replace them with balanced alternatives using a 5-step practice.",
    category: "CBT",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=cbt",
    comments: 2,
  },
  {
    id: "mindfulness-5min",
    title: "Mindfulness for Anxiety (5 Minutes a Day)",
    date: "August 21, 2025",
    excerpt: "Short practices you can slot between classes or meetings.",
    details: "Box breathing, 5-senses grounding, and micro-meditations. When to prefer movement-based mindfulness over seated practice.",
    category: "Mindfulness",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=mindful",
    comments: 6,
  },
  {
    id: "telehealth-first-session",
    title: "Telehealth Therapy: Preparing for Your First Session",
    date: "August 14, 2025",
    excerpt: "Tech, privacy, and environment tips for a smoother tele-session.",
    details: "Camera framing, headphones, lighting, a privacy checklist, and a pre-session reflection sheet you can reuse.",
    category: "Telehealth",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=tele",
    comments: 1,
  },
  {
    id: "sleep-student-guide",
    title: "Sleep & Mental Health: A Student’s Guide",
    date: "August 07, 2025",
    excerpt: "Why sleep architecture matters and 7 cues to improve it without apps.",
    details: "Circadian rhythm anchors, caffeine timing, light exposure, and progressive wind-down routines with templates.",
    category: "Wellbeing",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=sleep",
    comments: 5,
  },
  {
    id: "journaling-prompts",
    title: "Journaling Prompts for Mood Tracking",
    date: "July 31, 2025",
    excerpt: "Evidence-informed prompts that link feelings, thoughts, and actions.",
    details: "Daily 3-line template, weekly review, and how to visualize patterns for therapy or self-coaching.",
    category: "Journaling",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=journal",
    comments: 0,
  },
  {
    id: "burnout-vs-depression",
    title: "Burnout vs. Depression: Key Differences",
    date: "July 24, 2025",
    excerpt: "Overlap, distinctions, and when to seek professional help.",
    details: "We compare symptom clusters, duration, functional impact, and the role of rest vs. treatment plans.",
    category: "Psychoeducation",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=burnout",
    comments: 7,
  },
  {
    id: "crisis-plan",
    title: "Building a Personal Crisis Plan",
    date: "July 17, 2025",
    excerpt: "Contacts, warning signs, coping steps, and environment safety.",
    details: "Download a one-page template, identify triggers, list grounding skills, and arrange safe spaces ahead of time.",
    category: "Safety",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=safety",
    comments: 3,
  },
  {
    id: "support-friend-distress",
    title: "How to Support a Friend in Distress",
    date: "July 10, 2025",
    excerpt: "Active listening, validating, and boundaries that protect both of you.",
    details: "Use the OARS framework, safety questions you can ask, and a list of professional resources by region.",
    category: "Community",
    authorName: "Athena Team",
    authorAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=support",
    comments: 9,
  },
];

const blogPosts: BlogPost[] = initialBlogPosts.map((post, index) => ({
  ...post,
  image: blogImages[index],
}));

function getDateParts(dateStr: string): { day: string; mon: string } {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { day: "—", mon: "" };
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-US", { month: "short" });
  return { day, mon };
}

const defaultStateFor = (): PostStateMap =>
  Object.fromEntries(
    blogPosts.map((p) => [
      p.id,
      { likes: 0, dislikes: 0, favorited: false, userReaction: null, comments: [] },
    ])
  );

const mergeWithDefaults = (maybe: unknown): PostStateMap => {
  const base = defaultStateFor();
  if (!maybe || typeof maybe !== "object") return base;
  const incoming = maybe as StoredData;
  for (const id of Object.keys(base)) {
    const s = incoming[id];
    if (s && typeof s === "object") {
      base[id] = {
        likes: Number(s.likes) || 0,
        dislikes: Number(s.dislikes) || 0,
        favorited: !!s.favorited,
        userReaction: s.userReaction === "like" || s.userReaction === "dislike" ? s.userReaction : null,
        comments: Array.isArray(s.comments) ? s.comments : [],
      };
    }
  }
  return base;
};

const Blog: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [openCommentsIndex, setOpenCommentsIndex] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const [state, setState] = useState<PostStateMap>({});
  const [drafts, setDrafts] = useState<Record<string, { author: string; text: string }>>({});

  useEffect(() => {
    setFadeIn(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      setState(mergeWithDefaults(parsed));
    } catch {
      setState(defaultStateFor());
    }
  }, []);

  useEffect(() => {
    if (Object.keys(state).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const toggleExpand = (idx: number) =>
    setExpandedIndex((curr) => (curr === idx ? null : idx));

  const toggleComments = (idx: number) =>
    setOpenCommentsIndex((curr) => (curr === idx ? null : idx));

  const stateFor = (id: string): StoredPostState =>
    state[id] || { likes: 0, dislikes: 0, favorited: false, userReaction: null, comments: [] };

  const handleReact = (postId: string, reaction: Exclude<UserReaction, null>) => {
    setState((prev) => {
      const curr = prev[postId] ?? {
        likes: 0, dislikes: 0, favorited: false, userReaction: null, comments: [],
      };

      let { likes, dislikes } = curr;
      const { userReaction } = curr;

      if (userReaction === "like") likes = Math.max(0, likes - 1);
      if (userReaction === "dislike") dislikes = Math.max(0, dislikes - 1);

      if (userReaction === reaction) {
        return { ...prev, [postId]: { ...curr, likes, dislikes, userReaction: null } };
      }

      if (reaction === "like") likes += 1;
      if (reaction === "dislike") dislikes += 1;

      return { ...prev, [postId]: { ...curr, likes, dislikes, userReaction: reaction } };
    });
  };

  const handleFavorite = (postId: string) => {
    setState((prev) => {
      const curr = prev[postId] ?? {
        likes: 0, dislikes: 0, favorited: false, userReaction: null, comments: [],
      };
      return { ...prev, [postId]: { ...curr, favorited: !curr.favorited } };
    });
  };

  const handleAddComment = (postId: string) => {
    const draft = drafts[postId] || { author: "", text: "" };
    const text = draft.text?.trim();
    if (!text) return;

    setState((prev) => {
      const curr = prev[postId] ?? {
        likes: 0, dislikes: 0, favorited: false, userReaction: null, comments: [],
      };
      const newComment = {
        id: `${postId}-${Date.now()}`,
        author: draft.author?.trim() || "Anonymous",
        text,
        createdAt: new Date().toISOString(),
      };
      return { ...prev, [postId]: { ...curr, comments: [newComment, ...curr.comments] } };
    });

    setDrafts((d) => ({ ...d, [postId]: { author: "", text: "" } }));
  };

  const setDraft = (postId: string, field: "author" | "text", value: string) =>
    setDrafts((prev) => ({
      ...prev,
      [postId]: { ...(prev[postId] || { author: "", text: "" }), [field]: value },
    }));

  return (
    <div className={`blog-wrap ${fadeIn ? "fade-in" : ""}`}>
      <h1 className="blog-title">Blog</h1>
      <p className="blog-subtitle">
        Research-backed tips, therapy explainers, and AthenaOS updates.
      </p>

      <div className="grid three-col cards-grid">
        {blogPosts.map((post, index) => {
          const { day, mon } = getDateParts(post.date);
          const category = post.category ?? "General";
          const authorName = post.authorName ?? "Athena Team";
          const authorAvatar =
            post.authorAvatar ??
            "https://api.dicebear.com/7.x/miniavs/svg?seed=default";

          const s = stateFor(post.id);
          const totalComments = (post.comments ?? 0) + (s.comments?.length ?? 0);

          return (
            <article className="post-card" key={post.id}>
              <div className="media">
                <img
                  className="cover"
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                />
                <div className="date-badge" aria-label={`Published on ${post.date}`}>
                  <span className="day">{day}</span>
                  <span className="mon">{mon}</span>
                </div>
                <div className="flag" aria-hidden="true">▣</div>

                <button
                  className={`fav-toggle ${s.favorited ? "active" : ""}`}
                  onClick={() => handleFavorite(post.id)}
                  aria-pressed={s.favorited}
                  title={s.favorited ? "Remove from favorites" : "Add to favorites"}
                >
                  ★
                </button>
              </div>

              <div className="content">
                <div className="category">{category}</div>
                <h2 className="title">{post.title}</h2>
                <p className="excerpt">{post.excerpt}</p>

                <div className="meta">
                  <div className="author">
                    <img src={authorAvatar} alt="" />
                    <span>by {authorName}</span>
                  </div>
                  <div className="comments">
                    <span className="dot" /> {totalComments} Comments
                  </div>
                </div>

                <div className="reactions" role="group" aria-label="Reactions">
                  <button
                    className={`reaction-btn ${s.userReaction === "like" ? "active" : ""}`}
                    onClick={() => handleReact(post.id, "like")}
                    aria-pressed={s.userReaction === "like"}
                  >
                    👍 <span className="count">{s.likes}</span>
                  </button>
                  <button
                    className={`reaction-btn ${s.userReaction === "dislike" ? "active" : ""}`}
                    onClick={() => handleReact(post.id, "dislike")}
                    aria-pressed={s.userReaction === "dislike"}
                  >
                    👎 <span className="count">{s.dislikes}</span>
                  </button>
                  <button
                    className={`favorite-btn ${s.favorited ? "active" : ""}`}
                    onClick={() => handleFavorite(post.id)}
                    aria-pressed={s.favorited}
                  >
                    {s.favorited ? "★ Favorited" : "☆ Favorite"}
                  </button>
                </div>

                <div className="actions">
                  <button
                    className="read-more"
                    onClick={() => toggleExpand(index)}
                    aria-expanded={expandedIndex === index}
                    aria-controls={`details-${index}`}
                  >
                    Read more →
                  </button>

                  <button
                    className="toggle-details"
                    onClick={() => toggleExpand(index)}
                    aria-expanded={expandedIndex === index}
                    aria-controls={`details-${index}`}
                  >
                    {expandedIndex === index ? "Hide Info ▲" : "Show Info ▼"}
                  </button>

                  <button
                    className="toggle-comments"
                    onClick={() => toggleComments(index)}
                    aria-expanded={openCommentsIndex === index}
                    aria-controls={`comments-${index}`}
                    title="Show comments"
                  >
                    {openCommentsIndex === index ? "Hide Comments ▲" : "Comments ▼"}
                  </button>
                </div>

                <div
                  id={`details-${index}`}
                  className={`dropdown ${expandedIndex === index ? "open" : ""}`}
                >
                  <div className="details">
                    <p>{post.details}</p>
                  </div>
                </div>

                <div
                  id={`comments-${index}`}
                  className={`comments-dropdown ${openCommentsIndex === index ? "open" : ""}`}
                >
                  <div className="comments-inner">
                    <h3 className="comments-title">Comments</h3>

                    <div className="comment-form">
                      <input
                        className="input name"
                        type="text"
                        placeholder="Your name (optional)"
                        value={drafts[post.id]?.author ?? ""}
                        onChange={(e) => setDraft(post.id, "author", e.target.value)}
                      />
                      <textarea
                        className="input text"
                        placeholder="Write a thoughtful, kind comment…"
                        value={drafts[post.id]?.text ?? ""}
                        onChange={(e) => setDraft(post.id, "text", e.target.value)}
                        rows={3}
                      />
                      <button
                        className="submit-comment"
                        onClick={() => handleAddComment(post.id)}
                      >
                        Post Comment
                      </button>
                    </div>

                    <div className="comment-list-wrap">
                      {s.comments.length > 0 ? (
                        <ul className="comment-list">
                          {s.comments.map((c) => {
                            const dt = new Date(c.createdAt);
                            const nice = isNaN(dt.getTime()) ? "" : dt.toLocaleString();
                            return (
                              <li key={c.id} className="comment-item">
                                <div className="comment-avatar" aria-hidden="true">
                                  {(c.author || "A").slice(0, 1).toUpperCase()}
                                </div>
                                <div className="comment-body">
                                  <div className="comment-meta">
                                    <span className="comment-author">
                                      {c.author || "Anonymous"}
                                    </span>
                                    {nice && <span className="comment-time">• {nice}</span>}
                                  </div>
                                  <p className="comment-text">{c.text}</p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="no-comments">Be the first to comment.</p>
                      )}

                      {post.comments && post.comments > 0 && s.comments.length === 0 && (
                        <p className="legacy-note">
                          ({post.comments} earlier comment
                          {post.comments > 1 ? "s" : ""} not shown here.)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;