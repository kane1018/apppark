"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Idea,
  IdeaComment,
  IdeaStatus,
  MiniToolPotential,
  WantLevel,
} from "@/types";
import { seedIdeas } from "@/data/ideas";
import { moderateIdea } from "@/lib/ideaModeration";
import { moderateComment } from "@/lib/moderation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * アイデア掲示板のクライアント状態（MVP：localStorage 永続化）。
 *
 * シード（seedIdeas）に、ログインユーザーが投稿したアイデア・コメント・共感・
 * 「作ってみたい」をローカルに重ねて表示します。
 * 後で Supabase 等に接続する場合は、各 add/toggle をDB保存に置き換えるだけです。
 */

const K_IDEAS = "apppark.ideas.user";
const K_COMMENTS = "apppark.ideas.comments";
const K_LIKES = "apppark.ideas.likes"; // Record<userId, ideaId[]>
const K_LIKE_DELTA = "apppark.ideas.likeDelta"; // Record<ideaId, number>
const K_INTEREST = "apppark.ideas.interest"; // Record<userId, ideaId[]>

export interface NewIdeaInput {
  title: string;
  problem: string;
  desiredTool: string;
  category: string;
  purposeTags: string[];
  audienceTags: string[];
  useCase: string | null;
  similarServiceUrl: string | null;
  referenceImageUrl: string | null;
  miniToolPotential: MiniToolPotential;
  wantLevel: WantLevel;
  isAnonymous: boolean;
}

interface IdeaContextValue {
  /** 表示用アイデア（公開＋自分の保留分） */
  ideas: Idea[];
  getIdea: (id: string) => Idea | undefined;
  addIdea: (input: NewIdeaInput) => Promise<{ id: string; status: Idea["moderationStatus"] }>;
  likeCountOf: (idea: Idea) => number;
  hasLiked: (ideaId: string) => boolean;
  toggleLike: (ideaId: string) => void;
  hasInterest: (ideaId: string) => boolean;
  markInterest: (ideaId: string) => void;
  commentsOf: (ideaId: string) => IdeaComment[];
  commentCountOf: (idea: Idea) => number;
  addComment: (ideaId: string, body: string) => Promise<IdeaComment["moderationStatus"]>;
  reportIdea: (ideaId: string) => void;
  reportComment: (commentId: string) => void;
  /** 自分が投稿したアイデア */
  myIdeas: Idea[];
  /** 自分が共感したアイデア */
  myLikedIdeas: Idea[];
  /** 自分がコメントしたアイデア */
  myCommentedIdeas: Idea[];
}

const IdeaContext = createContext<IdeaContextValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}
function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function IdeaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [likes, setLikes] = useState<Record<string, string[]>>({});
  const [likeDelta, setLikeDelta] = useState<Record<string, number>>({});
  const [interest, setInterest] = useState<Record<string, string[]>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUserIdeas(load<Idea[]>(K_IDEAS, []));
    setComments(load<IdeaComment[]>(K_COMMENTS, []));
    setLikes(load<Record<string, string[]>>(K_LIKES, {}));
    setLikeDelta(load<Record<string, number>>(K_LIKE_DELTA, {}));
    setInterest(load<Record<string, string[]>>(K_INTEREST, {}));
    setHydrated(true);
  }, []);

  const uidKey = user?.id ?? "";
  const myLikes = likes[uidKey] ?? [];
  const myInterest = interest[uidKey] ?? [];

  // 表示用：シード（公開）＋ユーザー投稿（公開 or 自分の保留）
  const ideas = useMemo(() => {
    const base = seedIdeas.filter((i) => i.moderationStatus !== "hidden" && i.moderationStatus !== "deleted");
    const own = userIdeas.filter(
      (i) =>
        i.moderationStatus === "published" ||
        (user && i.authorId === user.id)
    );
    return [...own, ...base];
  }, [userIdeas, user]);

  const getIdea = useCallback(
    (id: string) => ideas.find((i) => i.id === id) ?? userIdeas.find((i) => i.id === id),
    [ideas, userIdeas]
  );

  const addIdea = useCallback<IdeaContextValue["addIdea"]>(
    async (input) => {
      const result = await moderateIdea({
        title: input.title,
        problem: input.problem,
        desiredTool: input.desiredTool,
        similarServiceUrl: input.similarServiceUrl,
        recentBodies: userIdeas
          .filter((i) => user && i.authorId === user.id)
          .map((i) => i.desiredTool),
      });
      const now = new Date().toISOString();
      const newIdea: Idea = {
        id: uid("idea"),
        title: input.title.trim(),
        problem: input.problem.trim(),
        desiredTool: input.desiredTool.trim(),
        category: input.category,
        purposeTags: input.purposeTags,
        audienceTags: input.audienceTags,
        useCase: input.useCase?.trim() || null,
        similarServiceUrl: input.similarServiceUrl?.trim() || null,
        referenceImageUrl: input.referenceImageUrl?.trim() || null,
        miniToolPotential: input.miniToolPotential,
        wantLevel: input.wantLevel,
        status: "open",
        relatedServiceId: null,
        authorId: user?.id ?? "anonymous",
        publicAuthorName: user?.displayName ?? "ユーザー",
        isAnonymous: input.isAnonymous,
        createdAt: now,
        updatedAt: now,
        likeCount: 0,
        commentCount: 0,
        moderationStatus: result.moderationStatus,
        riskLevel: result.riskLevel,
      };
      setUserIdeas((prev) => {
        const next = [newIdea, ...prev];
        save(K_IDEAS, next);
        return next;
      });
      return { id: newIdea.id, status: result.moderationStatus };
    },
    [user, userIdeas]
  );

  const hasLiked = useCallback((ideaId: string) => myLikes.includes(ideaId), [myLikes]);

  const likeCountOf = useCallback(
    (idea: Idea) => idea.likeCount + (likeDelta[idea.id] ?? 0),
    [likeDelta]
  );

  const toggleLike = useCallback(
    (ideaId: string) => {
      if (!user) return;
      const liked = (likes[user.id] ?? []).includes(ideaId);
      setLikes((prev) => {
        const cur = prev[user.id] ?? [];
        const nextList = liked ? cur.filter((x) => x !== ideaId) : [...cur, ideaId];
        const next = { ...prev, [user.id]: nextList };
        save(K_LIKES, next);
        return next;
      });
      setLikeDelta((prev) => {
        const next = { ...prev, [ideaId]: (prev[ideaId] ?? 0) + (liked ? -1 : 1) };
        save(K_LIKE_DELTA, next);
        return next;
      });
    },
    [user, likes]
  );

  const hasInterest = useCallback((ideaId: string) => myInterest.includes(ideaId), [myInterest]);
  const markInterest = useCallback(
    (ideaId: string) => {
      if (!user) return;
      if ((interest[user.id] ?? []).includes(ideaId)) return;
      setInterest((prev) => {
        const cur = prev[user.id] ?? [];
        const next = { ...prev, [user.id]: [...cur, ideaId] };
        save(K_INTEREST, next);
        return next;
      });
    },
    [user, interest]
  );

  const commentsOf = useCallback(
    (ideaId: string) =>
      comments
        .filter(
          (c) =>
            c.ideaId === ideaId &&
            c.moderationStatus !== "deleted" &&
            c.moderationStatus !== "hidden"
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [comments]
  );

  const commentCountOf = useCallback(
    (idea: Idea) =>
      idea.commentCount +
      comments.filter((c) => c.ideaId === idea.id && c.moderationStatus !== "deleted").length,
    [comments]
  );

  const addComment = useCallback<IdeaContextValue["addComment"]>(
    async (ideaId, body) => {
      const r = await moderateComment({ body, commentType: "other", authorName: user?.displayName });
      const c: IdeaComment = {
        id: uid("icmt"),
        ideaId,
        userId: user?.id ?? null,
        authorName: user?.displayName ?? "ユーザー",
        body: body.trim(),
        riskLevel: r.riskLevel,
        moderationStatus: r.moderationStatus,
        reportedCount: 0,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => {
        const next = [...prev, c];
        save(K_COMMENTS, next);
        return next;
      });
      return r.moderationStatus;
    },
    [user]
  );

  const reportIdea = useCallback((ideaId: string) => {
    setUserIdeas((prev) => {
      const next = prev.map((i) =>
        i.id === ideaId && i.moderationStatus === "published"
          ? { ...i, moderationStatus: "pending" as const }
          : i
      );
      save(K_IDEAS, next);
      return next;
    });
  }, []);

  const reportComment = useCallback((commentId: string) => {
    setComments((prev) => {
      const next = prev.map((c) =>
        c.id === commentId
          ? { ...c, reportedCount: c.reportedCount + 1, moderationStatus: c.reportedCount + 1 >= 3 && c.moderationStatus === "published" ? ("pending" as const) : c.moderationStatus }
          : c
      );
      save(K_COMMENTS, next);
      return next;
    });
  }, []);

  const myIdeas = useMemo(
    () => (user ? userIdeas.filter((i) => i.authorId === user.id) : []),
    [user, userIdeas]
  );
  const myLikedIdeas = useMemo(
    () => (user ? ideas.filter((i) => myLikes.includes(i.id)) : []),
    [user, ideas, myLikes]
  );
  const myCommentedIdeas = useMemo(() => {
    if (!user) return [];
    const ids = new Set(comments.filter((c) => c.userId === user.id).map((c) => c.ideaId));
    return ideas.filter((i) => ids.has(i.id));
  }, [user, ideas, comments]);

  const value = useMemo<IdeaContextValue>(
    () => ({
      ideas,
      getIdea,
      addIdea,
      likeCountOf,
      hasLiked,
      toggleLike,
      hasInterest,
      markInterest,
      commentsOf,
      commentCountOf,
      addComment,
      reportIdea,
      reportComment,
      myIdeas,
      myLikedIdeas,
      myCommentedIdeas,
    }),
    [ideas, getIdea, addIdea, likeCountOf, hasLiked, toggleLike, hasInterest, markInterest, commentsOf, commentCountOf, addComment, reportIdea, reportComment, myIdeas, myLikedIdeas, myCommentedIdeas]
  );

  // hydration前はシードのみ（SSRと一致させてミスマッチを避ける）
  void hydrated;

  return <IdeaContext.Provider value={value}>{children}</IdeaContext.Provider>;
}

export function useIdeas(): IdeaContextValue {
  const ctx = useContext(IdeaContext);
  if (!ctx) throw new Error("useIdeas must be used within <IdeaProvider>");
  return ctx;
}
