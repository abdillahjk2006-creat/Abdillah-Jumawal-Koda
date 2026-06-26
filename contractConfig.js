// src/contractConfig.js

// 1. Ganti dengan alamat kontrak yang Anda salin dari Remix setelah sukses deploy
export const CONTRACT_ADDRESS = "0xdC2fa462750C9f2cdd7F1Ac52c79DE244E760625";

// 2. Tempelkan (paste) salinan array ABI berupa format JSON dari Remix di bawah ini
export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "idKampanye",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "donatur",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jumlah",
				"type": "uint256"
			}
		],
		"name": "DonasiDiterima",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "judul",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "target",
				"type": "uint256"
			}
		],
		"name": "KampanyeDibuat",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_judul",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_deskripsi",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_kategori",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_targetDana",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			}
		],
		"name": "buatKampanye",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "daftarKampanye",
		"outputs": [
			{
				"internalType": "string",
				"name": "judul",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deskripsi",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "kategori",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "targetDana",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "danaTerkumpul",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "selesai",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getJumlahKampanye",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "kirimDonasi",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];
  // ... Tempel isi ABI panjang yang dicopas dari Remix di dalam sini ...
