import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPostcode } from '../src/postcode.mjs';

test('formats a postcode with its leading zero', () => {
  assert.equal(formatPostcode(247), '0247');
});