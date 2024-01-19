import { LimitExceededException } from '@aws-sdk/client-dynamodb';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Meal } from '../../database/entities';
import ServerError from '../../errors/ServerError';
import getJobStatus from './job-status-dynamo';

describe('job-status-dynamo', () => {
  vi.mock('../../database/entities', () => ({ Meal: { get: vi.fn() } }));
  const mealGetSpy = vi.mocked(Meal.get);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Given a meal identifier', () => {
    describe('when the Meal entity rejects with an Error', () => {
      it('rejects with a ServerError with a message containing the error name nad the error message', async () => {
        mealGetSpy.mockRejectedValue(
          new LimitExceededException({
            message: 'Ben says to back off',
            $metadata: {},
          })
        );

        await getJobStatus('43cde2d4-b9b6-400c-847a-66d314baf588').catch(
          (error) => {
            expect(error).toBeInstanceOf(ServerError);
            expect(error.message).toEqual(
              'LimitExceededException: Ben says to back off'
            );
          }
        );
        expect.assertions(2);
      });
    });
    describe('when the Meal entity rejects with a value that is not an Error', () => {
      it('should throw a ServerError with the message "Unknown error"', async () => {
        mealGetSpy.mockRejectedValue('Failed badly');

        await getJobStatus('43cde2d4-b9b6-400c-847a-66d314baf588').catch(
          (error) => {
            expect(error).toBeInstanceOf(ServerError);
            expect(error.message).toEqual('UnknownError');
          }
        );
        expect.assertions(2);
      });
    });
  });
});
