import React from 'react';

function Home() {
  return (
    <div className="container py-5 text-light">
      <h1 className="text-center mb-5">금융 정보 대시보드</h1>
      <div className="row justify-content-center">
        <div className="col-md-5 mb-4">
          <div className="card bg-dark border-secondary">
            <div className="card-body text-light">
              <h2 className="card-title text-center mb-3">주식 정보</h2>
              <p className="card-text text-center text-secondary">
                실시간 주식 시장 정보를 확인하세요
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5 mb-4">
          <div className="card bg-dark border-secondary">
            <div className="card-body text-light">
              <h2 className="card-title text-center mb-3">코인 정보</h2>
              <p className="card-text text-center text-secondary">
                암호화폐 시장 동향을 확인하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 