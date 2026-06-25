import { net, protocol } from 'electron';
import { pathToFileURL } from 'node:url';
import { PROTOCOLS } from '@shared/protocols';

export function registerVideoProtocol() {
  protocol.handle(PROTOCOLS.video, async (req) => {
    console.log('Protocol request: ', req.url);
    console.log(req.headers.get('range'));

    const filePath = decodeURIComponent(
      req.url.replace(`${PROTOCOLS.video}://`, ''),
    );

    console.log('Decoded path: ', filePath);

    const fileUrl = pathToFileURL(filePath).toString();

    console.log('Fetching: ', fileUrl);

    const res = await net.fetch(fileUrl);

    console.log('Status', res.status);
    console.log('OK:', res.ok);
    console.log('Content-Type:', res.headers.get('content-type'));

    return res;
  });
}
