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

export const sendPackBuild = async (
  selectedPayment,
  paymentMsg,
  wolfMsg,
  gas,
  checkErrors = true,
  walletClient
) => {
  try {
    const wolfSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: selectedPayment.address,
      code_hash: selectedPayment.code_hash,
      msg: paymentMsg,
    });
    const boneSend = new MsgExecuteContract({
      sender: walletClient.address,
      contract_address: import.meta.env.VITE_APP_PACK_CONTRACT_ADDRESS,
      code_hash: import.meta.env.VITE_APP_PACK_CONTRACT_HASH,
      msg: wolfMsg,
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
