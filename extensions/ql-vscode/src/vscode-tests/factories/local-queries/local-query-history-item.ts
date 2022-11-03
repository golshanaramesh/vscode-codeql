import { faker } from '@faker-js/faker';
import {
  InitialQueryInfo,
  LocalQueryInfo,
} from '../../../query-results';
import { QueryEvaluationInfo, QueryWithResults } from '../../../run-queries-shared';
import { CancellationTokenSource } from 'vscode';
import { QueryResultType } from '../../../pure/legacy-messages';
import { QueryMetadata } from '../../../pure/interface-types';

export function createMockLocalQueryInfo({
  startTime = new Date(),
  resultCount = 0,
  userSpecifiedLabel = undefined,
  failureReason = undefined,
  dbName = 'db-name',
  hasMetadata = false,
  queryWithResults = undefined,
}: {
  startTime?: Date,
  resultCount?: number,
  userSpecifiedLabel?: string,
  failureReason?: string,
  dbName?: string,
  hasMetadata?: boolean,
  queryWithResults?: QueryWithResults | undefined,
}): LocalQueryInfo {
  const cancellationToken = {
    dispose: () => { /**/ },
  } as CancellationTokenSource;

  const initialQueryInfo = {
    queryText: 'select 1',
    isQuickQuery: false,
    isQuickEval: false,
    queryName: 'query-name',
    queryPath: 'query-file.ql',
    databaseInfo: {
      databaseUri: 'databaseUri',
      name: dbName,
    },
    start: startTime,
    id: faker.datatype.number().toString(),
    userSpecifiedLabel
  } as InitialQueryInfo;

  const localQuery = new LocalQueryInfo(initialQueryInfo, cancellationToken);

  localQuery.failureReason = failureReason;

  if (queryWithResults) {
    localQuery.completeThisQuery(queryWithResults);
    localQuery.completedQuery?.setResultCount(1);
  } else if (resultCount > 0) {
    const queryWithResults = createMockQueryWithResults({ hasMetadata });
    localQuery.completeThisQuery(queryWithResults);
    localQuery.completedQuery?.setResultCount(resultCount);
  }

  return localQuery;
}

export function createMockQueryWithResults({
  sandbox = undefined,
  didRunSuccessfully = true,
  hasInterpretedResults = true,
  hasMetadata = undefined
}: {
  sandbox?: sinon.SinonSandbox,
  didRunSuccessfully?: boolean,
  hasInterpretedResults?: boolean,
  hasMetadata?: boolean,
}): QueryWithResults {
  const dispose = sandbox ? sandbox.spy() : () => { /**/ };
  const deleteQuery = sandbox ? sandbox.stub() : () => { /**/ };
  const metadata = hasMetadata ? { name: 'query-name' } as QueryMetadata : undefined;

  return {
    query: {
      hasInterpretedResults: () => Promise.resolve(hasInterpretedResults),
      deleteQuery,
      metadata,
    } as unknown as QueryEvaluationInfo,
    successful: didRunSuccessfully,
    dispose,
    result: {
      evaluationTime: 1,
      queryId: 0,
      runId: 0,
      resultType: QueryResultType.SUCCESS,
    }
  };
}
