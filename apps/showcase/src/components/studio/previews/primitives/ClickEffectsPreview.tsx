import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { ClickEffects } from '@exhuma/core';

export default function ClickEffectsPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: 300 }}>
			<ClickEffects
				mode={props.mode as 'shockwave' | 'ripple' | 'sparks' | 'elastic'}
				color={props.color as string}
				duration={props.duration as number}
				sparkCount={props.sparkCount as number}
			>
				<button
					style={{
						padding: '16px 32px',
						background: '#18181b',
						color: '#fff',
						border: '1px solid #27272a',
						borderRadius: '12px',
						cursor: 'pointer',
						fontSize: '15px',
						fontWeight: 500,
					}}
				>
					Click anywhere
				</button>
			</ClickEffects>
		</div>
	);
}
