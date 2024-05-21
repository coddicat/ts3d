import { Position } from './types';

const rad360 = Math.PI * 2;

export const sign = (n: number): number => n < 0 ? -1 : 1;

export const mod = (x: number, y: number) => x - ((x / y) | 0) * y;

export const angle = (pos0: Position, pos1: Position): number => mod(Math.atan2(pos1.y - pos0.y, pos1.x - pos0.x) + rad360, rad360);

export const norm = (a: number): number => mod(mod(a, rad360) + rad360, rad360);
