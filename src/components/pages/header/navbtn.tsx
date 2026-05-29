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
    <div className="group relative flex items-center justify-center text-primary hover:text-[#1A1A1A]">
      <Icon icon={icon} className="w-6 h-6" />
      <span className="absolute top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none border-white border">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}