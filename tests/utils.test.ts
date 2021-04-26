import { loadScript } from '../src/index';
import { resetDataLayer, resetHtml } from './test-utils';

describe('utils', () => {
  describe('loadScript', () => {
    function expectDataLayerToBeCorrect(): void {
      expect(window.dataLayer).toBeDefined();
      expect(window.dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            event: 'gtm.js',
            'gtm.start': expect.any(Number)
          })
        ])
      );
    }

    type ScriptChecks = { src: string; async: boolean; defer: boolean; nonce: string };
    function expectScriptToBeCorrect({ src, async, defer, nonce }: ScriptChecks): void {
      expect(document.scripts.length).toBe(1);

      const script: HTMLScriptElement = document.scripts.item(0) as HTMLScriptElement;
      expect(script).toBeDefined();
      expect(script.src).toBe(src);
      expect(script.async).toBe(async);
      expect(script.defer).toBe(defer);
      expect(script.nonce).toBe(nonce);
    }

    afterEach(() => {
      resetHtml();
      resetDataLayer();
    });

    test(JSON.stringify({ compatibility: false, defer: false }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: false,
        defer: false
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO',
        async: true,
        defer: false,
        nonce: ''
      });
    });

    test(JSON.stringify({ compatibility: true, defer: false }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: true,
        defer: false
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO',
        async: true,
        defer: true,
        nonce: ''
      });
    });

    test(JSON.stringify({ compatibility: false, defer: true }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: false,
        defer: true
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO',
        async: false,
        defer: true,
        nonce: ''
      });
    });

    test(JSON.stringify({ compatibility: true, defer: true }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: true,
        defer: true
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO',
        async: false,
        defer: true,
        nonce: ''
      });
    });

    // Test nonce
    test(JSON.stringify({ compatibility: false, defer: false, nonce: 'test' }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: false,
        defer: false,
        nonce: 'test'
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO',
        async: true,
        defer: false,
        nonce: 'test'
      });
    });

    // Test query
    test(JSON.stringify({ compatibility: false, defer: false, queryParams: true }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      loadScript('GTM-DEMO', {
        compatibility: false,
        defer: false,
        queryParams: {
          gtm_auth: 'auth',
          gtm_preview: 'preview',
          gtm_cookies_win: 'cookies_win'
        }
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src:
          'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&gtm_auth=auth&gtm_preview=preview&gtm_cookies_win=cookies_win',
        async: true,
        defer: false,
        nonce: ''
      });
    });
  });
});
