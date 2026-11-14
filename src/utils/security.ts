/**
 * Security utilities: FIPS 180-4 SHA-256 password hashing (zero plaintext storage),
 * system account verification, legacy localStorage migration, and monotonic IDs.
 */

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const buf = new Uint8Array(paddedLen);
  buf.set(bytes);
  buf[bytes.length] = 0x80;

  const view = new DataView(buf.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((v) => v.toString(16).padStart(8, '0'))
    .join('');
}

export function hashPassword(email: string, password: string): string {
  const normalizedEmail = (email || '').trim().toLowerCase();
  return sha256Hex(`unipath_v2_salt::${normalizedEmail}::${password}`);
}

export const SYSTEM_RESERVED_EMAILS = new Set([
  'admin@unipath.vn',
  'tuyensinh@pxu.edu.vn',
  'quy@unipath.vn',
  'guest@unipath.vn',
]);

// Precomputed salted SHA-256 digests — zero plaintext credentials in bundle
const SYSTEM_PASSWORD_DIGESTS: Record<string, string> = {
  'quy@unipath.vn': 'a2803424f427952876712e003b02819319980f860ebc39dba4468aeda5bf6073',
  'admin@unipath.vn': '805d05edcb9e40d0368d653133bbc0094c8c2a687bc01825c85e367afdbb5bfb',
  'tuyensinh@pxu.edu.vn': 'e0f911e70d52db27fc973552fba56ae27fe10eee0118f616c7644c13a12be926',
};

export function verifySystemAccountPassword(email: string, password: string): boolean {
  const cleanEmail = (email || '').trim().toLowerCase();
  const expected = SYSTEM_PASSWORD_DIGESTS[cleanEmail];
  if (!expected) return false;
  return hashPassword(cleanEmail, password) === expected;
}

export interface StoredUserAccount {
  email: string;
  name: string;
  passHash: string;
  createdAtISO?: string;
}

export function migrateStoredAccounts(raw: unknown): {
  accounts: StoredUserAccount[];
  migrated: boolean;
} {
  if (!Array.isArray(raw)) return { accounts: [], migrated: false };
  let migrated = false;
  const seen = new Set<string>();
  const accounts: StoredUserAccount[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const email = typeof rec.email === 'string' ? rec.email.trim().toLowerCase() : '';
    const name = typeof rec.name === 'string' ? rec.name.trim() : '';
    if (!email || !name || SYSTEM_RESERVED_EMAILS.has(email) || seen.has(email)) continue;

    let passHash = typeof rec.passHash === 'string' ? rec.passHash : '';
    if (!passHash && typeof rec.pass === 'string' && rec.pass.length > 0) {
      passHash = hashPassword(email, rec.pass);
      migrated = true;
    } else if ('pass' in rec) {
      migrated = true;
    }

    if (!passHash) continue;
    seen.add(email);
    accounts.push({
      email,
      name,
      passHash,
      createdAtISO:
        typeof rec.createdAtISO === 'string' ? rec.createdAtISO : new Date().toISOString(),
    });
  }

  return { accounts, migrated };
}

let monotonicSeq = 0;

export function nextUniqueId(prefix = 'id'): string {
  monotonicSeq = (monotonicSeq + 1) % 1_000_000;
  return `${prefix}-${Date.now()}-${String(monotonicSeq).padStart(4, '0')}`;
}
