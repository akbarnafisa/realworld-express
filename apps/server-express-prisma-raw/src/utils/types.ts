export type UserModel = {
  id: number;
  bio: string | null;
  email: string;
  image: string | null;
  password: string;
  username: string;
};

export type ArticleModel = {
  id: number,
  slug: string,
  title: string,
  description: string,
  body: string,
  created_at: Date,
  updated_at: Date,
  author_id: number
}

export type CommentModel = {
  id: number,
  created_at: Date,
  updated_at: Date,
  body: string,
  author_id: number
  article_id: number
}

export type TagModel = {
  id: number;
  name: string;
};
