"use client";

import { Icon } from "@iconify/react";

interface NavBtnProps {
  icon: string;
  label: string;
  href?: string;
  badge?: number;
}

export function NavBtn({ icon, label, href, badge }: NavBtnProps) {
  const content = (
    <div className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative">
      <Icon icon={icon} className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}