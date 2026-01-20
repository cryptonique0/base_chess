;; Notary Contract
;; Stores a mapping of document hash -> { owner, block-height }

(define-map notarizations 
  { hash: (buff 32) } 
  { owner: principal, block: uint }
)

(define-public (notarize (h (buff 32)))
  (let ((existing (map-get? notarizations {hash: h})))
    (match existing
      entry 
        (if (is-eq (get owner entry) tx-sender)
            (ok true) ;; Already notarized by sender, success
            (err u100)) ;; Already notarized by someone else
      (begin
        (map-insert notarizations 
          { hash: h } 
          { owner: tx-sender, block: block-height }
        )
        (print { event: "notarize", hash: h, owner: tx-sender, block: block-height })
        (ok true))
    )
  )
)

(define-read-only (get-notarization (h (buff 32)))
  (map-get? notarizations { hash: h })
)