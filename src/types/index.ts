
export interface ListItem {
  id: string;
  text: string;
  isCompleted: boolean;
  isPriority: boolean;
  createdAt: number;
}

export interface List {
  id: string;
  name: string;
  items: ListItem[];
  position: { x: number; y: number };
}
