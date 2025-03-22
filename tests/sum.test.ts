import {describe, expect, test} from '@jest/globals';

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
    });
    test('adds 2 + 2 to not equal 3', () => {
        expect(2 + 2).not.toBe(3);
    });
});