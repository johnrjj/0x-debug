import { ContractWrappers } from '@0x/contract-wrappers';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Provider } from 'ethereum-protocol';
import _ = require('lodash');

import { PrintUtils } from '../print_utils';
import { ExplainedTransactionOutput } from '../types';

export const explainTransactionPrinter = {
    printConsole(output: ExplainedTransactionOutput, provider: Provider, networkId: number): void {
        const contractWrappers = new ContractWrappers(provider, { networkId });
        const web3Wrapper = new Web3Wrapper(provider);

        const printUtils = new PrintUtils(web3Wrapper, contractWrappers, output.accounts, output.tokens);
        const additionalInfo = output.revertReason ? [['Reason', output.revertReason]] : [];
        printUtils.printAccounts();
        printUtils.printTransaction(
            output.functionName,
            output.tx,
            output.txStatus,
            output.gasUsed,
            output.logs,
            additionalInfo,
        );
        _.forEach(output.orders, order => printUtils.printOrder(order));
    },
};