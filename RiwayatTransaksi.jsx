import React from 'react';

export default function RiwayatTransaksi({ riwayatDonasi, idKampanyeAktif, judulKampanye }) {
  // FILTER LOGIKA: Hanya ambil riwayat yang ID Kampanyenya cocok dengan kampanye yang sedang diklik
  const riwayatTerfilter = riwayatDonasi.filter(log => log.idKampanye === idKampanyeAktif);

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', marginTop: '30px' }}>
      <h3 style={{ color: '#38bdf8', margin: '0 0 5px 0', fontSize: '1.3rem' }}>
        🔍 3. Audit Trail: {judulKampanye} (ID: {idKampanyeAktif})
      </h3>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 20px 0' }}>
        Menampilkan rekam jejak transaksi khusus untuk kampanye ini secara transparan langsung dari blockchain.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: '#9ca3af', borderBottom: '2px solid #334155', fontSize: '0.9rem' }}>
              <th style={{ padding: '12px 10px' }}>Tx Hash</th>
              <th style={{ padding: '12px 10px' }}>Alamat Pengirim (Donatur)</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Jumlah Transfer</th>
            </tr>
          </thead>
          <tbody>
            {riwayatTerfilter.length > 0 ? (
              riwayatTerfilter.map((log, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #334155', fontSize: '0.88rem', backgroundColor: index % 2 === 0 ? 'transparent' : '#0f172a' }}>
                  <td style={{ padding: '14px 10px', color: '#9ca3af', fontFamily: 'monospace' }}>
                    {log.txHash.substring(0, 25)}...
                  </td>
                  <td style={{ padding: '14px 10px', fontFamily: 'monospace', color: '#60a5fa' }}>
                    {log.donatur}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: 'bold', color: '#10b981', textAlign: 'right' }}>
                    {log.jumlah} ETH
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                  Belum ada jejak transaksi donasi untuk kampanye ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}