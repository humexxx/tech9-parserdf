import { db } from '../../db';
import { resumes } from '../../db/schema';
import { CreateResumeInput, UpdateResumeInput, Resume } from '../../types/database';
import { eq, and, lt, gte, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

/**
 * Resume Service - Handles all database operations for resumes
 */
export class ResumeService {
  /**
   * Save a new resume or update existing one
   */
  async saveResume(input: CreateResumeInput, id?: string): Promise<Resume> {
    const now = new Date();

    if (id) {
      // Update existing resume
      const [updated] = await db
        .update(resumes)
        .set({
          name: input.name,
          resumeData: input.resumeData,
          originalPdf: input.originalPdf,
          format: input.format,
          hiddenSections: input.hiddenSections || [],
          isFavorite: input.isFavorite ?? false,
          updatedAt: now,
        })
        .where(eq(resumes.id, id))
        .returning();

      return updated;
    } else {
      // Create new resume
      const [created] = await db
        .insert(resumes)
        .values({
          name: input.name,
          resumeData: input.resumeData,
          originalPdf: input.originalPdf,
          format: input.format,
          hiddenSections: input.hiddenSections || [],
          isFavorite: input.isFavorite ?? false,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return created;
    }
  }

  /**
   * Get a single resume by ID
   */
  async getResumeById(id: string): Promise<Resume | null> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    return resume || null;
  }

  /**
   * Get recent resumes (last 30 days, non-favorited)
   */
  async getRecentResumes(): Promise<Resume[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentResumes = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.isFavorite, false),
          gte(resumes.createdAt, thirtyDaysAgo)
        )
      )
      .orderBy(desc(resumes.updatedAt));

    return recentResumes;
  }

  /**
   * Get all favorited resumes
   */
  async getFavoriteResumes(): Promise<Resume[]> {
    const favoriteResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.isFavorite, true))
      .orderBy(desc(resumes.updatedAt));

    return favoriteResumes;
  }

  /**
   * Toggle favorite status of a resume
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<Resume> {
    const [updated] = await db
      .update(resumes)
      .set({
        isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();

    return updated;
  }

  /**
   * Update resume data
   */
  async updateResume(id: string, input: UpdateResumeInput): Promise<Resume> {
    const [updated] = await db
      .update(resumes)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete a resume
   */
  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  /**
   * Cleanup old resumes (90+ days, non-favorited)
   */
  async cleanupOldResumes(): Promise<number> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await db
      .delete(resumes)
      .where(
        and(
          eq(resumes.isFavorite, false),
          lt(resumes.createdAt, ninetyDaysAgo)
        )
      )
      .returning({ id: resumes.id });

    return result.length;
  }

  /**
   * Get all resumes (favorites + recent)
   */
  async getAllResumes(): Promise<{ favorites: Resume[]; recent: Resume[] }> {
    const [favorites, recent] = await Promise.all([
      this.getFavoriteResumes(),
      this.getRecentResumes(),
    ]);

    return { favorites, recent };
  }
}

// Export singleton instance
export const resumeService = new ResumeService();
