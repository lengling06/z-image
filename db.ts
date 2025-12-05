import Dexie, { Table } from 'dexie';
import { HistoryItem } from './types';

export class ZImageDB extends Dexie {
    history!: Table<HistoryItem>;

    constructor() {
        super('z_image_history');
        this.version(1).stores({
            history: '++id, timestamp' // Primary key 'id' (auto-incrementing) and index on 'timestamp'
        });
    }
}

export const db = new ZImageDB();