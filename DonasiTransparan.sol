// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // Baris pragma uint256 yang salah tadi sudah dihapus

contract TransparansiDonasi {
    struct Kampanye {
        string judul;
        string deskripsi; 
        string kategori;  
        uint256 targetDana;
        uint256 deadline; 
        uint256 danaTerkumpul;
        bool selesai;
    }

    Kampanye[] public daftarKampanye;

    event KampanyeDibuat(uint256 id, string judul, uint256 target);
    event DonasiDiterima(uint256 indexed idKampanye, address indexed donatur, uint256 jumlah);

    function buatKampanye(
        string memory _judul, 
        string memory _deskripsi, 
        string memory _kategori, 
        uint256 _targetDana,
        uint256 _deadline
    ) public {
        daftarKampanye.push(Kampanye({
            judul: _judul,
            deskripsi: _deskripsi,
            kategori: _kategori,
            targetDana: _targetDana,
            deadline: _deadline,
            danaTerkumpul: 0,
            selesai: false
        }));
        emit KampanyeDibuat(daftarKampanye.length - 1, _judul, _targetDana);
    }

    function kirimDonasi(uint256 _id) public payable {
        require(_id < daftarKampanye.length, "Kampanye tidak ditemukan");
        require(!daftarKampanye[_id].selesai, "Kampanye sudah selesai");
        require(block.timestamp <= daftarKampanye[_id].deadline, "Waktu kampanye sudah habis");

        daftarKampanye[_id].danaTerkumpul += msg.value;
        
        if (daftarKampanye[_id].danaTerkumpul >= daftarKampanye[_id].targetDana) {
            daftarKampanye[_id].selesai = true;
        }

        emit DonasiDiterima(_id, msg.sender, msg.value);
    }

    function getJumlahKampanye() public view returns (uint256) {
        return daftarKampanye.length;
    }
}