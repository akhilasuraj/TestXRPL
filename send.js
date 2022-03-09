const xrpl = require("xrpl")

const main = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const wallet = xrpl.Wallet.fromSeed("ssJXUQAoJyzXikxUEYV7MV569bHfH")

    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpl.xrpToDrops("1"),
        "Destination": "r9BWaCEAu8EbDh9pWWBPkgTTmpsb6Gghdq"
    })
    // const max_ledger = prepared.LastLedgerSequence
    // console.log("Prepared transaction instructions:", prepared)
    // console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    // console.log("Transaction expires after ledger:", max_ledger)

    // Sign prepared instructions ------------------------------------------------
    const signed = wallet.sign(prepared)
    // console.log("Identifying hash:", signed.hash)
    // console.log("Signed blob:", signed.tx_blob)
    // console.log("\n")

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob)

    // Check transaction results -------------------------------------------------
    console.log("Transaction result:", tx.result.meta.TransactionResult == "tesSUCCESS" ? "Success" : tx.result.meta.TransactionResult)

    //Account summary --------------------------------------------------------
    const response = await client.request({
        "command": "account_info",
        "account": "rwkf91Pu2kAQxLexjNTuBjrAAGCiNiQTv7",
        "ledger_index": "validated"
    })
    console.log("Account         : ", prepared.Account)
    console.log("Destination     : ", prepared.Destination)
    console.log("Ammount         : ", xrpl.dropsToXrp(prepared.Amount), "XRP")
    console.log("Transaction fee : ", xrpl.dropsToXrp(prepared.Fee), " XRP")

    console.log(`Account balance : ${xrpl.dropsToXrp(response.result.account_data.Balance)} XRP`)


    client.disconnect()
}

main()