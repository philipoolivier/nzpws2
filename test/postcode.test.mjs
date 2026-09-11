import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPostcode, isPostcode } from '../src/postcode.mjs';

test('formats a postcode with its leading zero', () => {
	assert.equal(formatPostcode(247), '0247');
});

test('recognises a four-digit postcode', () => {
	assert.equal(isPostcode('0247'), true);
});