const expect = require('expect');

const {anonymisePesel} = require('../config/hiddenConfig');

describe('Module hiddenConfig', () => {
    it('should change pesel', () => {

        expect(anonymisePesel('88888800017')).toBe('88888899917a');
        expect(anonymisePesel('88888800117')).toBe('88888899817a');
        expect(anonymisePesel('88888899947')).toBe('88888800047a');
        expect(anonymisePesel('88888800007')).toBe('88888899907a');
    });
});