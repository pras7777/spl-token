import { createMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function createTokenMint() {
  try {
    // Generate keypairs
    const payer = Keypair.generate();
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();

    // Connect to Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Fund the payer account with SOL from the Faucet
    await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);

    // Wait for a moment to ensure the airdrop is processed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Create a new token mint
    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9 // Specify the number of decimals
    );

    console.log('Token mint created:', mint.toBase58());

    // Get or create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    console.log('Associated token account:', tokenAccount.address.toBase58());
  } catch (error) {
    console.error('Error creating token mint or associated token account:', error);
  }
}

// Call the function
createTokenMint();
