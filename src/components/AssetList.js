import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import assetApi from "../api/assetApi";

function AssetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "domestic");
  const [assets, setAssets] = useState([]);
  const [sockets, setSockets] = useState([]); //  useState로 초기화


  useEffect(() => {
    fetchStocksByCategory(); //  페이지 로드 시 API 호출
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      fetchSearchedStocks();
    } else {
      fetchStocksByCategory();
    }
  }, [searchTerm, selectedCategory]);

  //  카테고리에 맞는 종목 API 호출
  const fetchStocksByCategory = async () => {
    try {
      let response;
      if (selectedCategory === "domestic") {
        response = await assetApi.getDomesticStocks();
      } else if (selectedCategory === "overseas") {
        response = await assetApi.getOverseasStocks();
      } else if (selectedCategory === "crypto") {
        response = await assetApi.getCryptoStocks();
      }
      setAssets(response); // ✅ 가져온 데이터를 상태에 저장
      subscribeToLivePrices(response || []);
    } catch (error) {
      console.error("종목 리스트 가져오기 실패:", error);
    }
  };

  const subscribeToLivePrices = () => {
  if (selectedCategory !== "crypto") return;

  // 기존 웹소켓 연결 종료
  sockets.forEach((socket) => socket.close());
  setSockets([]);

  //  Redis 기반 실시간 암호화폐 데이터 가져오기
  const interval = setInterval(async () => {
    try {
      const liveData = await assetApi.getLiveCryptoStocks(); 
      if (liveData && Array.isArray(liveData)) {
        setAssets((prevAssets) =>
          prevAssets.map((asset) => {
            const updatedData = liveData.find((data) => data.symbol === asset.symbol);
            return updatedData
              ? { 
                  ...asset, 
                  price: parseFloat(updatedData.price).toFixed(8),
                  change: updatedData.change ? `${parseFloat(updatedData.change).toFixed(8)}%` : "0%"
                }
              : asset;
          })
        );
      }
    } catch (error) {
      //console.error("❌ 암호화폐 실시간 데이터 업데이트 실패:", error);
    }
  }, 10000); //  10초마다 업데이트

  setSockets([{ close: () => clearInterval(interval) }]); // polling 종료 함수
};


  //  검색 API 호출
  const fetchSearchedStocks = async () => {
    try {
      const response = await assetApi.searchStocks(searchTerm);
      setAssets(response);
    } catch (error) {
      console.error("종목 검색 실패:", error);
    }
  };

  const fetchLivePrice = async (symbol) => {
    try {
      const response = await assetApi.getLiveMarketData(symbol);
      console.log(`📡 실시간 가격 데이터 (${symbol}):`, response); //  API 응답 확인
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch live market data for ${symbol}:`, error);
      return null;
    }
  };
  
  
  

  //  카테고리 변경 함수
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return (
    <div className="container py-4 text-light">
      {/*  카테고리 버튼 */}
      <div className="row mb-4">
        <div className="col">
          <div className="btn-group w-100">
            <button className={`btn ${selectedCategory === "domestic" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleCategoryChange("domestic")}>
              국내주식
            </button>
            <button className={`btn ${selectedCategory === "overseas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleCategoryChange("overseas")}>
              해외주식
            </button>
            <button className={`btn ${selectedCategory === "crypto" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleCategoryChange("crypto")}>
              암호화폐
            </button>
          </div>
        </div>
      </div>

      {/*  검색창 */}
      <div className="row mb-4">
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchSearchedStocks()} //  엔터키 검색
            />
            <button className="btn btn-outline-primary" type="button" onClick={fetchSearchedStocks}>
              🔍
            </button>
          </div>
        </div>
      </div>

      {/*  종목 리스트 */}
      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>종목명</th>
                  <th>종목코드</th>
                  <th className="text-end">현재가</th>
                  <th className="text-end">등락률</th>
                  <th className="text-center">상세/토론</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(assets) && assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr key={asset.symbol}>
                      <td>
                        <Link to={`/assets/${asset.symbol}`} className="text-light">
                          {asset.korean_name || asset.english_name}
                        </Link>
                      </td>
                      <td>{asset.symbol}</td>
                      <td className="text-end">
                        {asset.price !== undefined 
                          ? (asset.price < 1 
                              ? parseFloat(asset.price).toFixed(8)  //  1 미만일 때 소수점 8자리 유지
                              : parseFloat(asset.price).toFixed(2)  //  기본 소수점 2자리 유지
                            ) + "원"
                          : "-"}
                      </td>

                      <td className={`text-end ${asset.changeRate >= 0 ? "text-success" : "text-danger"}`}>
                        {asset.changeRate !== undefined 
                          ? `${(parseFloat(asset.changeRate) * 100).toFixed(2)}%` //  등락률을 퍼센트 변환
                          : "0%"}
                      </td>


                      <td className="text-center">
                        <Link to={`/assets/${asset.symbol}`} className="btn btn-sm btn-outline-primary">상세</Link>
                        <Link to={`/assets/${asset.symbol}/posts`} className="btn btn-sm btn-outline-primary">토론방</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-light">데이터 없음</td>
                  </tr>
                )}
              </tbody>


            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetList;
