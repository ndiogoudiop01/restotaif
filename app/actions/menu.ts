'use server'

import { db } from '@/lib/db';
import { menuCategories, menuItems, menuVariants, menuCustomizations } from '@/lib/db/schema';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { ApiResponse, MenuItem, MenuCategory } from '@/lib/types';

export async function getCategories(): Promise<ApiResponse<MenuCategory[]>> {
  try {
    const categories = await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.isActive, true))
      .orderBy(asc(menuCategories.displayOrder));

    return { success: true, data: categories };
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return { success: false, error: "Erreur lors de la récupération des catégories" };
  }
}

export async function getMenuItems(categoryId?: string): Promise<ApiResponse<MenuItem[]>> {
  try {
    const items = await db.query.menuItems.findMany({
      where: categoryId && categoryId !== 'all' 
        ? and(
            eq(menuItems.isActive, true),
            eq(menuItems.categoryId, categoryId)
          )
        : eq(menuItems.isActive, true),
      with: {
        category: {
          columns: {
            id: true,
            name: true,
            icon: true
          }
        },
        variants: {
          where: eq(menuVariants.isActive, true),
          columns: {
            id: true,
            name: true,
            price: true,
            isDefault: true
          }
        },
        customizations: {
          where: eq(menuCustomizations.isActive, true),
          columns: {
            id: true,
            name: true,
            price: true,
            isFree: true,
            category: true
          }
        }
      }
    });

    // Convertir les prix Decimal en number
    const formattedItems = items.map(item => ({
      ...item,
      basePrice: Number(item.basePrice),
      rating: Number(item.rating),
      variants: item.variants.map(v => ({
        ...v,
        price: Number(v.price)
      })),
      customizations: item.customizations.map(c => ({
        ...c,
        price: Number(c.price)
      }))
    }));

    return { success: true, data: formattedItems };
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return { success: false, error: "Erreur lors de la récupération du menu" };
  }
}

export async function searchMenuItems(
  searchTerm: string, 
  categoryId?: string
): Promise<ApiResponse<MenuItem[]>> {
  try {
    let whereConditions = [eq(menuItems.isActive, true)];

    if (searchTerm) {
      whereConditions.push(ilike(menuItems.name, `%${searchTerm}%`));
    }

    if (categoryId && categoryId !== 'all') {
      whereConditions.push(eq(menuItems.categoryId, categoryId));
    }

    const items = await db.query.menuItems.findMany({
      where: and(...whereConditions),
      with: {
        category: {
          columns: {
            id: true,
            name: true,
            icon: true
          }
        },
        variants: {
          where: eq(menuVariants.isActive, true)
        },
        customizations: {
          where: eq(menuCustomizations.isActive, true)
        }
      }
    });

    const formattedItems = items.map(item => ({
      ...item,
      basePrice: Number(item.basePrice),
      rating: Number(item.rating),
      variants: item.variants.map(v => ({
        ...v,
        price: Number(v.price)
      })),
      customizations: item.customizations.map(c => ({
        ...c,
        price: Number(c.price)
      }))
    }));

    return { success: true, data: formattedItems };
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return { success: false, error: "Erreur lors de la recherche" };
  }
}
