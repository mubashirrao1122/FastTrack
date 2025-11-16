import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHash(hash: string, length = 10): string {
  if (hash.length <= length) return hash;
  const start = hash.slice(0, length / 2);
  const end = hash.slice(-length / 2);
  return `${start}...${end}`;
}

export function generateHash(input: string, difficulty: number = 4): string {
  let nonce = 0;
  let hash = '';
  const prefix = '0'.repeat(difficulty);
  
  while (!hash.startsWith(prefix)) {
    hash = simpleHash(input + nonce);
    nonce++;
  }
  
  return hash;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

export function validateHash(hash: string, difficulty: number = 4): boolean {
  const prefix = '0'.repeat(difficulty);
  return hash.startsWith('0x' + prefix);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomColor(): string {
  const colors = ['#00f5ff', '#bf40bf', '#00ff88', '#ffcc00', '#ff006e'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getStatusColor(status: 'present' | 'absent' | 'late'): string {
  switch (status) {
    case 'present':
      return 'text-neon-green border-neon-green bg-neon-green/10';
    case 'absent':
      return 'text-neon-red border-neon-red bg-neon-red/10';
    case 'late':
      return 'text-neon-yellow border-neon-yellow bg-neon-yellow/10';
    default:
      return 'text-gray-400 border-gray-400 bg-gray-400/10';
  }
}
