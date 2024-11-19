-- 서버 첫 설치 후
-- 테이블이 생성 된 후에 처리할 쿼리문들
-- 인덱스 생성과 같은 것들 넣어둘 것

-- 계정 관련된 인덱스
CREATE INDEX idx_account_id ON Account (id);
CREATE INDEX idx_user_name ON Account(user_name);
CREATE INDEX idx_nickname ON Account(nickname);

-- 업데이트 일자 자동 변경을 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 일자 자동 변경 트리거
CREATE TRIGGER set_update_at
BEFORE UPDATE ON Account
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();