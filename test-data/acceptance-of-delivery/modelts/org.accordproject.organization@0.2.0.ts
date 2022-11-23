/* eslint-disable @typescript-eslint/no-empty-interface */
// Generated code for namespace: org.accordproject.organization@0.2.0

// imports
import {IPlace} from './org.accordproject.geo@0.2.0';
import {IParticipant} from './concerto@1.0.0';

// interfaces
export interface IOrganization extends IParticipant {
   identifier: string;
   name?: string;
   description?: string;
   duns?: string;
   place?: IPlace;
}

