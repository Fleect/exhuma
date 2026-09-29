import React from 'react';
import { ClickEffects } from '@exhuma/core';

export default function ClickEffectsPreview(props: any) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
			<ClickEffects {...props}>
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
