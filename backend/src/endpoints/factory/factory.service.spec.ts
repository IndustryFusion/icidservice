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

import { HttpException } from '@nestjs/common';
import { v5 as uuidv5 } from 'uuid';
import { FactoryService } from './factory.service';
import { CreateFactoryDto } from './dto/create.dto';

/**
 * The first test in this service that actually exercises identifier
 * generation — the other endpoints have only "should be defined" stubs.
 *
 * The models are hand-rolled fakes rather than Nest testing-module providers,
 * because the service only ever uses `find`, `findById` and `save`.
 */

const NAMESPACE = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';
const COMPANY = 'urn:ifric:ifx-eur-com-nap-42ced491-b35d-41f7-9949-fcbb5fa4dcd9';

function build(options: { existingFactories?: any[] } = {}) {
  const saved: any[] = [];
  const urns: any[] = [];

  const urnModel: any = function (this: any, doc: any) {
    Object.assign(this, doc);
    this.save = async () => {
      urns.push(doc);
      return doc;
    };
  };
  urnModel.find = async ({ urn }: any) =>
    urns.filter((u) => u.urn === urn).map((u, i) => ({ ...u, id: `urn-${i}` }));
  urnModel.deleteOne = async () => undefined;

  const factoryModel: any = function (this: any, doc: any) {
    Object.assign(this, doc);
    this.save = async () => {
      saved.push(doc);
      return doc;
    };
  };
  factoryModel.find = async () => options.existingFactories ?? [];
  factoryModel.deleteOne = async () => undefined;

  const service = new FactoryService(
    factoryModel,
    urnModel,
    { find: async () => [{ object_type_id: 'loc-id' }] } as any,
    { findById: async () => ({ object_type_code: 'LOC' }) } as any,
    { find: async () => [{ region_code: 'EUR' }] } as any,
  );
  // The namespace is read from the environment when the service is built.
  (service as any).ifricId = NAMESPACE;
  return { service, saved, urns };
}

const dto = (overrides: Partial<CreateFactoryDto> = {}): CreateFactoryDto => ({
  dataspace_code: 'IFX',
  region_code: 'EU',
  object_type_code: 'LOC',
  object_sub_type_code: 'FAC',
  owner_company_ifric_id: COMPANY,
  factory_key: '7b1f0d5a-2c64-4a1e-9f3b-8f3d2a5c6e71',
  ...overrides,
});

describe('FactoryService.create', () => {
  it('mints an identifier in the agreed URN grammar', async () => {
    const { service } = build();
    const result: any = await service.create(dto());

    expect(result.status).toBe(201);
    // Region is prefix-expanded from EU to the seeded EUR, and every code
    // segment is lower-cased — the same shape company and asset ids use.
    expect(result.urn_id).toMatch(
      /^urn:ifric:ifx-eur-loc-fac-[0-9a-f-]{36}$/,
    );
  });

  it('derives the identifier from the company and the factory key', async () => {
    const { service } = build();
    const result: any = await service.create(dto());

    const expected = uuidv5(
      `${COMPANY}-7b1f0d5a-2c64-4a1e-9f3b-8f3d2a5c6e71`,
      NAMESPACE,
    );
    expect(result.urn_id.endsWith(expected)).toBe(true);
  });

  it('is deterministic: the same factory always gets the same id', async () => {
    const first: any = await build().service.create(dto());
    const second: any = await build().service.create(dto());
    expect(second.urn_id).toBe(first.urn_id);
  });

  it('gives two factories of the same company different ids', async () => {
    const a: any = await build().service.create(dto({ factory_key: 'key-a' }));
    const b: any = await build().service.create(dto({ factory_key: 'key-b' }));
    expect(a.urn_id).not.toBe(b.urn_id);
  });

  it('gives two companies with the same factory key different ids', async () => {
    const a: any = await build().service.create(dto());
    const b: any = await build().service.create(
      dto({ owner_company_ifric_id: 'urn:ifric:ifx-eur-com-nap-other' }),
    );
    expect(a.urn_id).not.toBe(b.urn_id);
  });

  it('stores the natural key alongside the urn', async () => {
    const { service, saved } = build();
    await service.create(dto());

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      owner_company_ifric_id: COMPANY,
      factory_key: '7b1f0d5a-2c64-4a1e-9f3b-8f3d2a5c6e71',
    });
  });

  it('refuses a factory this company already registered', async () => {
    const { service } = build({ existingFactories: [{ factory_key: 'k' }] });
    await expect(service.create(dto())).rejects.toThrow(HttpException);
  });

  it('refuses a request with no owning company', async () => {
    const { service } = build();
    await expect(
      service.create(dto({ owner_company_ifric_id: '' })),
    ).rejects.toThrow(HttpException);
  });

  it('refuses a request with no factory key', async () => {
    const { service } = build();
    await expect(service.create(dto({ factory_key: '' }))).rejects.toThrow(
      HttpException,
    );
  });
});
