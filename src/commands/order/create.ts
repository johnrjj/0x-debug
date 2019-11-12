import { BigNumber } from '@0x/utils';
import { Command, flags as oclifFlags } from '@oclif/command';

import { DEFAULT_READALE_FLAGS, DEFAULT_RENDER_FLAGS, DEFAULT_WRITEABLE_FLAGS } from '../../global_flags';
import { utils } from '../../utils';
import { assetDataUtils, Order, generatePseudoRandomSalt, signatureUtils } from '@0x/order-utils';
import { cli } from 'cli-ux';

export class Create extends Command {
    public static description = 'Creates a signed order';

    public static examples = [`$ 0x-debug order:create`];

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
        const { provider, selectedAddress, contractAddresses, chainId } = await utils.getWriteableContextAsync(flags);
        const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
        const makerAssetData = assetDataUtils.encodeERC20AssetData(contractAddresses.etherToken);
        const takerAssetData = assetDataUtils.encodeERC20AssetData(contractAddresses.zrxToken);
        const order: Order = {
            chainId,
            exchangeAddress: contractAddresses.exchange,
            makerAddress: selectedAddress,
            takerAddress: NULL_ADDRESS,
            senderAddress: NULL_ADDRESS,
            feeRecipientAddress: NULL_ADDRESS,
            expirationTimeSeconds: new BigNumber(1586914027),
            salt: generatePseudoRandomSalt(),
            makerAssetAmount: new BigNumber(100),
            takerAssetAmount: new BigNumber(10000),
            makerAssetData,
            takerAssetData,
            makerFeeAssetData: '0x',
            takerFeeAssetData: '0x',
            makerFee: new BigNumber(0),
            takerFee: new BigNumber(0),
        };
        console.log(selectedAddress);
        const signedOrder = await signatureUtils.ecSignOrderAsync(provider, order, selectedAddress);
        cli.styledJSON(signedOrder);
        utils.stopProvider(provider);
    }
}
