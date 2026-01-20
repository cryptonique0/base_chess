import React, { useState } from 'react'
import NotarizeWithContract from './components/NotarizeWithContract'
import VerifyPage from './components/VerifyPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('notarize')

  return (
    <div className="app">
      <header>
        <h1>Decentralized Digital Notary</h1>
        <p>Immutable proof of existence on the Bitcoin blockchain via Stacks.</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'notarize' ? 'active' : ''}`}
          onClick={() => setActiveTab('notarize')}
        >
          Notarize
        </button>
        <button 
          className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          Verify
        </button>
      </div>

      <main>
        {activeTab === 'notarize' && (
          <div className="card">
            <h2>Notarize Document</h2>
            <p style={{marginBottom: '2rem'}}>Upload a file to generate its unique hash and store it on the blockchain.</p>
            <NotarizeWithContract />
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="card">
            <h2>Verify Document</h2>
            <p style={{marginBottom: '2rem'}}>Check if a file has been notarized by uploading it here.</p>
            <VerifyPage />
          </div>
        )}
      </main>
    </div>
  )
}