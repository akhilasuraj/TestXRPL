const xrpl = require("xrpl")

const main = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const response = await client.request({
        "command": "account_info",
        "account": "rwkf91Pu2kAQxLexjNTuBjrAAGCiNiQTv7",
        "ledger_index": "validated"
    })
    console.log(`Account balance for ${response.result.account_data.Account} is \n\t ${response.result.account_data.Balance}`)

    const wallet = xrpl.Wallet.fromSeed("ssJXUQAoJyzXikxUEYV7MV569bHfH")
    console.log(`My wallet Address ${wallet.address}`)
    console.log("\n")

    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpl.xrpToDrops("1"),
        "Destination": "r4wSYv711RADFhDtfashCktgrZKNahd9tV"
    })
    const max_ledger = prepared.LastLedgerSequence
    console.log("Prepared transaction instructions:", prepared)
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    console.log("Transaction expires after ledger:", max_ledger)
    console.log("\n")

    // Sign prepared instructions ------------------------------------------------
    const signed = wallet.sign(prepared)
    console.log("Identifying hash:", signed.hash)
    console.log("Signed blob:", signed.tx_blob)
    console.log("\n")

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob)

    // Check transaction results -------------------------------------------------
    console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    client.disconnect()
}

main()