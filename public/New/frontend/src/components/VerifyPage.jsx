import React, { useState, useCallback } from 'react'
import { sha256 } from 'js-sha256'
import { hexToCV, cvToJSON } from '@stacks/transactions'

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with your deployed contract address
const CONTRACT_NAME = 'notary';

export default function VerifyPage() {
  const [file, setFile] = useState(null)
  const [hash, setHash] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [status, setStatus] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const processFile = async (file) => {
    if (!file) return
    setFile(file)
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const digest = sha256(bytes)
    setHash(digest)
    setVerifyResult(null)
    setStatus('')
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

  async function verify() {
    if (!hash) return alert('Please select a file first')
    setStatus('Checking blockchain...')
    setVerifyResult(null)

    try {
      // Call read-only function via Hiro API
      const response = await fetch(`https://api.testnet.hiro.so/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-notarization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: CONTRACT_ADDRESS,
          arguments: [`0x${hash}`]
        })
      })
      
      const json = await response.json()
      
      if (json.okay && json.result) {
        const cv = hexToCV(json.result)
        const resultJson = cvToJSON(cv)
        
        // Check if result is (some ...) or (none)
        if (resultJson.type === 'some' || (resultJson.value && resultJson.value.type !== 'none')) {
          // Found!
          // The value should be a tuple: { owner: ..., block: ... }
          const tuple = resultJson.value.value || resultJson.value;
          setVerifyResult({ found: true, data: tuple })
        } else {
          setVerifyResult({ found: false })
        }
      } else {
        // If the contract call fails (e.g. contract doesn't exist), handle it
        setVerifyResult({ found: false, error: json.error || 'Contract call failed' })
      }
      setStatus('')

    } catch (err) {
      console.error(err)
      setStatus('Error: ' + err.message)
    }
  }

  return (
    <div>
      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ borderColor: isDragOver ? 'var(--accent)' : 'var(--border)' }}
        onClick={() => document.getElementById('verifyFileInput').click()}
      >
        <input 
          type="file" 
          id="verifyFileInput" 
          style={{display: 'none'}} 
          onChange={handleFileSelect} 
        />
        {file ? (
          <div>
            <p style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{file.name}</p>
            <p style={{fontSize: '0.9rem', fontFamily: 'monospace'}}>SHA-256: {hash}</p>
          </div>
        ) : (
          <p>Drag & drop a file here to verify</p>
        )}
      </div>

      <button className="btn" onClick={verify} disabled={!hash}>
        Verify Document
      </button>

      {status && (
        <div className="status-box">
          {status}
        </div>
      )}

      {verifyResult && (
        <div className="status-box" style={{
          borderColor: verifyResult.found ? 'var(--success)' : 'var(--error)', 
          border: '1px solid ' + (verifyResult.found ? 'var(--success)' : 'var(--error)')
        }}>
          {verifyResult.found ? (
            <div>
              <h3 style={{color: 'var(--success)', marginTop: 0}}>Document Verified!</h3>
              <p>This document was notarized on the blockchain.</p>
              {verifyResult.data && verifyResult.data.owner && (
                 <p><strong>Owner:</strong> {verifyResult.data.owner.value}</p>
              )}
              {verifyResult.data && verifyResult.data.block && (
                 <p><strong>Block Height:</strong> {verifyResult.data.block.value}</p>
              )}
            </div>
          ) : (
            <div>
              <h3 style={{color: 'var(--error)', marginTop: 0}}>Not Found</h3>
              <p>This document hash was not found in the smart contract.</p>
              {verifyResult.error && <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Debug: {verifyResult.error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
