import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Cada projeto publicado no portfólio nasce aqui e pode ser gerenciado pelo painel.
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull(),
  description: text("description").notNull(),
  stack: text("stack").notNull().default("[]"),
  status: text("status").notNull().default("Planejado"),
  accent: text("accent").notNull().default("#ffd24a"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  videoUrl: text("video_url"),
  imageKey: text("image_key"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Um único registro mantém os dados pessoais que aparecem na página pública.
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull().default("Igor Mota"),
  headline: text("headline").notNull().default("Desenvolvedor Python & Analista de Dados"),
  location: text("location").notNull().default("Belo Horizonte, MG"),
  email: text("email"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  photoKey: text("photo_key"),
  resumeKey: text("resume_key"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
