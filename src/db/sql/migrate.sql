-- 서버 첫 설치 후
-- 테이블이 생성 된 후에 처리할 쿼리문들
-- 인덱스 생성과 같은 것들 넣어둘 것

-- 계정 관련된 인덱스
CREATE INDEX idx_account_id ON Account (id);
CREATE INDEX idx_user_name ON Account(user_name);
CREATE INDEX idx_nickname ON Account(nickname);