import { type Countdown, type InsertCountdown, type Item, type InsertItem, type Agenda, type InsertAgenda } from "@shared/schema";

export interface IStorage {
  // Countdown
  getCountdown(): Promise<Countdown | undefined>;
  setCountdown(countdown: InsertCountdown): Promise<Countdown>;
  
  // Items
  getItems(): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: Partial<InsertItem>): Promise<Item>;
  deleteItem(id: number): Promise<void>;
  
  // Agenda
  getAgenda(): Promise<Agenda[]>;
  createAgenda(agenda: InsertAgenda): Promise<Agenda>;
  updateAgenda(id: number, agenda: Partial<InsertAgenda>): Promise<Agenda>;
  deleteAgenda(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private countdown: Countdown | undefined;
  private items: Map<number, Item>;
  private agenda: Map<number, Agenda>;
  private currentItemId: number = 1;
  private currentAgendaId: number = 1;

  constructor() {
    this.items = new Map();
    this.agenda = new Map();
  }

  async getCountdown(): Promise<Countdown | undefined> {
    return this.countdown;
  }

  async setCountdown(countdown: InsertCountdown): Promise<Countdown> {
    this.countdown = { id: 1, ...countdown };
    return this.countdown;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values()).sort((a, b) => a.order - b.order);
  }

  async createItem(item: InsertItem): Promise<Item> {
    const id = this.currentItemId++;
    const newItem: Item = { id, ...item };
    this.items.set(id, newItem);
    return newItem;
  }

  async updateItem(id: number, item: Partial<InsertItem>): Promise<Item> {
    const existing = this.items.get(id);
    if (!existing) throw new Error("Item not found");
    const updated = { ...existing, ...item };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: number): Promise<void> {
    this.items.delete(id);
  }

  async getAgenda(): Promise<Agenda[]> {
    return Array.from(this.agenda.values()).sort((a, b) => a.order - b.order);
  }

  async createAgenda(agenda: InsertAgenda): Promise<Agenda> {
    const id = this.currentAgendaId++;
    const newAgenda: Agenda = { 
      id, 
      ...agenda,
      highlighted: agenda.highlighted ?? false 
    };
    this.agenda.set(id, newAgenda);
    return newAgenda;
  }

  async updateAgenda(id: number, agenda: Partial<InsertAgenda>): Promise<Agenda> {
    const existing = this.agenda.get(id);
    if (!existing) throw new Error("Agenda item not found");
    const updated = { ...existing, ...agenda };
    this.agenda.set(id, updated);
    return updated;
  }

  async deleteAgenda(id: number): Promise<void> {
    this.agenda.delete(id);
  }
}

export const storage = new MemStorage();