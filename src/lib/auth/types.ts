/** ログインユーザーの型 */
export type UserRole = "user" | "maker" | "admin";

export interface AppUser {
  id: string;
  /** ログイン情報／連絡用。公開しません。 */
  email: string;
  /** 公開表示名（AppPark上に表示される名前。ニックネーム可・必須） */
  displayName: string;
  /** プロフィール画像URL（任意・公開可） */
  avatarUrl: string | null;
  /** 連絡先氏名（運営確認用・非公開・任意） */
  contactName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
