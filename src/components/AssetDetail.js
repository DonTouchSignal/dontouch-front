import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TradingViewWidget from './TradingViewWidget';
import assetApi from '../api/assetApi';

function AssetDetail() {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [priceAlert, setPriceAlert] = useState({
    targetPrice: '',
    condition: 'above'
  });
  const [showAlertForm, setShowAlertForm] = useState(false);

  /**  심볼을 기반으로 TradingView 마켓 결정 */
  const convertToTradingViewSymbol = (symbol) => {
    if (!symbol) return null;

    if (symbol.includes("-")) {
        const parts = symbol.split("-"); // '-' 기준으로 나누기
        if (parts.length === 2) {
            const base = parts[1]; // BTC, ETH, INJ 등
            const quote = parts[0]; // KRW, USDT, BTC 등
            return `UPBIT:${base}${quote}`; //  예: USDT-INJ → UPBIT:INJUSDT
        }
    } 
    if (/^\d{6}$/.test(symbol)) {
        return `KRX:${symbol}`; //  국내주식 (6자리 숫자)
    }
    return `NASDAQ:${symbol}`; //  나스닥 (알파벳만 존재)
};


  /**  API 호출 및 asset 정보 설정 */
  const fetchAssetDetail = async () => {
    try {
      const response = await assetApi.getLiveMarketData(assetId);
      console.log("📡 API 응답 데이터:", response); // ✅ 응답 확인
      
      if (!response || !response.symbol) {
        console.warn("🚨 유효한 자산 데이터 없음");
        setAsset({ id: "N/A", name: "데이터 없음", code: "-", currentPrice: "N/A", change: "0%" });
        return;
      }

      // 심볼을 기반으로 TradingView 심볼 자동 설정
      const tradingViewSymbol = convertToTradingViewSymbol(response.symbol);
      console.log("🎯 TradingView 심볼:", tradingViewSymbol);

      setAsset({
        id: response.symbol,
        name: response.koreanName || response.englishName ,
        code: response.symbol,
        currentPrice: response.price || "N/A",
        change: response.changeRate ? `${(response.changeRate * 100).toFixed(2)}%` : "0%",
        tradingViewSymbol
      });
    } catch (error) {
      console.error("❌ Failed to fetch asset details:", error);
    }
  };

  useEffect(() => {
    fetchAssetDetail();
  }, [assetId]);

  const handleAlertSubmit = async (e) => {
    e.preventDefault();
    if (!asset) return;
  
    const userEmail = localStorage.getItem('X-Auth-User'); 
  
    try {
      //  관심종목 추가
      await assetApi.addToWatchlist(userEmail, asset.code);
  
      // 목표가 설정
      //  숫자로 변환해서 보내기
    await assetApi.setTargetPrice(userEmail, asset.code, Number(priceAlert.targetPrice));
  
      console.log(`✅ ${asset.code} 관심종목 추가 + 목표가 ${priceAlert.targetPrice} 설정 완료`);
      setShowAlertForm(false);
    } catch (error) {
      console.error("❌ 가격 알림 설정 실패:", error);
    }
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
            {/*  디버깅 로그 */}
            {console.log("🔥 현재 asset 데이터:", asset)}
            {console.log("🎯 TradingView 심볼:", asset.tradingViewSymbol)}

            {/*  차트 위젯 렌더링 */}
            {asset.tradingViewSymbol ? (
              <TradingViewWidget symbol={asset.tradingViewSymbol} />
            ) : (
              <p className="text-center text-light">⚠️ 차트 데이터 없음</p>
            )}
          </div>
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
