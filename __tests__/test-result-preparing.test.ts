import { TestResultPreparing } from '../src/test-result-preparing.class';
import { TrxParser } from '../src/trx-parser.class';
import { IUnitTestResult } from '../src/interfaces/unit-test-result.type';
import { mockUnitTestResult } from './mocks';

jest.mock('../src/trx-parser.class');

describe('TestResultPreparing', () => {
  describe('prepareUnitTestResult', () => {
    test('should prepare unit test results from TRX files', async () => {
      const trxFiles = ['test1.trx'];
      const mockedUnitTestResults: IUnitTestResult[] = [mockUnitTestResult];

      (TrxParser.parseTRXFileAsync as jest.Mock).mockResolvedValueOnce(mockedUnitTestResults);

      const unitTestResults = await TestResultPreparing.prepareUnitTestResult(trxFiles);

      expect(unitTestResults).toEqual(mockedUnitTestResults);
      expect(TrxParser.parseTRXFileAsync).toHaveBeenCalledWith('test1.trx');
    });
  });
});
