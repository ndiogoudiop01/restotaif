'use server'

import { db } from '@/lib/db';
import { loyaltyRewards, pointsTransactions, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ApiResponse, LoyaltyReward } from '@/lib/types';

export async function getLoyaltyRewards(): Promise<ApiResponse<LoyaltyReward[]>> {
  try {
    const rewards = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true));

    return { success: true, data: rewards };
  } catch (error) {
    console.error('Erreur lors de la récupération des récompenses:', error);
    return { success: false, error: "Erreur lors de la récupération des récompenses" };
  }
}

export async function redeemReward(
  userId: string, 
  rewardId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Récupérer l'utilisateur et la récompense
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const [reward] = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.id, rewardId))
      .limit(1);

    if (!user || !reward) {
      return { success: false, error: 'Utilisateur ou récompense introuvable' };
    }

    if (user.points < reward.pointsCost) {
      return { success: false, error: 'Points insuffisants' };
    }

    // Débiter les points
    await db
      .update(users)
      .set({
        points: sql`points - ${reward.pointsCost}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Enregistrer la transaction
    await db.insert(pointsTransactions).values({
      userId,
      type: 'redeemed',
      points: -reward.pointsCost,
      source: 'reward',
      description: `Échange de récompense: ${reward.name}`,
      rewardId
    });

    return { 
      success: true, 
      data: { message: `Récompense "${reward.name}" échangée avec succès !` },
      message: 'Échange réussi' 
    };
  } catch (error) {
    console.error('Erreur lors de l\'échange de récompense:', error);
    return { success: false, error: "Erreur lors de l'échange de récompense" };
  }
}

export async function getPointsHistory(userId: string): Promise<ApiResponse<any[]>> {
  try {
    const history = await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(sql`created_at DESC`)
      .limit(50);

    return { success: true, data: history };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return { success: false, error: "Erreur lors de la récupération de l'historique" };
  }
}