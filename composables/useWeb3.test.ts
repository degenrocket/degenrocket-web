import {describe, it, test, expect, assert} from 'vitest';
// import { useWeb3 } from './useWeb3';
// import { vi } from 'vitest';
// import { ethers } from 'ethers';

// globalThis.useFetch = () => {
//   return () => {
//     // mock implementation of useFetch
//   };
// };

// describe('showWeb3Modal', () => {
//   const { showWeb3Modal, isWeb3ModalShown } = useWeb3();
//   test('should set isWeb3ModalShown to true', () => {
//     showWeb3Modal();
//     expect(isWeb3ModalShown.value).toBe(true);
//   });
// });

// describe('hideWeb3Modal', () => {
//   const { hideWeb3Modal, isWeb3ModalShown } = useWeb3();
//   test('should set isWeb3ModalShown to false', () => {
//     hideWeb3Modal();
//     expect(isWeb3ModalShown.value).toBe(false);
//   });
// });

// describe('connectWeb3Authenticator', () => {
//   const { connectWeb3Authenticator } = useWeb3();

  // test('connectWeb3Authenticator calls window.ethereum.request', async () => {
  //   const mockRequest = vi.fn(() => Promise.resolve('value'));
  //   vi.mock('window', () => ({ ethereum: { request: mockRequest } }));
  //   const result = await connectWeb3Authenticator();
  //   expect(mockRequest).toHaveBeenCalled();
  //   expect(result).toEqual('value');
  // });

// test('connectweb3authenticator calls window.ethereum.request', async () => {
//   const mockRequest = vi.fn(() => Promise.resolve('value'));
//   // global.window = { ethereum: {} };
//   window.ethereum = { request: mockRequest };
//   await connectWeb3Authenticator();
//   expect(mockRequest).toHaveBeenCalled();
// });

  // const { connectedAddress, connectWeb3Authenticator, pendingAuthentication, listAccounts, mockResolvedValueOnce } = useWeb3();
  // test('should set pendingAuthentication to true', async () => {
  //   await connectWeb3Authenticator();
  //   expect(pendingAuthentication.value).toBe(true);
  // });
  //
  // test('should set connectedAddress when accounts are available', async () => {
  //   const mockAccounts = [{ address: '0x123' }];
  //   listAccounts.mockResolvedValueOnce(mockAccounts);
  //   await connectWeb3Authenticator();
  //   expect(pendingAuthentication.value).toBe(false);
  //   expect(connectedAddress.value).toBe(mockAccounts[0].address);
  // });
  //
  // test('should set pendingAuthentication to false when no accounts are available', async () => {
  //   listAccounts.mockResolvedValueOnce([]);
  //   await connectWeb3Authenticator();
  //   expect(pendingAuthentication.value).toBe(false);
  // });
  //
  // test('should catch errors and set pendingAuthentication to false', async () => {
  //   const mockError = new Error('Test error');
  //   listAccounts.mockRejectedValueOnce(mockError);
  //   await connectWeb3Authenticator();
  //   expect(pendingAuthentication.value).toBe(false);
  //   expect(console.error).toHaveBeenCalledWith(mockError);
  // });
// });

// describe('detectProvider', () => {
//   const { detectProvider } = useWeb3();
//   it('returns true if window.ethereum exists', async () => {
//     // global.window = { ethereum: {} };
//     // const result = await detectProvider();
//     // expect(result).toBe(true);
//     // delete global.window;
//   });
//
//   it('returns false if window.ethereum does not exist', async () => {
//     global.window = { ethereum: undefined };
//     const result = await detectProvider();
//     expect(result).toBe(false);
//     delete global.window;
//   });
// });

// describe('setRandomSigner', () => {
//   const { setRandomSigner, signer } = useWeb3();
//   it('should set the connected address to the signer address', () => {
//     setRandomSigner();
//     expect(signer.address).toBeDefined();
//     expect(signer.address).toMatch(ethers.utils.getAddress(signer.address));
//   });
// });

describe('true', () => {
  test('true', () => {
    expect(true).toBe(true);
  });
});
