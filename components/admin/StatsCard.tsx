import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string; // Tailwind class e.g. "bg-red-50"
  iconColor: string; // Tailwind class e.g. "text-red-600"
  trend?: {
    text: string;
    icon?: ReactNode;
    color: string; // Tailwind class e.g. "text-red-600"
  };
}

export default function StatsCard({ title, value, icon, iconBgColor, iconColor, trend }: StatsCardProps) {
    return (
        <div className="group overflow-hidden rounded-[2rem] bg-white/[0.02] p-8 border border-white/5 backdrop-blur-3xl shadow-2xl transition-all hover:bg-white/[0.04] relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-6 relative z-10">
                <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl transition-transform group-hover:scale-110 duration-500", iconBgColor, iconColor)}>
                    <div className="scale-125">{icon}</div>
                </div>
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{title}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter tabular-nums">{value}</span>
                        {trend && (
                            <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest", trend.color)}>
                                {trend.icon && <span className="scale-75">{trend.icon}</span>}
                                {trend.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
