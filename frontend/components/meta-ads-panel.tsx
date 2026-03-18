"use client";

import React, { useState, useEffect } from "react";

type AdAccount = {
  id: number;
  meta_account_id: string;
  name: string;
  currency: string;
};

type Campaign = {
  id: number;
  name: string;
  status: string;
  spend: string | number;
  impressions: number;
  clicks: number;
};

export function MetaAdsPanel() {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/meta-ads/accounts/?_t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error(`Expected array for accounts, got status ${res.status}:`, data);
        setAccounts([]);
      }
    } catch (err) {
      console.error("Failed to fetch ad accounts", err);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async (accountId: number) => {
    try {
      const res = await fetch(`/api/meta-ads/campaigns/${accountId}/?_t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCampaigns(data);
      } else {
        console.error("Expected array for campaigns, got:", data);
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
      setCampaigns([]);
    }
  };

  const syncAccounts = async () => {
    setIsSyncing(true);
    try {
      await fetch("/api/meta-ads/sync-accounts/", { method: "POST" });
      await fetchAccounts();
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncCampaigns = async (accountId: number) => {
    setIsSyncing(true);
    try {
      await fetch(`/api/meta-ads/sync-campaigns/${accountId}/`, { method: "POST" });
      await fetchCampaigns(accountId);
    } catch (err) {
      console.error("Campaign sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchCampaigns(selectedAccount.id);
    } else {
      setCampaigns([]);
    }
  }, [selectedAccount]);

  return (
    <div className="meta-ads-panel" style={{ 
      width: '320px', 
      borderLeft: '1px solid #e2e8f0', 
      background: '#fff', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Montserrat, sans-serif',
      boxShadow: '-4px 0 15px rgba(0,0,0,0.02)'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', letterSpacing: '-0.01em' }}>Meta Ads Engine</h3>
          <button 
            className="btn-black" 
            onClick={syncAccounts} 
            disabled={isSyncing}
            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
          >
            {isSyncing ? "Syncing..." : "Sync Accounts"}
          </button>
        </div>

        {isLoading ? (
          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '10px' }}>Summoning accounts...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {accounts.length === 0 && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No accounts synced yet.</div>
            )}
            {accounts.map(acc => (
              <div 
                key={acc.id} 
                onClick={() => setSelectedAccount(acc)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  border: '1px solid', 
                  borderColor: selectedAccount?.id === acc.id ? '#3b82f6' : '#e2e8f0',
                  background: selectedAccount?.id === acc.id ? '#3b82f605' : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedAccount?.id === acc.id ? '0 4px 12px rgba(59, 130, 246, 0.08)' : 'none'
                }}
              >
                <div style={{ fontWeight: '700', color: selectedAccount?.id === acc.id ? '#2563eb' : '#1e293b' }}>{acc.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ID: {acc.meta_account_id}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {selectedAccount ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>Active Campaigns</h4>
              <button 
                className="btn-black" 
                onClick={() => syncCampaigns(selectedAccount.id)} 
                disabled={isSyncing}
                style={{ padding: '5px 10px', fontSize: '0.65rem', background: '#3b82f6' }}
              >
                Update Data
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '0.75rem' }}>
                  No campaigns found. Click Update Data to fetch from Meta.
                </div>
              ) : (
                campaigns.map(camp => (
                  <div key={camp.id} style={{ 
                    padding: '12px', 
                    background: '#fff', 
                    border: '1px solid #f1f5f9', 
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '0.8rem', marginBottom: '8px', color: '#1e293b' }}>{camp.name}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ color: '#64748b' }}>Spend</div>
                        <div style={{ fontWeight: '700', color: '#10b981' }}>${camp.spend}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ color: '#64748b' }}>Status</div>
                        <div style={{ fontWeight: '700', textTransform: 'capitalize' }}>{camp.status.toLowerCase()}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ color: '#64748b' }}>Impressions</div>
                        <div style={{ fontWeight: '700' }}>{camp.impressions.toLocaleString()}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ color: '#64748b' }}>Clicks</div>
                        <div style={{ fontWeight: '700' }}>{camp.clicks.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📊</div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b', marginBottom: '4px' }}>Account Insights</div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', padding: '0 20px' }}>
              Select a Meta Ad account from above to view real-time performance metrics and active campaigns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
