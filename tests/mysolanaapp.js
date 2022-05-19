// const anchor = require("@project-serum/anchor");

// describe("mysolanaapp", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const program = anchor.workspace.Mysolanaapp;
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

let _baseAccount;

describe('mysolanaapp', () => {
  // create and set provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Mysolanaapp;
  it('Creates a counter', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.methods
      .create()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Count 0: ', account.count.toString());
    assert.ok(account.count.toString() == 0);
    _baseAccount = baseAccount;
  });

  it('Increments the counter', async () => {
    const baseAccount = _baseAccount;
    await program.methods.increment()
      .accounts({
        baseAccount: baseAccount.publicKey,
      })
      .rpc();

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Count 1: ', account.count.toString());
    assert.ok(account.count.toString() == 1);
  });

});