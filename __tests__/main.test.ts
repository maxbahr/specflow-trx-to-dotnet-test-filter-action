/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core';
import * as main from '../src/main';

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>;
let getInputMock: jest.SpiedFunction<typeof core.getInput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    errorMock = jest.spyOn(core, 'error').mockImplementation();
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
  });

  it('should generate test filter', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'trxDirPath':
          return '__tests__/trx';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    // Verify that all of the core library functions were called correctly
    expect(errorMock).not.toHaveBeenCalled();
  });

  it.skip('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'trxDirPath':
          return 'Invalid folder path';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      "'Invalid folder path' is not valid folder path. Should include path separator"
    );
    expect(errorMock).not.toHaveBeenCalled();
  });
});
