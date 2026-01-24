export function generateMockISOXML(proof: any) {
  const today = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08">
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>MSG-${proof.id}</MsgId>
      <CreDtTm>${today}T${time}</CreDtTm>
      <MsgPgtn>
        <PgNb>1</PgNb>
        <LastPgInd>true</LastPgInd>
      </MsgPgtn>
    </GrpHdr>
    <Stmt>
      <Id>STATEMENT-${proof.id}</Id>
      <ElctrncSeqNb>1</ElctrncSeqNb>
      <CreDtTm>${today}T${time}</CreDtTm>
      <Acct>
        <Id>
          <IBAN>FLR-${proof.from.slice(0, 16)}</IBAN>
        </Id>
        <Ccy>FLR</Ccy>
        <Nm>Flare Account Holder</Nm>
      </Acct>
      <Bal>
        <Tp>
          <CdOrPrtry>
            <Cd>PRCD</Cd>
          </CdOrPrtry>
        </Tp>
        <Amt Ccy="FLR">${(Math.random() * 1000).toFixed(2)}</Amt>
        <CdtDbtInd>CRDT</CdtDbtInd>
        <Dt>
          <Dt>${today}</Dt>
        </Dt>
      </Bal>
      <Ntry>
        <Amt Ccy="FLR">${proof.amount}</Amt>
        <CdtDbtInd>DBIT</CdtDbtInd>
        <Sts>BOOK</Sts>
        <BookgDt>
          <Dt>${new Date(proof.createdAt || today).toISOString().split('T')[0]}</Dt>
        </BookgDt>
        <ValDt>
          <Dt>${new Date(proof.createdAt || today).toISOString().split('T')[0]}</Dt>
        </ValDt>
        <NtryRef>${proof.transactionHash}</NtryRef>
        <BkTxCd>
          <Domn>
            <Cd>PMNT</Cd>
            <Fmly>
              <Cd>ICDT</Cd>
              <SubFmlyCd>TRF</SubFmlyCd>
            </Fmly>
          </Domn>
          <Prtry>
            <Cd>CUSTOMER_TRANSFER</Cd>
          </Prtry>
        </BkTxCd>
        <RltdPties>
          <Dbtr>
            <Nm>${proof.from}</Nm>
            <PstlAdr>
              <Ctry>XD</Ctry>
            </PstlAdr>
          </Dbtr>
          <Cdtr>
            <Nm>${proof.to}</Nm>
            <PstlAdr>
              <Ctry>XD</Ctry>
            </PstlAdr>
          </Cdtr>
        </RltdPties>
        <RmtInf>
          <Ustrd>${proof.purpose || proof.category || 'Payment transaction'}</Ustrd>
        </RmtInf>
        <RltdRmtInf>
          <RmtId>${proof.id}</RmtId>
          <RmtInf>
            <Ustrd>Flare Network Transaction: ${proof.transactionHash}</Ustrd>
          </RmtInf>
        </RltdRmtInf>
      </Ntry>
    </Stmt>
  </BkToCstmrStmt>
</Document>`;
}