import { MsgExecuteContract } from "secretjs";
import { parseTxError } from "./errorhelper.ts";

export const txWrapper = async (
  msg,
  contract,
  hash,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    const execMsg = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: contract,
      code_hash: hash,
      msg,
    });
    const response = await walletClient.client.tx.broadcast([execMsg], {
      gasLimit: gas,
    });
    // console.log('Message:', JSON.stringify(msg, undefined, 2));
    // console.log('Response:', response);
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};

export const mintWrapper = async (
  msg,
  contract,
  hash,
  gas,
  checkErrors = true,
  walletClient,
  qty
) => {
  try {
    let msgs = [];

    msgs.push(
      new MsgExecuteContract({
        sender: walletClient.address,
        contract_address: contract,
        code_hash: hash,
        msg,
      })
    );

    const response = await walletClient.client.tx.broadcast(msgs, {
      gasLimit: gas,
      broadcastTimeoutMs: 90_000,
    });
    // console.log('Message:', JSON.stringify(msg, undefined, 2));
    // console.log('Response:', response);
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};

export const sendPowerUp = async (
  wolfMsg,
  boneMsg,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    const wolfSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_PACK_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_PACK_CONTRACT_HASH,
      msg: wolfMsg,
    });
    const boneSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_BONE_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_BONE_CONTRACT_HASH,
      msg: boneMsg,
    });
    const response = await walletClient.client.tx.broadcast(
      [wolfSend, boneSend],
      {
        gasLimit: gas,
        broadcastTimeoutMs: 90_000,
      }
    );
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};

export const claimBulk = async (
  txMsg,
  contracts,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    let claims = [];
    contracts.forEach((contract) => {
      claims.push(
        new MsgExecuteContract({
          sender: walletClient.address,
          contract_address: contract.contract_info.address,
          code_hash: contract.contract_info.code_hash,
          msg: txMsg,
        })
      );
    });

    const response = await walletClient.client.tx.broadcast(claims, {
      gasLimit: gas,
      broadcastTimeoutMs: 90_000,
    });
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};

export const transferWolf = async (
  transferMsg,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    const transferSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_PACK_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_PACK_CONTRACT_HASH,
      msg: transferMsg,
    });
    const claimSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_PACKBUILDER_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_PACKBUILDER_CONTRACT_HASH,
      msg: {
        claim_back: {},
      },
    });
    const response = await walletClient.client.tx.broadcast([transferSend], {
      gasLimit: gas,
      broadcastTimeoutMs: 90_000,
    });
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};

export const whitelist = async (
  setWhitelistMsg,
  collectAddressMsg,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    const whitelistSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_HASH,
      msg: setWhitelistMsg,
    });
    const collectAddressSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_COLLECTION_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_COLLECTION_CONTRACT_HASH,
      msg: collectAddressMsg,
    });
    const response = await walletClient.client.tx.broadcast(
      [whitelistSend, collectAddressSend],
      {
        gasLimit: gas,
        broadcastTimeoutMs: 90_000,
      }
    );
    if (checkErrors) parseTxError(response);
    return response;
  } catch (error) {
    console.error(error);
    if (
      error.toString().includes("Network Error") ||
      error.toString().includes("503") ||
      error.toString().includes("Response closed without headers")
    ) {
      throw "Failed to access network. The node may be experiencing issues.";
    } else {
      throw error;
    }
  }
};
