import React, { useState, useCallback } from 'react'
import { sha256 } from 'js-sha256'
import { showConnect, openContractCall } from '@stacks/connect'
import { bufferCV } from '@stacks/transactions'

// Helper to convert hex string to Uint8Array
const hexToBytes = (hex) => {
  const bytes = []
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with your deployed contract address
const CONTRACT_NAME = 'notary';

export default function NotarizeWithContract() {
  const [file, setFile] = useState(null)
  const [hash, setHash] = useState('')
  const [status, setStatus] = useState('')
  const [txId, setTxId] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const processFile = async (file) => {
    if (!file) return
    setFile(file)
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const digest = sha256(bytes)
    setHash(digest)
    setStatus('')
    setTxId(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  async function notarize() {
    if (!hash) return alert('Please select a file first')

    setStatus('Preparing transaction...')
    
    const functionArgs = [bufferCV(hexToBytes(hash))]

    const options = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'notarize',
      functionArgs,
      appDetails: {
        name: 'Decentralized Notary',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: data => {
        setTxId(data.txId)
        setStatus('Transaction submitted!')
      },
      onCancel: () => {
        setStatus('Transaction cancelled')
      }
    }

    await showConnect({
      appDetails: {
        name: 'Decentralized Notary',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        openContractCall(options)
      },
    })
  }

  return (
    <div>
      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ borderColor: isDragOver ? 'var(--accent)' : 'var(--border)' }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          style={{display: 'none'}} 
          onChange={handleFileSelect} 
        />
        {file ? (
          <div>
            <p style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{file.name}</p>
            <p style={{fontSize: '0.9rem', fontFamily: 'monospace'}}>SHA-256: {hash}</p>
          </div>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </div>

      <button className="btn" onClick={notarize} disabled={!hash}>
        Notarize on Blockchain
      </button>

      {status && (
        <div className="status-box">
          {status}
        </div>
      )}

      {txId && (
        <div className="status-box" style={{borderColor: 'var(--success)', border: '1px solid var(--success)'}}>
          <p style={{color: 'var(--success)', margin: 0}}>Success! Transaction ID:</p>
          <a 
            href={`https://explorer.hiro.so/txid/${txId}?chain=testnet`} 
            target="_blank" 
            rel="noreferrer"
            style={{wordBreak: 'break-all', color: 'var(--accent)'}}
          >
            {txId}
          </a>
        </div>
      )}
    </div>
  )
}