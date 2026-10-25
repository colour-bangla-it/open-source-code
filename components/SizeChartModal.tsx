'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export function SizeChartModal({ isOpen, onClose, category = 'Panjabi' }: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-sm p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-400" />
            <h3 className="font-luxury-heading text-lg font-bold text-white uppercase tracking-wider">
              {category} Size Guide (সাইজ গাইড)
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close size guide modal"
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measurement Table */}
        <div className="space-y-4">
          <p className="text-xs text-neutral-400 font-light">
            All measurements below are in <strong className="text-white">inches</strong>. Measure a well-fitting garment flat on a surface for accuracy.
          </p>

          <div className="overflow-x-auto border border-neutral-900 rounded-sm">
            <table className="w-full text-left text-xs text-neutral-300 font-mono">
              <thead className="bg-neutral-900 text-amber-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest (বুক)</th>
                  <th className="py-3 px-4">Length (লম্বা)</th>
                  <th className="py-3 px-4">Shoulder (কাধ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-bold text-white">S (Small)</td>
                  <td className="py-2.5 px-4">36" - 38"</td>
                  <td className="py-2.5 px-4">27" - 38"</td>
                  <td className="py-2.5 px-4">16.5"</td>
                </tr>
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-bold text-white">M (Medium)</td>
                  <td className="py-2.5 px-4">38" - 40"</td>
                  <td className="py-2.5 px-4">28" - 40"</td>
                  <td className="py-2.5 px-4">17.5"</td>
                </tr>
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-bold text-white">L (Large)</td>
                  <td className="py-2.5 px-4">40" - 42"</td>
                  <td className="py-2.5 px-4">29" - 42"</td>
                  <td className="py-2.5 px-4">18.5"</td>
                </tr>
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-bold text-white">XL (X-Large)</td>
                  <td className="py-2.5 px-4">42" - 44"</td>
                  <td className="py-2.5 px-4">30" - 44"</td>
                  <td className="py-2.5 px-4">19.5"</td>
                </tr>
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-bold text-white">XXL (2X-Large)</td>
                  <td className="py-2.5 px-4">44" - 46"</td>
                  <td className="py-2.5 px-4">31" - 46"</td>
                  <td className="py-2.5 px-4">20.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-neutral-900 text-[11px] text-neutral-500 flex justify-between items-center">
          <span>Need help choosing a size?</span>
          <a
            href="https://wa.me/8801761009740"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-bold"
          >
            Ask WhatsApp Concierge →
          </a>
        </div>
      </div>
    </div>
  );
}
