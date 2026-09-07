import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPostCodeFromString } from './helpers.mjs';

test('extracts a four-digit suffix', () => { assert.equal(getPostCodeFromString('Sampletown 5678'), '5678'); });
test('preserves a leading zero', () => { assert.equal(getPostCodeFromString('Sampletown 0123'), '0123'); });
test('returns an empty string without a numeric suffix', () => { assert.equal(getPostCodeFromString('Sampletown'), ''); });
test('handles the empty string', () => { assert.equal(getPostCodeFromString(''), ''); });

// Test-first lab: add a test for trailing whitespace BEFORE changing helpers.mjs.
// Workshop change request WS-05: tolerate trailing spaces, tabs and newlines.
