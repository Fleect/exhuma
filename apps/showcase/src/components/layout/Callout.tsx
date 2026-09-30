import * as React from 'react';
import { IconInfoCircle as Info, IconBulb as Lightbulb, IconAlertTriangle as AlertTriangle, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';
import { CornerTicks } from '@/components/docs/CornerTicks';
import { cn } from '@/lib/utils';

type CalloutType = 'note' | 'tip' | 'warning' | 'important';

interface CalloutProps {
	type?: CalloutType;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

// Monochrome like the homepage; only a warning keeps a semantic color.
const calloutConfig = {
	note: { icon: Info, label: 'Note', iconClass: 'text-foreground' },
	tip: { icon: Lightbulb, label: 'Tip', iconClass: 'text-foreground' },
	warning: { icon: AlertTriangle, label: 'Warning', iconClass: 'text-amber-600 dark:text-amber-400' },
	important: { icon: ShieldCheck, label: 'Guarantee', iconClass: 'text-foreground' },
};

export function Callout({ type = 'note', title, children, className }: CalloutProps) {
	const config = calloutConfig[type];
	const CalloutIcon = config.icon;

	return (
		<aside className={cn('border-border/80 bg-card/60 relative my-4 overflow-hidden rounded-2xl border p-5 shadow-xs backdrop-blur-sm', className)}>
			<CornerTicks />
			<div className='text-3xs text-muted-foreground flex items-center gap-2 font-mono'>
				<CalloutIcon aria-hidden='true' className={cn('h-3.5 w-3.5 shrink-0', config.iconClass)} />
				<span className='text-foreground font-bold tracking-wider uppercase'>{config.label}</span>
			</div>
			{title && <div className='text-foreground mt-2 text-sm font-bold tracking-tight'>{title}</div>}
			<div className='text-muted-foreground mt-1.5 text-xs leading-relaxed sm:text-sm [&>p]:leading-relaxed'>{children}</div>
		</aside>
	);
}

export default Callout;
