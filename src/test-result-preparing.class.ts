import { IUnitTestResult } from './interfaces/unit-test-result.type';
import { TrxParser } from './trx-parser.class';

export class TestResultPreparing {
  static async prepareUnitTestResult(trxFiles: string[]): Promise<IUnitTestResult[]> {
    let unitTestResults: IUnitTestResult[] = [];

    for (const trxFilePath of trxFiles) {
      const trxTests = await TrxParser.parseTRXFileAsync(trxFilePath);
      unitTestResults = unitTestResults.concat(trxTests);
    }

    return unitTestResults;
  }
}
