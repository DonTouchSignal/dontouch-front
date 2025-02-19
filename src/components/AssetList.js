import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function AssetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'domestic');

  // URL 파라미터가 변경될 때 카테고리 업데이트
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // 카테고리 변경 시 URL 업데이트
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  // 임시 데이터 - id를 숫자로 변경
  const assets = {
    domestic: [
      { id: 1, name: '삼성전자', code: '005930', price: '75,000', change: '+2.5%' },
      { id: 2, name: 'SK하이닉스', code: '000660', price: '135,000', change: '-1.8%' },
      { id: 3, name: '현대차', code: '005380', price: '210,000', change: '+3.2%' }
    ],
    overseas: [
      { id: 4, name: 'Apple Inc.', code: 'AAPL', price: '$182.52', change: '+1.5%' },
      { id: 5, name: 'Microsoft', code: 'MSFT', price: '$405.12', change: '+0.8%' },
      { id: 6, name: 'Alphabet', code: 'GOOGL', price: '$142.65', change: '-0.5%' }
    ],
    crypto: [
      { id: 7, name: 'Bitcoin', code: 'BTC', price: '65,000,000', change: '+5.2%' },
      { id: 8, name: 'Ethereum', code: 'ETH', price: '3,500,000', change: '-2.1%' },
      { id: 9, name: 'Ripple', code: 'XRP', price: '800', change: '+1.8%' }
    ]
  };

  const filteredAssets = assets[selectedCategory].filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4 text-light">
      {/* 카테고리 선택 버튼 수정 */}
      <div className="row mb-4">
        <div className="col">
          <div className="btn-group w-100">
            <button
              className={`btn ${selectedCategory === 'domestic' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleCategoryChange('domestic')}
            >
              국내주식
            </button>
            <button
              className={`btn ${selectedCategory === 'overseas' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleCategoryChange('overseas')}
            >
              해외주식
            </button>
            <button
              className={`btn ${selectedCategory === 'crypto' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleCategoryChange('crypto')}
            >
              암호화폐
            </button>
          </div>
        </div>
      </div>

      {/* 검색바 */}
      <div className="row mb-4">
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="종목명 또는 종목코드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="button">
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 종목 목록 */}
      <div className="row">
        <div className="col">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
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
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td>
                          <Link 
                            to={`/assets/${asset.id}`}
                            className="text-light text-decoration-none"
                          >
                            {asset.name}
                          </Link>
                        </td>
                        <td>{asset.code}</td>
                        <td className="text-end">{asset.price}</td>
                        <td className={`text-end ${asset.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                          {asset.change}
                        </td>
                        <td className="text-center">
                          <div className="btn-group">
                            <Link 
                              to={`/assets/${asset.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              상세
                            </Link>
                            <Link 
                              to={`/assets/${asset.id}/posts`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              토론방
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetList; 