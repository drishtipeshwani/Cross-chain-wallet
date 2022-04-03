export default class NetworkChain{
    constructor(chainName,networkName, RPC, chainID, currencySymbol,blockExplorerURL)
    {
    this.chainName = chainName
    this.networkName=networkName;
    this.RPC=RPC;
    this.chainID=chainID;
    this.currencySymbol=currencySymbol;
    this.blockExplorerURL=blockExplorerURL;
    }
}