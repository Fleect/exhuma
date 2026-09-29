import React from 'react';
import { ShimmerButton } from '@exhuma/core';

export default function ShimmerButtonPreview(props: any) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#09090b' }}>
			<ShimmerButton
				{...props}
				style={{ padding: '12px 24px', color: '#fff', fontSize: '14px', fontWeight: 500 }}
			>
				Launch Studio
			</ShimmerButton>
		</div>
	);
}
