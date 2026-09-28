'use client';

import * as React from 'react';
import { IconAdjustments as Sliders, IconRefresh as RefreshCw } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropDescriptor } from '@/registry';
import { COLOR_PRESETS, toHexColor } from './StudioPresets';
import { cn } from '@/lib/utils';

export interface StudioInspectorProps {
	props: PropDescriptor[];
	propValues: Record<string, unknown>;
	onPropChange: (name: string, value: unknown) => void;
	onReset: () => void;
	isExpanded?: boolean;
}

export function StudioInspector({ props, propValues, onPropChange, onReset, isExpanded = false }: StudioInspectorProps) {
	return (
		<div
			className={cn('border-border/80 bg-card/75 relative space-y-4 overflow-hidden rounded-2xl border p-4 shadow-xs backdrop-blur-xl transition-all duration-300', isExpanded ? 'xl:col-span-12' : 'xl:col-span-4')}
		>
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

			<div className='border-border/70 flex items-center justify-between border-b pb-3'>
				<div className='flex items-center gap-2'>
					<Sliders className='text-foreground/80 h-4 w-4 shrink-0' />
					<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Parameters</span>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant='outline' className='text-4xs bg-background/80 text-foreground font-mono font-bold tracking-wider uppercase'>
						{props.length} Props
					</Badge>
					<Button
						variant='ghost'
						size='sm'
						onClick={onReset}
						className='text-muted-foreground hover:text-foreground text-3xs flex h-7 cursor-pointer items-center gap-1.5 px-2 font-mono transition-colors'
						title='Reset all parameters to default'
					>
						<RefreshCw className='h-3 w-3' />
						<span>Reset</span>
					</Button>
				</div>
			</div>

			{/* Dynamic Prop Tweaks List */}
			<div className='max-h-[31.25rem] space-y-1.5 overflow-y-auto pr-1'>
				{props.map((propDef) => {
					const rawVal = propValues[propDef.name];
					const val = rawVal !== undefined && rawVal !== null && rawVal !== '' ? rawVal : propDef.defaultValue;

					return (
						<div key={propDef.name} className='border-border/70 bg-background/50 hover:border-foreground/30 rounded-lg border px-2.5 py-2.5 shadow-2xs transition-colors'>
							<div className='flex items-center justify-between text-xs'>
								<label htmlFor={`prop-${propDef.name}`} className='text-foreground text-2xs font-mono font-semibold'>
									{propDef.name}
								</label>
								{propDef.type === 'boolean' && <Switch id={`prop-${propDef.name}`} checked={Boolean(val)} onCheckedChange={(checked) => onPropChange(propDef.name, checked)} />}
							</div>

							{/* Controls */}
							{propDef.type === 'select' && propDef.options ? (
								<div className='mt-1 w-full'>
									<Select value={String(val ?? '')} onValueChange={(newVal) => onPropChange(propDef.name, newVal)}>
										<SelectTrigger id={`prop-${propDef.name}`} className='text-2xs h-7 w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{propDef.options.map((opt) => (
												<SelectItem key={opt.value} value={opt.value} className='text-2xs'>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							) : propDef.type === 'number' ? (
								(() => {
									const parsed = typeof val === 'number' ? val : parseFloat(String(val));
									const hasRange = propDef.min !== undefined && propDef.max !== undefined;
									const min = propDef.min ?? 0;
									const max = propDef.max ?? 100;
									const step = propDef.step ?? 1;
									const num = Number.isFinite(parsed) ? parsed : min;
									return (
										<div className='flex items-center gap-2 pt-0.5'>
											{hasRange && <Slider min={min} max={max} step={step} value={[num]} onValueChange={(vals) => onPropChange(propDef.name, vals[0])} className='flex-1' />}
											<Input
												type='number'
												min={propDef.min}
												max={propDef.max}
												step={propDef.step}
												value={Number.isFinite(parsed) ? parsed : ''}
												onChange={(e) => {
													const parsedVal = parseFloat(e.target.value);
													onPropChange(propDef.name, Number.isFinite(parsedVal) ? parsedVal : 0);
												}}
												className={cn('text-3xs h-6 px-1 py-0 text-right font-mono', hasRange ? 'w-14' : 'w-full')}
											/>
										</div>
									);
								})()
							) : propDef.type === 'color' ? (
								(() => {
									const colorFallback = String(propDef.defaultValue || (propDef.name.toLowerCase().includes('dark') ? '#09090b' : '#ffffff'));
									return (
										<div className='flex flex-col gap-1.5 pt-0.5'>
											<div className='flex items-center gap-1.5'>
												<input
													type='color'
													id={`prop-${propDef.name}`}
													value={toHexColor(val, colorFallback)}
													onChange={(e) => onPropChange(propDef.name, e.target.value)}
													className='border-border/80 h-7 w-9 cursor-pointer rounded-md border bg-transparent p-0.5'
													title='Select color'
												/>
												<Input
													type='text'
													value={String(val ?? colorFallback)}
													onChange={(e) => onPropChange(propDef.name, e.target.value)}
													className='text-3xs h-7 flex-1 font-mono'
													placeholder={colorFallback}
												/>
											</div>
											<div className='flex items-center gap-1 pt-0.5'>
												{COLOR_PRESETS.map((preset) => (
													<button
														key={preset.value}
														type='button'
														title={`${preset.label} (${preset.value})`}
														onClick={() => onPropChange(propDef.name, preset.value)}
														className={`h-3.5 w-3.5 cursor-pointer rounded-full border transition-transform hover:scale-125 ${
															toHexColor(val, colorFallback) === preset.value.toLowerCase() ? 'border-foreground ring-primary scale-110 ring-1' : 'border-border/80'
														}`}
														style={{ backgroundColor: preset.value }}
													/>
												))}
											</div>
										</div>
									);
								})()
							) : propDef.type !== 'boolean' ? (
								<div className='pt-0.5'>
									<Input type='text' id={`prop-${propDef.name}`} value={String(val ?? '')} onChange={(e) => onPropChange(propDef.name, e.target.value)} className='text-3xs h-6 w-full font-mono' />
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}
