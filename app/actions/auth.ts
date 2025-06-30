'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ApiResponse, User } from '@/lib/types';

export async function loginUser(phone: string, name?: string): Promise<ApiResponse<User>> {
  try {
    // Rechercher l'utilisateur existant
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existingUser) {
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        phone: existingUser.phone,
        email: existingUser.email || undefined,
        points: existingUser.points,
        tier: existingUser.tier
      };
      return { success: true, data: userData, message: 'Connexion réussie' };
    }

    // Si pas de nom fourni pour un nouvel utilisateur
    if (!name) {
      return { success: false, error: 'Nom requis pour un nouvel utilisateur' };
    }

    // Créer un nouvel utilisateur
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        phone,
        points: 50, // Bonus d'inscription
        tier: 'bronze'
      })
      .returning();

    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email || undefined,
      points: newUser.points,
      tier: newUser.tier
    };

    return { success: true, data: userData, message: 'Compte créé avec succès' };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return { success: false, error: "Erreur lors de la connexion" };
  }
}

export async function registerUser(name: string, phone: string): Promise<ApiResponse<User>> {
  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existingUser) {
      return { success: false, error: 'Ce numéro est déjà utilisé' };
    }

    // Créer un nouvel utilisateur
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        phone,
        points: 50, // Bonus d'inscription
        tier: 'bronze'
      })
      .returning();

    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email || undefined,
      points: newUser.points,
      tier: newUser.tier
    };

    return { success: true, data: userData, message: 'Inscription réussie' };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return { success: false, error: "Erreur lors de l'inscription" };
  }
}