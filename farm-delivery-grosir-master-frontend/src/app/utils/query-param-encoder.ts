import { HttpUrlEncodingCodec } from '@angular/common/http';

export class MyCodec extends HttpUrlEncodingCodec {
    // If I want to encode like 'foo[]=bar&foo[]=baz', but it seems to be impossible.
    // Because it requires to encode with combination of key and value.
    encodeKey(k: string): string {
        return k;
        }
    encodeValue(v: string): string {
        return v;
    }

    // If a function like `encodeKeyValue(k: string, v: any): string` is exposed it might be possible?
    encodeKeyValue(k: string, v: any): string {
        if (Array.isArray(v)) {
        return v.map(item => `${super.encodeKey(k)}[]=${super.encodeValue(item)}`).join('&'); // foo[]=bar&foo[]=baz
        } else {
        // return super.encodeKeyValue(k, v);
        return `${super.encodeKey(k)}=${super.encodeValue(v)}`;
        }
    }
}
  