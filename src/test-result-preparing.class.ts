import { IUnitTestResult } from './interfaces/unit-test-result.type';
import { TrxParser } from './trx-parser.class';

export class TestResultPreparing {
  static async prepareUnitTestResult(trxFiles: string[]): Promise<IUnitTestResult[]> {
    let unitTestResults: IUnitTestResult[] = [];

    for (const trxFilePath of trxFiles) {
      const trxTests = await TrxParser.parseTRXFileAsync(trxFilePath);
      unitTestResults = unitTestResults.concat(trxTests);
    }

    unitTestResults = TestResultPreparing.sortAndFilterUniqueTests(unitTestResults);

    return unitTestResults;
  }

  private static sortAndFilterUniqueTests(tests: IUnitTestResult[]): IUnitTestResult[] {
    const testMap = new Map<string, IUnitTestResult>();

    tests.sort((a, b) => {
      if (a.testDomain < b.testDomain) return -1;
      if (a.testDomain > b.testDomain) return 1;

      if (a.featureName < b.featureName) return -1;
      if (a.featureName > b.featureName) return 1;

      if (a.testFullName < b.testFullName) return -1;
      if (a.testFullName > b.testFullName) return 1;

      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    for (const test of tests) {
      const key = `${test.testDomain}-${test.featureName}-${test.testFullName}`;
      const existingTest = testMap.get(key);

      if (!existingTest) {
        testMap.set(key, test);
      }
      if (existingTest && test.endTime > existingTest.endTime) {
        test.previousRun = existingTest;
        test.rerun = true;
        testMap.set(key, test);
      }
    }

    return Array.from(testMap.values());
  }
}
