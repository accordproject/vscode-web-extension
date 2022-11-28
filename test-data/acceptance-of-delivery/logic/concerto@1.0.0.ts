/* eslint-disable @typescript-eslint/no-empty-interface */
// Generated code for namespace: concerto@1.0.0

// imports

// Warning: Beware of circular dependencies when modifying these imports
import type {
	IInspectionStatus
} from './org.accordproject.acceptanceofdelivery@1.0.0';
import type {
	IPostalAddress
} from './org.accordproject.address@0.2.0';
import type {
	IGeoCoordinates,
	IPlace,
	ICountry,
	ICountryCodeISOAlpha2
} from './org.accordproject.geo@0.2.0';

// Warning: Beware of circular dependencies when modifying these imports
import type {
	IState
} from './org.accordproject.runtime@0.2.0';
import type {
	IContract,
	IClause
} from './org.accordproject.contract@0.2.0';

// Warning: Beware of circular dependencies when modifying these imports
import type {
	IOrganization
} from './org.accordproject.organization@0.2.0';

// Warning: Beware of circular dependencies when modifying these imports
import type {
	IRequest,
	IResponse
} from './org.accordproject.runtime@0.2.0';

// Warning: Beware of circular dependencies when modifying these imports
import type {
	IObligation
} from './org.accordproject.runtime@0.2.0';

// interfaces
export interface IConcept {
   $class: string;
}

export type ConceptUnion = IInspectionStatus | 
IPostalAddress | 
IGeoCoordinates | 
IPlace | 
ICountry | 
ICountryCodeISOAlpha2;

export interface IAsset extends IConcept {
   $identifier: string;
}

export type AssetUnion = IState | 
IContract | 
IClause;

export interface IParticipant extends IConcept {
   $identifier: string;
}

export type ParticipantUnion = IOrganization;

export interface ITransaction extends IConcept {
   $timestamp: Date;
}

export type TransactionUnion = IRequest | 
IResponse;

export interface IEvent extends IConcept {
   $timestamp: Date;
}

export type EventUnion = IObligation;

