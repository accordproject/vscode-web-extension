import { readFileSync } from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';
import { ClassDeclaration, MapDeclaration, ModelManager } from '@accordproject/concerto-core';

describe('ModelManager defaults', () => {
    it('should support map declarations and imports with default options', () => {
        const modelManager = new ModelManager();

        const hrModel = readFileSync(resolve(process.cwd(), '../test-data/hr/hr.cto'), 'utf8');
        const bigOrgModel = readFileSync(resolve(process.cwd(), '../test-data/bigorg.cto'), 'utf8');

        modelManager.addCTOModel(hrModel, 'hr.cto');
        modelManager.addCTOModel(bigOrgModel, 'bigorg.cto');

        const rolodex = modelManager.getType('org.acme.hr@1.0.0.Rolodex') as MapDeclaration;
        expect(rolodex.isMapDeclaration()).to.equal(true);
        expect(rolodex.getKey().getType()).to.equal('String');

        const bigCompany = modelManager.getType('bigorg@1.0.0.BigCompany') as ClassDeclaration;
        expect(bigCompany.getSuperType()).to.equal('org.acme.hr@1.0.0.Company');
    });
});
