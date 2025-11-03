// @ts-nocheck
const supabaseUrl = 'https://zqufexepwxmfezurkpur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdWZleGVwd3htZmV6dXJrcHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjc5MTUsImV4cCI6MjA3NzYwMzkxNX0.e44fVLPCsg-uD1meh7nAbKDfBqEU-z29ULEerlQr9k8';

// This is to avoid TypeScript errors since the library is loaded from a CDN.
declare global {
  interface Window {
    supabase: any;
  }
}

export const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
