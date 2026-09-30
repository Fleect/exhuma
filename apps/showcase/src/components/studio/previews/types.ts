export interface ComponentPreviewProps {
	props?: Record<string, any>;
	viewportMode?: 'fluid' | 'tablet' | 'mobile';
	cardSwipeResetKey?: number;
	tickerResetKey?: number;
	dockIconSet?: 'app' | 'social';
	onResetCardSwipe?: () => void;
	onResetTicker?: () => void;
	onChangeDockIconSet?: (set: 'app' | 'social') => void;
	[key: string]: any;
}
