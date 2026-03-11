'use client';

import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-2xl' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />
      <div 
        className={clsx(
          "bg-card rounded-lg shadow-xl relative w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-card-border shrink-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-card-border bg-secondary/20 shrink-0 flex justify-end gap-3 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
