import { SecretNetworkClient } from "secretjs";
export async function getPermit(
  address: string,
  contract_address: string,
  nft_address: string
) {
  let data = localStorage.getItem(
    `shill-stake-permit-${contract_address}-${address}`
  );
  if (data) {
    return JSON.parse(data);
  }

  const permitName = "shill.stake";
  const allowedTokens = [contract_address];
  if (nft_address) {
    allowedTokens.push(nft_address);
  }
  const permissions = ["owner", "balance"];

  if (!window.keplr) throw "Keplr not found";

  window.keplr.enable(import.meta.env.VITE_APP_CHAIN_ID);

  const { signature } = await window.keplr.signAmino(
    import.meta.env.VITE_APP_CHAIN_ID,
    address,
    {
      chain_id: import.meta.env.VITE_APP_CHAIN_ID,
      account_number: "0", // Must be 0
      sequence: "0", // Must be 0
      fee: {
        amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
        gas: "1", // Must be 1
      },
      msgs: [
        {
          type: "query_permit", // Must be "query_permit"
          value: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            permissions: permissions,
          },
        },
      ],
      memo: "", // Must be empty
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
    }
  );
  localStorage.setItem(
    `shill-stake-permit-${contract_address}-${address}`,
    JSON.stringify(signature)
  );
  return signature;
}

export async function resetPermit(
  address: string,
  contract_address: string,
  nft_address: string
) {
  let data = localStorage.getItem(
    `shill-stake-permit-${contract_address}-${address}`
  );
  if (data) {
    localStorage.removeItem(
      `shill-stake-permit-${contract_address}-${address}`
    );
  }

  const permitName = "shill.stake";
  const allowedTokens = [contract_address];
  if (nft_address) {
    allowedTokens.push(nft_address);
  }
  const permissions = ["owner", "balance"];

  if (!window.keplr) throw "Keplr not found";

  window.keplr.enable(import.meta.env.VITE_APP_CHAIN_ID);

  const { signature } = await window.keplr.signAmino(
    import.meta.env.VITE_APP_CHAIN_ID,
    address,
    {
      chain_id: import.meta.env.VITE_APP_CHAIN_ID,
      account_number: "0", // Must be 0
      sequence: "0", // Must be 0
      fee: {
        amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
        gas: "1", // Must be 1
      },
      msgs: [
        {
          type: "query_permit", // Must be "query_permit"
          value: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            permissions: permissions,
          },
        },
      ],
      memo: "", // Must be empty
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
    }
  );
  localStorage.setItem(
    `shill-stake-permit-${contract_address}-${address}`,
    JSON.stringify(signature)
  );
  return signature;
}

export async function getWalletClient() {
  if (!window.keplr) throw "Keplr not found";
  const chainID = import.meta.env.VITE_APP_CHAIN_ID;
  window.keplr.enable(chainID);

  const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(chainID);
  const [{ address: myAddress }] = await offlineSigner.getAccounts();
  const enigmaUtils = window.keplr.getEnigmaUtils(chainID);

  const client = new SecretNetworkClient({
    url: import.meta.env.VITE_APP_GRPC_URL,
    chainId: chainID,
    wallet: offlineSigner,
    walletAddress: myAddress,
    encryptionUtils: enigmaUtils,
  });

  return {
    client: client,
    address: myAddress,
  };
}

export async function setKeplrViewingKey() {
  if (!window.keplr) throw "Keplr not found";
  await window.keplr.suggestToken(
    import.meta.env.VITE_APP_CHAIN_ID,
    import.meta.env.VITE_APP_SHILL_CONTRACT_ADDRESS
  );
}

export async function getKeplrViewingKey(): Promise<string | null> {
  if (!window.keplr) throw "Keplr not found";

  try {
    return await window.keplr.getSecret20ViewingKey(
      import.meta.env.VITE_APP_CHAIN_ID,
      import.meta.env.VITE_APP_SHILL_CONTRACT_ADDRESS
    );
  } catch (e) {
    return null;
  }
}

export async function setKeplrViewingKeysScrt() {
  if (!window.keplr) throw "Keplr not found";
  await window.keplr.suggestToken(
    import.meta.env.VITE_APP_CHAIN_ID,
    import.meta.env.VITE_APP_SSCRT_CONTRACT_ADDRESS
  );
}

export async function getKeplrViewingKeysScrt(): Promise<string | null> {
  if (!window.keplr) throw "Keplr not found";

  try {
    return await window.keplr.getSecret20ViewingKey(
      import.meta.env.VITE_APP_CHAIN_ID,
      import.meta.env.VITE_APP_SSCRT_CONTRACT_ADDRESS
    );
  } catch (e) {
    return null;
  }
}

export async function setViewingKey(contract_address) {
  if (!window.keplr) throw "Keplr not found";
  await window.keplr.suggestToken(
    import.meta.env.VITE_APP_CHAIN_ID,
    contract_address
  );
}

export async function getViewingKey(contract_address): Promise<string | null> {
  if (!window.keplr) throw "Keplr not found";

  try {
    return await window.keplr.getSecret20ViewingKey(
      import.meta.env.VITE_APP_CHAIN_ID,
      contract_address
    );
  } catch (e) {
    return null;
  }
}
