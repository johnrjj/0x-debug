import { BigNumber } from '@0x/utils';
import { Command } from '@oclif/command';

import {
    DEFAULT_READALE_FLAGS,
    DEFAULT_RENDER_FLAGS,
    DEFAULT_WRITEABLE_FLAGS,
} from '../../../global_flags';
import { basicReceiptPrinter } from '../../../printers/basic_receipt_printer';
import { prompt } from '../../../prompt';
import { utils } from '../../../utils';

export class Create extends Command {
    public static description = 'Creates a Staking Pool';

    public static examples = [`$ 0x-debug staking:pool:create`];

    public static flags = {
        ...DEFAULT_RENDER_FLAGS,
        ...DEFAULT_READALE_FLAGS,
        ...DEFAULT_WRITEABLE_FLAGS,
    };
    public static args = [];
    public static strict = false;

    // tslint:disable-next-line:async-suffix
    public async run(): Promise<void> {
        const { flags, argv } = this.parse(Create);
        const {
            contractWrappers,
            provider,
            selectedAddress,
        } = await utils.getWriteableContextAsync(flags);
        const stakingContract = contractWrappers.staking;
        const { input } = await prompt.promptForInputAsync(
            'Input Operator Share (in ppm)',
        );
        const result = await utils.awaitTransactionWithSpinnerAsync(
            'Create Staking Pool',
            () =>
                stakingContract
                    .createStakingPool(new BigNumber(input), true)
                    .awaitTransactionSuccessAsync({
                        from: selectedAddress,
                    }),
        );
        basicReceiptPrinter.printConsole(result);
        utils.stopProvider(provider);
    }
}
