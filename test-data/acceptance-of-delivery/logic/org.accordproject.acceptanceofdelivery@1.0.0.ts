/* eslint-disable @typescript-eslint/no-empty-interface */
// Generated code for namespace: org.accordproject.acceptanceofdelivery@1.0.0

// imports
import {IClause} from './org.accordproject.contract@0.2.0';
import {IRequest,IResponse} from './org.accordproject.runtime@0.2.0';
import {IOrganization} from './org.accordproject.organization@0.2.0';

// interfaces
export interface IInspectDeliverable extends IRequest {
   deliverableReceivedAt: Date;
   inspectionPassed: boolean;
}

export enum InspectionStatus {
   PASSED_TESTING = 'PASSED_TESTING',
   FAILED_TESTING = 'FAILED_TESTING',
   OUTSIDE_INSPECTION_PERIOD = 'OUTSIDE_INSPECTION_PERIOD',
}

export interface IInspectionResponse extends IResponse {
   status: InspectionStatus;
   shipper: IOrganization;
   receiver: IOrganization;
}

export interface IAcceptanceOfDeliveryClause extends IClause {
   shipper: IOrganization;
   receiver: IOrganization;
   deliverable: string;
   businessDays: number;
   attachment: string;
}

