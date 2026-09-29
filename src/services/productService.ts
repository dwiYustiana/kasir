import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types/pos';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products dynamically from Firestore.
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const items: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Product);
    });
    return items;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
}

/**
 * Subscribes to real-time changes on the Firestore 'products' collection.
 * Triggers callback whenever any product or stock status is added, edited, or removed.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push(docSnap.data() as Product);
      });
      onData(products);
    },
    (err) => {
      console.warn('Real-time listener on products encountered an error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Persists a new or updated product to Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(productRef, product, { merge: true });
  } catch (error) {
    console.error(`Failed to save product ${product.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Toggles product availability and stock quantity in Firestore.
 */
export async function updateProductStockInFirestore(
  productId: string,
  isAvailable: boolean,
  stockQty: number
): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      isAvailable,
      stockQty,
    });
  } catch (error) {
    console.error(`Failed to update stock for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error(`Failed to delete product ${productId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Seeds a batch of initial products into Firestore if the collection is currently empty.
 * Returns the active product list.
 */
export async function seedProductsIfEmpty(initialList: Product[]): Promise<Product[]> {
  try {
    const existing = await getProductsFromFirestore();
    if (existing.length > 0) {
      return existing;
    }

    // Collection is empty, write initial items in batches of 400 to respect Firestore 500 ops limit
    const batchSize = 400;
    for (let i = 0; i < initialList.length; i += batchSize) {
      const chunk = initialList.slice(i, i + batchSize);
      const batch = writeBatch(db);
      chunk.forEach((prod) => {
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(ref, prod);
      });
      await batch.commit();
    }

    return initialList;
  } catch (error) {
    console.warn('Seeding initial products to Firestore failed:', error);
    return initialList;
  }
}

/**
 * Deducts stock quantities in Firestore for completed sales items.
 */
export async function deductProductStocksInFirestore(
  currentProducts: Product[],
  purchasedItems: { productId: string; quantity: number }[]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const item of purchasedItems) {
      const prod = currentProducts.find((p) => p.id === item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stockQty - item.quantity);
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.update(ref, {
          stockQty: newStock,
          isAvailable: newStock > 0,
        });
        count++;
      }
    }

    if (count > 0) {
      await batch.commit();
    }
  } catch (error) {
    console.warn('Failed to deduct product stocks in Firestore batch:', error);
  }
}
