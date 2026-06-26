import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';
import GrafikDonasi from './components/GrafikDonasi';
import RiwayatTransaksi from './components/RiwayatTransaksi';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [kampanyeList, setKampanyeList] = useState([]);
  const [riwayatDonasi, setRiwayatDonasi] = useState([]);
  const [aktifIndeks, setAktifIndeks] = useState(null);
  const [aktifTab, setAktifTab] = useState('aktif');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '', deskripsi: '', kategori: 'Pendidikan', target: '', deadline: ''
  });

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          setContract(contractInstance);
          loadSemuaKampanye(contractInstance, web3Instance);
          loadRiwayatTransaksi(contractInstance, web3Instance);
          window.ethereum.on('accountsChanged', (accs) => setAccount(accs[0] || ''));
        } catch (error) { console.error(error); }
      }
    }
    initWeb3();
  }, []);

  const loadSemuaKampanye = async (contractInstance, web3Instance) => {
    try {
      let daftarTemp = [];
      const jumlah = await contractInstance.methods.getJumlahKampanye().call();
      for (let i = 0; i < jumlah; i++) {
        const k = await contractInstance.methods.daftarKampanye(i).call();
        daftarTemp.push({
          id: i,
          judul: k.judul,
          deskripsi: k.deskripsi,
          kategori: k.kategori,
          targetDana: parseFloat(web3Instance.utils.fromWei(k.targetDana, 'ether')),
          deadline: Number(k.deadline),
          danaTerkumpul: parseFloat(web3Instance.utils.fromWei(k.danaTerkumpul, 'ether')),
          selesai: k.selesai
        });
      }
      setKampanyeList(daftarTemp);
    } catch (e) { console.log(e); }
  };

  const loadRiwayatTransaksi = async (contractInstance, web3Instance) => {
    const events = await contractInstance.getPastEvents('DonasiDiterima', { fromBlock: 0, toBlock: 'latest' });
    setRiwayatDonasi(events.map(e => ({
      txHash: e.transactionHash,
      idKampanye: Number(e.returnValues.idKampanye),
      donatur: e.returnValues.donatur,
      jumlah: web3Instance.utils.fromWei(e.returnValues.jumlah, 'ether')
    })).reverse());
  };

  const handleBuatKampanye = async (e) => {
    e.preventDefault();
    const web3Instance = new Web3(window.ethereum);
    const targetWei = web3Instance.utils.toWei(formData.target, 'ether');
    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
    await contract.methods.buatKampanye(
      formData.judul, formData.deskripsi, formData.kategori, targetWei, deadlineTimestamp
    ).send({ from: account });
    window.location.reload();
  };

  const handleKirimDonasi = async (id) => {
    const web3Instance = new Web3(window.ethereum);
    await contract.methods.kirimDonasi(id).send({
      from: account,
      value: web3Instance.utils.toWei('1', 'ether')
    });
    window.location.reload();
  };

  const kampanyeTerfilter = kampanyeList.filter(item => {
    const isPenuh = item.danaTerkumpul >= item.targetDana;
    const isExpired = Date.now() / 1000 > item.deadline;
    return aktifTab === 'aktif' ? (!isPenuh && !isExpired) : (isPenuh || isExpired);
  });

  const kampanyeAktif = aktifIndeks !== null ? kampanyeList[aktifIndeks] : null;

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f3f4f6' }}>

      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(to right, #3b82f6, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Blockchain Transparency Fund
        </h1>
        {/* Wallet badge seperti gambar 1 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '10px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '30px',
          padding: '6px 16px',
          fontSize: '0.85rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span style={{ color: '#9ca3af' }}>Wallet Aktif:</span>
          <span style={{ color: '#60a5fa' }}>
            {account ? `${account.substring(0, 8)}...${account.substring(account.length - 8)}` : 'Menghubungkan...'}
          </span>
        </div>
      </header>

      {/* TABS NAV */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => { setAktifTab('aktif'); setAktifIndeks(null); }}
          style={{
            padding: '12px 24px', borderRadius: '12px', border: 'none',
            backgroundColor: aktifTab === 'aktif' ? '#3b82f6' : '#1e293b',
            color: '#fff', cursor: 'pointer', fontWeight: 'bold'
          }}>
          🚀 Kampanye Aktif ({kampanyeList.filter(i => !i.selesai && Date.now() / 1000 <= i.deadline).length})
        </button>
        <button
          onClick={() => { setAktifTab('arsip'); setAktifIndeks(null); }}
          style={{
            padding: '12px 24px', borderRadius: '12px', border: 'none',
            backgroundColor: aktifTab === 'arsip' ? '#ef4444' : '#1e293b',
            color: '#fff', cursor: 'pointer', fontWeight: 'bold'
          }}>
          📦 Arsip Selesai ({kampanyeList.filter(i => i.selesai || Date.now() / 1000 > i.deadline).length})
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: aktifIndeks !== null ? '1fr 1.4fr' : '1fr',
        gap: '30px',
        alignItems: 'start'
      }}>

        {/* LIST CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: aktifIndeks !== null ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {kampanyeTerfilter.map((item) => {
            const persen = Math.min(100, (item.danaTerkumpul / item.targetDana) * 100);
            const sisaWaktu = Math.ceil((item.deadline - (Date.now() / 1000)) / 86400);
            const isSelected = aktifIndeks === kampanyeList.findIndex(x => x.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => setAktifIndeks(kampanyeList.findIndex(x => x.id === item.id))}
                style={{
                  backgroundColor: '#1e293b',
                  padding: '20px',
                  borderRadius: '20px',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'border 0.2s'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#0f172a', borderRadius: '20px', color: '#10b981' }}>
                    {item.kategori}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                    {sisaWaktu > 0 ? `⏳ ${sisaWaktu} Hari Lagi` : '🔴 Berakhir'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{item.judul}</h3>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '15px' }}>
                  {item.deskripsi.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span>Progress: <strong style={{ color: '#60a5fa' }}>{item.danaTerkumpul} ETH</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{persen.toFixed(0)}%</span></span>
                  <span style={{ color: '#9ca3af' }}>dari {item.targetDana} ETH</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${persen}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '10px' }}></div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleKirimDonasi(item.id); }}
                  disabled={item.selesai || sisaWaktu <= 0}
                  style={{
                    width: '100%', marginTop: '15px', padding: '10px',
                    borderRadius: '10px', border: 'none',
                    backgroundColor: item.selesai || sisaWaktu <= 0 ? '#374151' : '#3b82f6',
                    color: '#fff', fontWeight: 'bold', cursor: item.selesai || sisaWaktu <= 0 ? 'not-allowed' : 'pointer'
                  }}>
                  {item.selesai ? '✅ Terpenuhi' : sisaWaktu <= 0 ? '❌ Ditutup' : '🤝 Donasi 1 ETH'}
                </button>
              </div>
            );
          })}
        </div>

        {/* DETAIL PANEL */}
        {kampanyeAktif && (
          <div style={{
            backgroundColor: '#1e293b',
            padding: '30px',
            borderRadius: '20px',
            position: 'sticky',
            top: '20px'
          }}>
            {/* Header detail: kategori + ID */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{
                fontSize: '0.85rem', padding: '5px 14px',
                backgroundColor: '#0f172a', borderRadius: '20px', color: '#3b82f6',
                fontWeight: 'bold', border: '1px solid #3b82f6'
              }}>
                {kampanyeAktif.kategori}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>ID: {kampanyeAktif.id}</span>
            </div>

            {/* Judul */}
            <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '20px' }}>
              {kampanyeAktif.judul}
            </h2>

            {/* Chart Donat */}
            <GrafikDonasi
              danaTerkumpul={kampanyeAktif.danaTerkumpul}
              targetDana={kampanyeAktif.targetDana}
            />

            {/* Deskripsi lengkap */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px', fontWeight: 'bold' }}>Deskripsi:</p>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: '1.6' }}>
                {kampanyeAktif.deskripsi}
              </p>
            </div>

            {/* Audit Trail */}
            <RiwayatTransaksi
              riwayatDonasi={riwayatDonasi}
              idKampanyeAktif={kampanyeAktif.id}
              judulKampanye={kampanyeAktif.judul}
            />
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed', bottom: '40px', right: '40px',
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#10b981', color: '#fff', fontSize: '2rem',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(16,185,129,0.4)'
        }}>
        +
      </button>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b', padding: '30px', borderRadius: '25px',
            width: '500px', border: '1px solid #334155'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Buat Kampanye Baru</h2>
            <form onSubmit={handleBuatKampanye} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Judul Kampanye" required
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })} />
              <textarea placeholder="Deskripsi" required
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', height: '100px' }}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
              <select
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
                <option>Pendidikan</option>
                <option>Kesehatan</option>
                <option>Bencana Alam</option>
                <option>Sosial</option>
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="number" step="0.1" placeholder="Target (ETH)" required
                  style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })} />
                <input type="date" required
                  style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  Publish
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;