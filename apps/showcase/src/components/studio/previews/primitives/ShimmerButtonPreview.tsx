import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { ShimmerButton } from '@exhuma/core';

export default function ShimmerButtonPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: 300, background: '#09090b' }}>
			<ShimmerButton
				shimmerColor={props.shimmerColor as string}
				shimmerSize={props.shimmerSize as number}
				shimmerSpeed={props.shimmerSpeed as number}
				backgroundColor={props.backgroundColor as string}
				borderRadius={props.borderRadius as string}
				borderWidth={props.borderWidth as number}
				tactilePress={props.tactilePress as boolean}
				style={{ padding: '12px 28px', color: '#fff', fontSize: '14px', fontWeight: 500 }}
			>
				Launch Studio
			</ShimmerButton>
		</div>
	);
}
