'use client';
import React from "react";
import { ScaleViewer } from "@/components/ScaleViewer";

export const Page = () => {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          Scale Viewer
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore guitar scales and improve your playing
        </p>
      </header>
      <div className="rounded-xl overflow-hidden border bg-card">
        <div className="p-6">
          <ScaleViewer width={800} height={300} />
        </div>
      </div>
      <footer className="text-center text-sm text-muted-foreground">
        © 2024 Guitar Scale Viewer. All rights reserved.
      </footer>
    </div>
  );
};

export default Page;