"use client"

import EssayScoringForm from "@/components/layout/essay-scoring";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">IELTS Writing AI Examiner</h1>
        <p className="text-muted-foreground">Enter your prompt and essay to get your estimated band score</p>
      </div>
      <EssayScoringForm />
    </main>
  );
};

