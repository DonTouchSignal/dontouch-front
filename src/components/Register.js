import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // TODO: API 연동
      const registerData = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        role: 'USER',
        subscribe: false
      };
      
      console.log('회원가입 시도:', registerData);
      navigate('/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-light">
            <div className="card-body">
              <h2 className="text-center mb-4">회원가입</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">이메일</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nickname" className="form-label">닉네임</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  회원가입
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-light">
                    이미 계정이 있으신가요? 로그인
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 