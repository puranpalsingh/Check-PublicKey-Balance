import axios from "axios";
const ethrpc = import.meta.env.VITE_ETHEREUM_RPC;
const solrpc = import.meta.env.VITE_SOLANA_RPC;
async function getethBalance(address:string) {
    try {
        const {data} = await axios.post(ethrpc, {
            "jsonrpc" : "2.0",
            "method" : "eth_getBalance",
            "params" : [address,"latest"]
        });

        const balanceWei = BigInt(data.result);
        const balanceETH = Number(balanceWei)/1e18;

        return balanceETH;
    } catch(err) {
        console.error('Error fetching balance :',err);
        throw err;
    }
}

async function getTransactionCount(address : string) {
    try {
        const {data} = await axios.post(ethrpc, {
            "jsonrpc" : "2.0",
            "method" : "eth_getTransactionCount",
            "params" : [address, "latest"]
        });
        return parseInt(data.result, 16);
    }catch(err) {
        console.error('Error fetching transaction count:', err);
        throw err;
    }
}

async function isContract(address : string) {
    try {
        const {data} = await axios.post(ethrpc, {
            "jsonrpc" : "2.0",
            "method" : "eth_getCode",
            "params" : [address, "latest"]
        });
        
        return data.result !== "0x" && data.result !== "0x0";
    }catch(err) {
        console.error('Error checking if contract:', err);
        throw err;
    }
}

async function getBlockNumber() {
    try {
        const {data} = await axios.post(ethrpc, {
            "jsonrpc" : "2.0",
            "method" : "eth_blockNumber",
            "params" : []
        });
        return parseInt(data.result, 16);
    }catch(err) {
        console.error('Error fetching block number:', err);
        throw err;
    }
}

export async function getSolBalance(address : string) {
    try {
        const {data} = await axios.post(solrpc, {
            "jsonrpc" : "2.0",
            "method" : "getBalance",
            "params" : [address]
        });

       
        const lamports: number = data.result.value;
        const sol = lamports / 1_000_000_000;

        return sol;

    } catch(err) {
        console.error('Error fetching balance :',err);
        throw err;
    }
}


export async function getSolTransactionCount(address: string) {
    try {
        const { data } = await axios.post(solrpc, {
            jsonrpc: "2.0",
            id: 1,
            method: "getSignaturesForAddress",
            params: [address, { limit: 1000 }]
        });
        return data.result?.length || 0;
    } catch(err) {
        console.error('Error fetching Solana transaction count:', err);
        throw err;
    } 
}

export async function getSolisContract(address : string) {
    try {
        const { data } = await axios.post(solrpc, {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [address, { encoding: "jsonParsed" }]
        });
        return data.result.value?.executable === true;
    } catch(err) {
        console.error('Error checking if Solana contract:', err);
        throw err;
    } 
}


export async function getSolLatestBlock() {
    try {
        const {data} = await axios.post(solrpc, {
            "jsonrpc" : "2.0",
            "method" : "getSlot",
            "params" : []
        });
        return data.result as number;
    }catch(err) {
        console.error('Error fetching Solana slot:', err);
        throw err;
    }
}


export { getethBalance, getTransactionCount, isContract, getBlockNumber };