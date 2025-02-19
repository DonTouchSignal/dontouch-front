import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function AssetDetail() {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [priceAlert, setPriceAlert] = useState({
    targetPrice: '',
    condition: 'above'
  });
  const [showAlertForm, setShowAlertForm] = useState(false);

  // 임시 데이터
  useEffect(() => {
    // TODO: API 연동
    setAsset({
      id: assetId,
      name: '삼성전자',
      code: '005930',
      currentPrice: '75,000',
      change: '+2.5%',
      description: '삼성전자는 한국의 대표적인 전자 기업으로...',
      // 차트 데이터도 여기에 추가될 예정
    });
  }, [assetId]);

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('가격 알림 설정:', {
      assetId,
      ...priceAlert
    });
    setShowAlertForm(false);
  };

  if (!asset) {
    return <div className="container py-4 text-light">Loading...</div>;
  }

  return (
    <div className="container py-4 text-light">
      {/* 종목 기본 정보 */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 text-white fw-bold">{asset.name}</h2>
              <span className="text-light opacity-75">{asset.code}</span>
            </div>
            <div className="text-end">
              <h3 className="mb-1 text-white fw-bold">{asset.currentPrice}원</h3>
              <span className={`fs-5 fw-bold ${asset.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                {asset.change}
              </span>
            </div>
          </div>
          <button 
            className="btn btn-outline-primary btn-lg"
            onClick={() => setShowAlertForm(!showAlertForm)}
          >
            가격 알림 설정
          </button>

          {/* 가격 알림 설정 폼 */}
          {showAlertForm && (
            <div className="mt-4 p-3 border border-secondary rounded">
              <form onSubmit={handleAlertSubmit} className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label text-light">목표가</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-secondary"
                    value={priceAlert.targetPrice}
                    onChange={(e) => setPriceAlert({...priceAlert, targetPrice: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-light">조건</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={priceAlert.condition}
                    onChange={(e) => setPriceAlert({...priceAlert, condition: e.target.value})}
                  >
                    <option value="above">이상일 때</option>
                    <option value="below">이하일 때</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <button type="submit" className="btn btn-primary w-100">
                    알림 설정
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3 text-white fw-bold">차트</h3>
          <div className="bg-darker rounded" style={{ height: '400px', background: '#1a1a1a' }}>
            {/* TODO: 차트 컴포넌트 추가 */}
            <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
              차트가 들어갈 영역
            </div>
          </div>
        </div>
      </div>

      {/* 종목 설명 */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3 text-white fw-bold">종목 설명</h3>
          <p className="text-light">{asset.description}</p>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="card bg-dark border-secondary">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="card-title mb-0 text-white fw-bold">토론방</h3>
            <Link 
              to={`/assets/${assetId}/posts/write`} 
              className="btn btn-primary"
            >
              글쓰기
            </Link>
          </div>
          <Link 
            to={`/assets/${assetId}/posts`} 
            className="btn btn-outline-primary w-100 py-2"
          >
            토론방 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AssetDetail; 