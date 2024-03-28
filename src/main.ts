import * as core from '@actions/core';
import { FileUtils } from './fs-utils.class';
import { IUnitTestResult } from './interfaces/unit-test-result.type';
import { TestResultPreparing } from './test-result-preparing.class';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    //Inputs
    const trxDirPath = core.getInput('trxDirPath') || '.';
    const testOutcome = core.getInput('testOutcome') || 'Failed';

    const trxFiles = await FileUtils.findTrxFilesAsync(trxDirPath);
    const unitTestResults: IUnitTestResult[] = await TestResultPreparing.prepareUnitTestResult(trxFiles);
    const filteredUnitTestsResilts = unitTestResults.filter(ut => ut.outcome === testOutcome);
    const testFilter = prepareDotnetFilter(filteredUnitTestsResilts);
    console.log(`There are ${filteredUnitTestsResilts.length} tests in status ${testOutcome}`);
    for (const filter of testFilter) {
      console.log(filter);
    }

    core.setOutput('testFilter', testFilter.join(' | '));
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

function prepareDotnetFilter(unitTestResults: IUnitTestResult[]): string[] {
  const testsNormalized = [];
  for (const ut of unitTestResults) {
    testsNormalized.push(`(${ut.testMethodPath} & DisplayName=${normalizeTestName(ut.testFullName)})`);
  }

  return testsNormalized;
}

function normalizeTestName(testname: string): string {
  return testname.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('"', '%22');
}
