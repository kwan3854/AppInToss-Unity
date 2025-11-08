export interface AdNetworkResponseInfo {
  ad_source_id?: string;
  ad_source_name?: string;
  ad_source_instance_id?: string;
  ad_source_instance_name?: string;
  ad_network_class_name?: string;
}

export function encodeAdNetworkResponseInfo(message: AdNetworkResponseInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeAdNetworkResponseInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeAdNetworkResponseInfo(message: AdNetworkResponseInfo, bb: ByteBuffer): void {
  // optional string ad_source_id = 1;
  let $ad_source_id = message.ad_source_id;
  if ($ad_source_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $ad_source_id);
  }

  // optional string ad_source_name = 2;
  let $ad_source_name = message.ad_source_name;
  if ($ad_source_name !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $ad_source_name);
  }

  // optional string ad_source_instance_id = 3;
  let $ad_source_instance_id = message.ad_source_instance_id;
  if ($ad_source_instance_id !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $ad_source_instance_id);
  }

  // optional string ad_source_instance_name = 4;
  let $ad_source_instance_name = message.ad_source_instance_name;
  if ($ad_source_instance_name !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ad_source_instance_name);
  }

  // optional string ad_network_class_name = 5;
  let $ad_network_class_name = message.ad_network_class_name;
  if ($ad_network_class_name !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $ad_network_class_name);
  }
}

export function decodeAdNetworkResponseInfo(binary: Uint8Array): AdNetworkResponseInfo {
  return _decodeAdNetworkResponseInfo(wrapByteBuffer(binary));
}

function _decodeAdNetworkResponseInfo(bb: ByteBuffer): AdNetworkResponseInfo {
  let message: AdNetworkResponseInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string ad_source_id = 1;
      case 1: {
        message.ad_source_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string ad_source_name = 2;
      case 2: {
        message.ad_source_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string ad_source_instance_id = 3;
      case 3: {
        message.ad_source_instance_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string ad_source_instance_name = 4;
      case 4: {
        message.ad_source_instance_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string ad_network_class_name = 5;
      case 5: {
        message.ad_network_class_name = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResponseInfo {
  response_id?: string;
  loaded_ad_network_info?: AdNetworkResponseInfo;
  ad_network_info_array?: AdNetworkResponseInfo[];
}

export function encodeResponseInfo(message: ResponseInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeResponseInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeResponseInfo(message: ResponseInfo, bb: ByteBuffer): void {
  // optional string response_id = 1;
  let $response_id = message.response_id;
  if ($response_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $response_id);
  }

  // optional AdNetworkResponseInfo loaded_ad_network_info = 2;
  let $loaded_ad_network_info = message.loaded_ad_network_info;
  if ($loaded_ad_network_info !== undefined) {
    writeVarint32(bb, 18);
    let nested = popByteBuffer();
    _encodeAdNetworkResponseInfo($loaded_ad_network_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated AdNetworkResponseInfo ad_network_info_array = 3;
  let array$ad_network_info_array = message.ad_network_info_array;
  if (array$ad_network_info_array !== undefined) {
    for (let value of array$ad_network_info_array) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeAdNetworkResponseInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeResponseInfo(binary: Uint8Array): ResponseInfo {
  return _decodeResponseInfo(wrapByteBuffer(binary));
}

function _decodeResponseInfo(bb: ByteBuffer): ResponseInfo {
  let message: ResponseInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string response_id = 1;
      case 1: {
        message.response_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional AdNetworkResponseInfo loaded_ad_network_info = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.loaded_ad_network_info = _decodeAdNetworkResponseInfo(bb);
        bb.limit = limit;
        break;
      }

      // repeated AdNetworkResponseInfo ad_network_info_array = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.ad_network_info_array || (message.ad_network_info_array = []);
        values.push(_decodeAdNetworkResponseInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LoadAdRequest {
  ad_group_id?: string;
}

export function encodeLoadAdRequest(message: LoadAdRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeLoadAdRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeLoadAdRequest(message: LoadAdRequest, bb: ByteBuffer): void {
  // optional string ad_group_id = 1;
  let $ad_group_id = message.ad_group_id;
  if ($ad_group_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $ad_group_id);
  }
}

export function decodeLoadAdRequest(binary: Uint8Array): LoadAdRequest {
  return _decodeLoadAdRequest(wrapByteBuffer(binary));
}

function _decodeLoadAdRequest(bb: ByteBuffer): LoadAdRequest {
  let message: LoadAdRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string ad_group_id = 1;
      case 1: {
        message.ad_group_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LoadAdResponse {
  loaded?: LoadedEvent;
  clicked?: ClickedEvent;
  dismissed?: DismissedEvent;
  failed_to_show?: FailedToShowEvent;
  impression?: ImpressionEvent;
  show?: ShowEvent;
}

export function encodeLoadAdResponse(message: LoadAdResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeLoadAdResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeLoadAdResponse(message: LoadAdResponse, bb: ByteBuffer): void {
  // optional LoadedEvent loaded = 1;
  let $loaded = message.loaded;
  if ($loaded !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodeLoadedEvent($loaded, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ClickedEvent clicked = 2;
  let $clicked = message.clicked;
  if ($clicked !== undefined) {
    writeVarint32(bb, 18);
    let nested = popByteBuffer();
    _encodeClickedEvent($clicked, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional DismissedEvent dismissed = 3;
  let $dismissed = message.dismissed;
  if ($dismissed !== undefined) {
    writeVarint32(bb, 26);
    let nested = popByteBuffer();
    _encodeDismissedEvent($dismissed, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional FailedToShowEvent failed_to_show = 4;
  let $failed_to_show = message.failed_to_show;
  if ($failed_to_show !== undefined) {
    writeVarint32(bb, 34);
    let nested = popByteBuffer();
    _encodeFailedToShowEvent($failed_to_show, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ImpressionEvent impression = 5;
  let $impression = message.impression;
  if ($impression !== undefined) {
    writeVarint32(bb, 42);
    let nested = popByteBuffer();
    _encodeImpressionEvent($impression, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ShowEvent show = 6;
  let $show = message.show;
  if ($show !== undefined) {
    writeVarint32(bb, 50);
    let nested = popByteBuffer();
    _encodeShowEvent($show, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeLoadAdResponse(binary: Uint8Array): LoadAdResponse {
  return _decodeLoadAdResponse(wrapByteBuffer(binary));
}

function _decodeLoadAdResponse(bb: ByteBuffer): LoadAdResponse {
  let message: LoadAdResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional LoadedEvent loaded = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.loaded = _decodeLoadedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ClickedEvent clicked = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.clicked = _decodeClickedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional DismissedEvent dismissed = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        message.dismissed = _decodeDismissedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional FailedToShowEvent failed_to_show = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.failed_to_show = _decodeFailedToShowEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ImpressionEvent impression = 5;
      case 5: {
        let limit = pushTemporaryLength(bb);
        message.impression = _decodeImpressionEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ShowEvent show = 6;
      case 6: {
        let limit = pushTemporaryLength(bb);
        message.show = _decodeShowEvent(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ShowAdRequest {
  ad_group_id?: string;
}

export function encodeShowAdRequest(message: ShowAdRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeShowAdRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeShowAdRequest(message: ShowAdRequest, bb: ByteBuffer): void {
  // optional string ad_group_id = 1;
  let $ad_group_id = message.ad_group_id;
  if ($ad_group_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $ad_group_id);
  }
}

export function decodeShowAdRequest(binary: Uint8Array): ShowAdRequest {
  return _decodeShowAdRequest(wrapByteBuffer(binary));
}

function _decodeShowAdRequest(bb: ByteBuffer): ShowAdRequest {
  let message: ShowAdRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string ad_group_id = 1;
      case 1: {
        message.ad_group_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ShowAdResponse {
  requested?: RequestedEvent;
  clicked?: ClickedEvent;
  dismissed?: DismissedEvent;
  failed_to_show?: FailedToShowEvent;
  impression?: ImpressionEvent;
  show?: ShowEvent;
  user_earned_reward?: UserEarnedRewardEvent;
}

export function encodeShowAdResponse(message: ShowAdResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeShowAdResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeShowAdResponse(message: ShowAdResponse, bb: ByteBuffer): void {
  // optional RequestedEvent requested = 1;
  let $requested = message.requested;
  if ($requested !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodeRequestedEvent($requested, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ClickedEvent clicked = 2;
  let $clicked = message.clicked;
  if ($clicked !== undefined) {
    writeVarint32(bb, 18);
    let nested = popByteBuffer();
    _encodeClickedEvent($clicked, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional DismissedEvent dismissed = 3;
  let $dismissed = message.dismissed;
  if ($dismissed !== undefined) {
    writeVarint32(bb, 26);
    let nested = popByteBuffer();
    _encodeDismissedEvent($dismissed, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional FailedToShowEvent failed_to_show = 4;
  let $failed_to_show = message.failed_to_show;
  if ($failed_to_show !== undefined) {
    writeVarint32(bb, 34);
    let nested = popByteBuffer();
    _encodeFailedToShowEvent($failed_to_show, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ImpressionEvent impression = 5;
  let $impression = message.impression;
  if ($impression !== undefined) {
    writeVarint32(bb, 42);
    let nested = popByteBuffer();
    _encodeImpressionEvent($impression, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ShowEvent show = 6;
  let $show = message.show;
  if ($show !== undefined) {
    writeVarint32(bb, 50);
    let nested = popByteBuffer();
    _encodeShowEvent($show, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UserEarnedRewardEvent user_earned_reward = 7;
  let $user_earned_reward = message.user_earned_reward;
  if ($user_earned_reward !== undefined) {
    writeVarint32(bb, 58);
    let nested = popByteBuffer();
    _encodeUserEarnedRewardEvent($user_earned_reward, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeShowAdResponse(binary: Uint8Array): ShowAdResponse {
  return _decodeShowAdResponse(wrapByteBuffer(binary));
}

function _decodeShowAdResponse(bb: ByteBuffer): ShowAdResponse {
  let message: ShowAdResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional RequestedEvent requested = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.requested = _decodeRequestedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ClickedEvent clicked = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.clicked = _decodeClickedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional DismissedEvent dismissed = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        message.dismissed = _decodeDismissedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional FailedToShowEvent failed_to_show = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.failed_to_show = _decodeFailedToShowEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ImpressionEvent impression = 5;
      case 5: {
        let limit = pushTemporaryLength(bb);
        message.impression = _decodeImpressionEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ShowEvent show = 6;
      case 6: {
        let limit = pushTemporaryLength(bb);
        message.show = _decodeShowEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional UserEarnedRewardEvent user_earned_reward = 7;
      case 7: {
        let limit = pushTemporaryLength(bb);
        message.user_earned_reward = _decodeUserEarnedRewardEvent(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
