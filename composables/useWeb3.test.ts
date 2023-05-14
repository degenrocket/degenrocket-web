import {describe, it, test, expect, assert} from 'vitest';
import { useWeb3 } from './useWeb3';
import { vi } from 'vitest';
import { ethers } from 'ethers';

describe('showWeb3Modal', () => {
  const { showWeb3Modal, isWeb3ModalShown } = useWeb3();
  test('should set isWeb3ModalShown to true', () => {
    showWeb3Modal();
    expect(isWeb3ModalShown.value).toBe(true);
  });
});

describe('hideWeb3Modal', () => {
  const { hideWeb3Modal, isWeb3ModalShown } = useWeb3();
  test('should set isWeb3ModalShown to false', () => {
    hideWeb3Modal();
    expect(isWeb3ModalShown.value).toBe(false);
  });
});

describe('detectProvider', () => {
  const { detectProvider } = useWeb3();
  it('returns true if window.ethereum exists', async () => {
    global.window = { ethereum: {} };
    const result = await detectProvider();
    expect(result).toBe(true);
    delete global.window;
  });

  it('returns false if window.ethereum does not exist', async () => {
    global.window = { ethereum: undefined };
    const result = await detectProvider();
    expect(result).toBe(false);
    delete global.window;
  });
});

// sliceAddress
describe('sliceAddress-each', () => {
  const { sliceAddress } = useWeb3();

  test.each([
    ['1234567', 2, 4, '12...4567'],
    ['12345678', 3, 2, '123...78'],
    ['123456789', 4, undefined, '1234...6789'],
    [null, 5, 4, ''],
    [undefined, undefined, undefined, ''],
    ['1234', 0, 4, '...1234'],
  ])('given %s and %d as arguments, returns %s', (input, start, end, expected) => {
    const result = sliceAddress(input, start, end);
    expect(result).toEqual(expected);
    expect(result).to.be.a('string');
  });
});

// randomNumber
describe('randomNumber-each', () => {
  const { randomNumber } = useWeb3();

  test.each([
    [1, 10], // min, max
    [100, 200],
    [Number.MIN_VALUE, Number.MAX_VALUE],
    [-10, 10],
  ])('returns a random number between %d and %d', (min, max) => {
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});
