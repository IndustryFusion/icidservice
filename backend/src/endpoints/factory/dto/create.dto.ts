//
// Copyright (c) 2024 IB Systems GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

export interface CreateFactoryDto {
    dataspace_code: string;
    region_code: string;
    object_type_code: string;
    object_sub_type_code: string;
    /** The company that owns the factory. */
    owner_company_ifric_id: string;
    /**
     * A stable handle for this factory, unique within the owning company.
     * The identifier is derived from it, so it must never be a value a user
     * can edit later — a name would change the factory's identity on rename.
     */
    factory_key: string;
}
