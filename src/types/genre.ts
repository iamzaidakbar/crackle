export interface Genre {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  keywords?: string[];
}
