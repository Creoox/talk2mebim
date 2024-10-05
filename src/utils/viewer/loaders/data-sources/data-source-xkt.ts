import { IXKTDefaultDataSource } from '@xeokit/xeokit-sdk';
import { utils } from '@xeokit/xeokit-sdk/src/index.js';
import { XKTDefaultDataSource } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTDefaultDataSource.js';

export class DataSourceXKT extends XKTDefaultDataSource implements IXKTDefaultDataSource {
  cacheBuster: boolean = false;

  constructor(cfg: any = {}) {
    super(cfg);
    this.cacheBuster = cfg.cacheBuster !== false;
  }

  _cacheBusterURL(url) {
    if (!this.cacheBuster) {
      return url;
    }
    const timestamp = new Date().getTime();
    if (url.indexOf('?') > -1) {
      return url + '&_=' + timestamp;
    } else {
      return url + '?_=' + timestamp;
    }
  }

  // Gets metamodel JSON
  getMetaModel(metaModelSrc, ok, error) {
    console.log(`XeoXKTDataSource#getMetaModel(${metaModelSrc})`);

    utils.loadJSON(
      metaModelSrc,
      (json) => {
        ok(json);
      },
      function (errMsg) {
        error(errMsg);
      },
    );
  }

  // Gets the contents of the given .XKT file in an arraybuffer
  getXKT(src: string | number, ok: (buffer: ArrayBuffer) => void, error: (e: Error) => void) {
    const defaultCallback = () => {};
    ok = ok || defaultCallback;
    error = error || defaultCallback;

    const dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
    const dataUriRegexResult = (src as string).match(dataUriRegex);
    if (dataUriRegexResult) {
      // Safari can't handle data URIs through XMLHttpRequest
      const isBase64 = !!dataUriRegexResult[2];
      let data = dataUriRegexResult[3];
      data = window.decodeURIComponent(data);
      if (isBase64) {
        data = window.atob(data);
      }
      try {
        const buffer = new ArrayBuffer(data.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < data.length; i++) {
          view[i] = data.charCodeAt(i);
        }
        ok(buffer);
      } catch (errMsg: any) {
        error(errMsg);
      }
    } else {
      const request = new XMLHttpRequest();
      request.open('GET', this._cacheBusterURL(src), true);
      request.responseType = 'arraybuffer';



      request.onabort = function (event: ProgressEvent) {
        const error = new Error('Download aborted');
      };

      request.ontimeout = function (event: ProgressEvent) {
        const error = new Error('Download timeout');
      };

      request.onreadystatechange = function (_event: Event) {
        if (request.readyState === 4) {
          if (request.status === 200) {
            ok(request.response);
          } else {
            const xktError = new Error('getXKT error : ' + request.response);
            error(xktError);
          }
        }
      };
      request.send(null);
    }
  }
}
