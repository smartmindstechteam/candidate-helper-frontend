import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function capitalize(word:string | null){
  if (!word) return null
  return word.slice(0,1).toUpperCase() + word.slice(1,word.length);
}