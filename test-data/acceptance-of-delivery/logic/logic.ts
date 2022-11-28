/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InspectionStatus, IInspectDeliverable, IInspectionResponse, IAcceptanceOfDeliveryClause } from './org.accordproject.acceptanceofdelivery@1.0.0';
import { TemporalUnit } from './org.accordproject.time@0.3.0';

import { Contract} from './contract';
import { addDuration, isAfter, isBefore } from './stdlib';

class AcceptanceOfDelivery extends Contract<IAcceptanceOfDeliveryClause> {

	acceptanceofdelivery(request: IInspectDeliverable): IInspectionResponse {

		const received = request.deliverableReceivedAt;
		if (!isBefore(received, this.now())) {
			throw new Error("Transaction time is before the deliverable date.");
		}

		const status = isAfter(this.now(), addDuration(received, { $class: '', amount: this.contract.businessDays, unit: TemporalUnit.days }))
			? InspectionStatus.OUTSIDE_INSPECTION_PERIOD : request.inspectionPassed ? InspectionStatus.PASSED_TESTING : InspectionStatus.FAILED_TESTING;

		return {
			$class: '',
			$timestamp: new Date(),
			status: status,
			shipper: this.contract.shipper,   // This should be a relationship
			receiver: this.contract.receiver  // This should be a relationship
		};
	}
}

export default AcceptanceOfDelivery;