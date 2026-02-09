import { pgTable, uuid, text, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { ResumeData } from '../types/resume';

export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  resumeData: jsonb('resume_data').$type<ResumeData>().notNull(),
  originalPdf: text('original_pdf').notNull(), // base64 encoded PDF
  format: text('format').notNull(), // 'skill-at-top' etc.
  hiddenSections: text('hidden_sections').array(),
  isFavorite: boolean('is_favorite').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
