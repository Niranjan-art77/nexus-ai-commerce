import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class FileDb<T extends { _id?: string; createdAt?: Date; updatedAt?: Date }> {
  private filePath: string;

  constructor(private modelName: string) {
    this.filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private read(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  private write(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Mimic Mongoose Model methods
  async find(query: any = {}): Promise<T[]> {
    let items = this.read();
    
    // Simple query filter
    if (Object.keys(query).length > 0) {
      items = items.filter(item => {
        for (const key in query) {
          // If query key is an object (e.g. price: { $gte: 100 }), handle it
          if (query[key] && typeof query[key] === 'object') {
            const val = item[key as keyof T];
            const q = query[key];
            if ('$gte' in q && Number(val) < q.$gte) return false;
            if ('$lte' in q && Number(val) > q.$lte) return false;
            if ('$in' in q && Array.isArray(q.$in) && !q.$in.includes(val)) return false;
          } else {
            // Regex or exact match
            const qVal = query[key];
            const itemVal = item[key as keyof T];
            if (qVal instanceof RegExp) {
              if (!qVal.test(String(itemVal))) return false;
            } else if (itemVal !== qVal) {
              return false;
            }
          }
        }
        return true;
      });
    }
    return items;
  }

  async findOne(query: any = {}): Promise<T | null> {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id: string): Promise<T | null> {
    const items = this.read();
    return items.find(item => item._id === id) || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const items = this.read();
    const now = new Date();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: now,
      updatedAt: now,
      ...data,
    } as unknown as T;

    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async insertMany(dataArray: Partial<T>[]): Promise<T[]> {
    const items = this.read();
    const now = new Date();
    const newItems = dataArray.map(data => ({
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: now,
      updatedAt: now,
      ...data,
    })) as unknown as T[];

    const updated = [...items, ...newItems];
    this.write(updated);
    return newItems;
  }

  async deleteMany(query: any = {}): Promise<{ deletedCount: number }> {
    const allItems = this.read();
    const remainingItems = allItems.filter(item => {
      for (const key in query) {
        if (item[key as keyof T] === query[key]) return false;
      }
      return true;
    });

    this.write(remainingItems);
    return { deletedCount: allItems.length - remainingItems.length };
  }

  async findByIdAndUpdate(id: string, update: any, options: any = {}): Promise<T | null> {
    const items = this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    const current = items[index]!;
    // Support either direct update or $push / $set
    let updatedFields = { ...update };
    if (update.$push) {
      for (const key in update.$push) {
        const arr = (current[key as keyof T] as any) || [];
        updatedFields[key] = [...arr, update.$push[key]];
      }
      delete updatedFields.$push;
    }
    if (update.$pull) {
      for (const key in update.$pull) {
        const arr = (current[key as keyof T] as any) || [];
        updatedFields[key] = arr.filter((x: any) => x !== update.$pull[key]);
      }
      delete updatedFields.$pull;
    }

    const updated = {
      ...current,
      ...updatedFields,
      updatedAt: new Date(),
    } as T;

    items[index] = updated;
    this.write(items);
    return updated;
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const items = this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0]!;
    this.write(items);
    return removed;
  }

  // Static helper to simulate instance save()
  static makeInstance<U extends { _id?: string; save?: () => Promise<U> }>(db: FileDb<any>, data: U): U & { save: () => Promise<U> } {
    const instance = {
      ...data,
      save: async function(this: any) {
        if (!this._id) {
          const created = await db.create(this);
          Object.assign(this, created);
        } else {
          await db.findByIdAndUpdate(this._id, this);
        }
        return this;
      }
    };
    return instance;
  }
}

export function createMockModel<T extends { _id?: string }>(modelName: string) {
  const db = new FileDb<T>(modelName);

  function ModelConstructor(this: any, data: Partial<T>) {
    Object.assign(this, data);
    this.save = async function() {
      if (!this._id) {
        const created = await db.create(this);
        Object.assign(this, created);
      } else {
        await db.findByIdAndUpdate(this._id, this);
      }
      return this;
    };
  }

  // Attach static methods
  (ModelConstructor as any).find = (query?: any) => db.find(query);
  (ModelConstructor as any).findOne = (query?: any) => db.findOne(query);
  (ModelConstructor as any).findById = (id: string) => db.findById(id);
  (ModelConstructor as any).create = (data: Partial<T>) => db.create(data);
  (ModelConstructor as any).deleteMany = (query?: any) => db.deleteMany(query);
  (ModelConstructor as any).insertMany = (dataArray: Partial<T>[]) => db.insertMany(dataArray);
  (ModelConstructor as any).findByIdAndUpdate = (id: string, update: any, options?: any) => db.findByIdAndUpdate(id, update, options);
  (ModelConstructor as any).findByIdAndDelete = (id: string) => db.findByIdAndDelete(id);

  return ModelConstructor as any;
}
