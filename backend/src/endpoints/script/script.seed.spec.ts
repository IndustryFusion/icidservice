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

import { ScriptService } from './script.service';

/**
 * Seeding at startup, rather than by remembering to POST /script.
 *
 * `create()` itself is covered by its own behaviour — these tests are about
 * when it runs and, more importantly, what happens when it cannot.
 */
describe('ScriptService seeding at startup', () => {
  let service: ScriptService;
  let create: jest.SpyInstance;

  beforeEach(() => {
    delete process.env.ICID_AUTO_SEED;
    // The eleven injected Mongoose models are irrelevant here: create() is
    // stubbed, so nothing touches them.
    const models = Array(11).fill({}) as unknown as ConstructorParameters<
      typeof ScriptService
    >;
    service = new ScriptService(...models);
    create = jest
      .spyOn(service, 'create')
      .mockResolvedValue({ success: true, status: 201, message: 'ok' } as any);
  });

  afterEach(() => {
    delete process.env.ICID_AUTO_SEED;
    jest.restoreAllMocks();
  });

  it('seeds when the service starts', async () => {
    await service.onModuleInit();
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('can be switched off', async () => {
    process.env.ICID_AUTO_SEED = 'false';
    await service.onModuleInit();
    expect(create).not.toHaveBeenCalled();
  });

  it('starts the service even when seeding fails', async () => {
    // A database that is briefly unreachable at boot must not take the whole
    // service down: the next restart seeds it, and POST /script still works.
    create.mockRejectedValue(new Error('connection refused'));
    await expect(service.onModuleInit()).resolves.toBeUndefined();
  });

  it('runs again on the next start, so newly added codes get added', async () => {
    // create() inserts only what is missing, which is what makes repeating it
    // safe — and what makes a new object sub-type appear without a manual step.
    await service.onModuleInit();
    await service.onModuleInit();
    expect(create).toHaveBeenCalledTimes(2);
  });
});
