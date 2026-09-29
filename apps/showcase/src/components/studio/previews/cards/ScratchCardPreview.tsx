'use client';
import React from 'react';
import { ScratchCard } from '@exhuma/cards';

export default function ScratchCardPreview(props: any) {
  return (
    <div className="flex items-center justify-center p-8 w-full h-full min-h-[400px]">
      <ScratchCard
        {...props}
        className="rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800"
        revealContent={
          <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
            <h3 className="text-2xl font-bold text-rose-500">50% OFF!</h3>
            <p className="text-sm text-neutral-500">You revealed the secret code.</p>
          </div>
        }
      />
    </div>
  );
}
