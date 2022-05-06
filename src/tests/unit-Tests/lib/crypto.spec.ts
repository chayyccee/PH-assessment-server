import 'jest';
import { encrypt, decrypt } from '../../../lib/crypto';
import { Environments } from '../../../environments/environ.constants';
import Environment from '../../../environments/environ';

describe('Crypto Lib (Encryption/Decryption)', () => {
    let instance: Environment;
    beforeEach(() => {
        instance = new Environment(Environments.TEST);
    });

    it('Testing for text', () => {
        const data = 'This data is to be encrypted';
        const encrypted = encrypt(data, instance.secretKey);
        const decrypted = decrypt(encrypted, instance.secretKey);
        expect(decrypted).toEqual(data);
    });

    it('Testing for array', () => {
        const data = ['this', 'is', 'array'];
        const encrypted = encrypt(JSON.stringify(data), instance.secretKey);
        const decrypted = decrypt(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });

    it('Testing for object', () => {
        const data = {
        key1: 'value1',
        key2: 'value2',
        };
        const encrypted = encrypt(JSON.stringify(data), instance.secretKey);
        const decrypted = decrypt(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });
});
