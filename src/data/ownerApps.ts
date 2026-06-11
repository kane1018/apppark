import type { Service } from "@/types";
import { tool } from "@/data/toolFactory";

/**
 * サイトオーナー（kane）が開発・公開している外部アプリの掲載。
 * いずれも実在・稼働中のWebサービスで、URLは本人提供のもの。
 * 投稿者情報（authorId / publicAuthorName = kane）は toolFactory のデフォルトで付与されます。
 * 説明文は各サイトの実際の title / description / 本文に基づいています。
 */

export const ownerApps: Service[] = [
  tool({
    id: "app-sozoku-navi",
    slug: "sozoku-tetsuzuki-navi",
    name: "相続手続きナビ",
    shortDescription:
      "質問に答えるだけで、相続手続きの全体像・必要書類・相談先を整理できる案内サイト。",
    description:
      "「相続手続き、何から始めるべきか分からない」という方向けの一般向け案内サイトです。いくつかの質問に答えるだけで、現在の状況に応じて次に必要になりそうな相続手続きの目安を確認できます。手続きの全体像、必要書類の一覧、専門家への相談先の整理に対応しています。",
    category: "legal",
    subCategories: ["相続", "行政手続き"],
    purposes: ["gov-procedure", "legal-contract", "diagnose"],
    audienceTags: ["individual"],
    toolTypeTags: ["external", "diagnosis"],
    pricingTags: ["free", "no-signup"],
    tags: ["相続", "手続き", "必要書類", "無料"],
    url: "https://sozoku-tetsuzuki-navi.vercel.app",
    listingType: "external",
    createdAt: "2026-06-11",
    updatedAt: "2026-06-11",
    recommendedFor: [
      "相続手続きを何から始めればよいか分からない人",
      "必要書類を一覧で確認したい人",
      "専門家に相談する前に状況を整理したい人",
    ],
    howToUse: [
      "「まずは相続の状況を整理する」から質問に答える",
      "状況に応じた手続きの目安を確認する",
      "必要書類や相談先を確認する",
    ],
    useCases: ["相続発生後の最初の整理", "専門家相談前の準備"],
    cautions: [
      "一般的な案内を目的としたサイトです。個別の法律・税務・登記の判断は専門家にご相談ください",
    ],
    authorComment:
      "相続の「何から始めれば？」という不安を、ひとつずつ整理できる入口として作りました。",
    techStack: [],
    reasonCreated:
      "相続手続きの全体像が分からず不安な人が、最初の一歩を踏み出せるようにしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),

  tool({
    id: "app-international-diagnosis",
    slug: "zairyu-kantan-kakunin",
    name: "在留資格手続き かんたん確認",
    shortDescription:
      "質問に答えるだけで、必要になりそうな在留手続きの目安を約3分で確認できます。",
    description:
      "外国人雇用・在留手続きに関する不安を整理するための確認サイトです。いくつかの質問に答えるだけで、現在の状況に応じて必要になりそうな在留手続きの目安を約3分で確認できます。メールアドレスの入力は不要で、匿名のままその場で確認結果が表示されます。営業連絡はありません。",
    category: "legal",
    subCategories: ["在留資格", "行政手続き"],
    purposes: ["gov-procedure", "language-support", "diagnose"],
    audienceTags: ["foreigner-support", "small-business", "sole-proprietor"],
    toolTypeTags: ["external", "diagnosis"],
    pricingTags: ["free", "no-signup"],
    tags: ["在留資格", "外国人雇用", "手続き", "無料"],
    url: "https://international-diagnosis.vercel.app",
    listingType: "external",
    createdAt: "2026-06-11",
    updatedAt: "2026-06-11",
    recommendedFor: [
      "外国人を雇用している・雇用を検討している事業者",
      "自分の在留手続きに何が必要か知りたい人",
      "専門家に相談する前に状況を整理したい人",
    ],
    howToUse: [
      "「必要な在留手続きを確認する」から質問に答える",
      "状況に応じた手続きの目安を確認する",
      "必要に応じて専門家への相談を検討する",
    ],
    useCases: ["外国人雇用時の手続き確認", "在留手続きの事前整理"],
    cautions: [
      "確認結果は目安です。個別の在留資格手続きは、専門家または出入国在留管理庁の情報をご確認ください",
    ],
    authorComment:
      "在留手続きの「何が必要？」を、匿名・無料・約3分で整理できるようにしました。",
    techStack: [],
    reasonCreated:
      "在留資格まわりの手続きが分かりにくく、最初の確認だけでも気軽にできる場所が欲しかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),

  tool({
    id: "app-friends-holdem",
    slug: "friends-holdem",
    name: "Friends Hold'em",
    shortDescription: "友達同士で遊ぶ、無料・非賭博のテキサスホールデム。",
    description:
      "友達同士で気軽に遊べる、無料・非賭博のテキサスホールデム（ポーカー）です。ブラウザでそのまま遊べます。金銭を賭ける要素はなく、仲間内でのゲームとして楽しめます。",
    category: "entertainment",
    subCategories: ["ブラウザゲーム", "友達と遊べる", "パーティー向け"],
    purposes: ["with-friends", "kill-time"],
    audienceTags: ["individual", "student"],
    toolTypeTags: ["external", "browser-game"],
    pricingTags: ["free"],
    tags: ["ポーカー", "テキサスホールデム", "ゲーム", "無料"],
    url: "https://friends-holdem-naoi.vercel.app",
    listingType: "external",
    createdAt: "2026-06-11",
    updatedAt: "2026-06-11",
    recommendedFor: [
      "友達とオンラインで気軽に遊びたい人",
      "賭けなしでポーカーを楽しみたい人",
    ],
    howToUse: [
      "サイトを開く",
      "友達とテーブルに集まる",
      "テキサスホールデムで遊ぶ",
    ],
    useCases: ["友達との暇つぶし", "オンライン飲み会のお供"],
    cautions: ["無料・非賭博のゲームです。金銭を賭ける行為はできません"],
    authorComment: "賭けずに、友達とただ純粋にポーカーを楽しむために作りました。",
    techStack: [],
    reasonCreated: "友達同士で安心して遊べる、非賭博のホールデムが欲しかったため。",
    recruitmentStatus: ["seeking_users", "seeking_feedback"],
  }),

  tool({
    id: "app-chanto-iwau-ai",
    slug: "chanto-iwau-ai",
    name: "ちゃんと祝うAI",
    shortDescription:
      "相手の好み・予算・場所などを入力すると、記念日プランをAIが自動作成します。",
    description:
      "大切な人の記念日に「何をすればいいか迷う」人のためのAIプラン作成サービスです。相手の好み・予算・場所・サプライズ度を入力するだけで、記念日の過ごし方のプランをAIが自動作成します。",
    category: "ai-tools",
    subCategories: ["AI文章生成"],
    purposes: ["try-ai", "daily-life"],
    audienceTags: ["individual"],
    toolTypeTags: ["external"],
    pricingTags: ["free"],
    tags: ["記念日", "AI", "プラン作成", "デート"],
    url: "https://chanto-iwau-ai.vercel.app",
    listingType: "external",
    createdAt: "2026-06-11",
    updatedAt: "2026-06-11",
    recommendedFor: [
      "記念日に何をすればいいか迷う人",
      "サプライズの段取りを考えたい人",
    ],
    howToUse: [
      "相手の好み・予算・場所・サプライズ度を入力する",
      "AIが記念日プランを作成する",
      "プランを参考に当日の段取りを決める",
    ],
    useCases: ["誕生日・記念日のプラン作り", "デートプランの参考"],
    cautions: ["提案内容は目安です。お店の予約や購入は各サービスでご確認ください"],
    authorComment:
      "「ちゃんと祝いたいけど、何をすれば？」を解決する相棒として作りました。",
    techStack: [],
    reasonCreated: "記念日のプラン作りで毎回悩む時間をなくしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
];
