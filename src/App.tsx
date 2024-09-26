import React, { useCallback, useEffect, useRef, useState } from "react";
import { MockData } from "./api/mockData";
import styled from "styled-components";
import { getMockData } from "./api/getMockData";

const App: React.FC = () => {
  const [items, setItems] = useState<MockData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  // 데이터 가져오기
  useEffect(() => {
    setLoading(true);
    getMockData(pageNum).then(({ datas, isEnd }) => {
      setItems((prevItems) => [...prevItems, ...datas]);
      setTotalPrice((prevTotal) => prevTotal + datas.reduce((acc, item) => acc + item.price, 0));
      setIsEnd(isEnd);
      setLoading(false);
    });
  }, [pageNum]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return; // 로딩 중이면 실행하지 않음
      if (observer.current) observer.current.disconnect(); // 이전 관찰자 해제

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isEnd) {
          setPageNum((prevPageNum) => prevPageNum + 1); // 페이지 번호 증가
        }
      });

      if (node) observer.current.observe(node); // 요소 관찰 시작
    },
    [loading, isEnd],
  );

  return (
    <Container>
      <TotalText>총 금액: ${totalPrice}</TotalText>
      {items.map((item, index) => {
        if (index === items.length - 1) {
          // 마지막 아이템에 ref 연결
          return (
            <ItemContainer ref={lastItemRef} key={item.productId}>
              <RowWrapper>
                <ItemName>{item.productName}</ItemName>
                <ItemPrice>${item.price}</ItemPrice>
              </RowWrapper>
              <ItemDate>{item.boughtDate}</ItemDate>
            </ItemContainer>
          );
        } else {
          return (
            <ItemContainer key={item.productId}>
              <RowWrapper>
                <ItemName>{item.productName}</ItemName>
                <ItemPrice>${item.price}</ItemPrice>
              </RowWrapper>
              <ItemDate>{item.boughtDate}</ItemDate>
            </ItemContainer>
          );
        }
      })}
      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}
      {isEnd && <EndMessage>더 이상 상품이 없습니다.</EndMessage>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TotalText = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding: 32px 0 16px 0;
  font-size: 24px;
  text-align: center;
  background-color: white;
`;

const ItemContainer = styled.div`
  width: 30%;
  margin-bottom: 20px;
  padding: 12px 24px;
  border-radius: 16px;
  background-color: #dae7ff68;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ItemName = styled.text`
  font-size: 20px;
  font-weight: 600;
`;

const ItemPrice = styled.div`
  font-size: 18px;
  color: #4479db;
`;

const ItemDate = styled.div`
  font-size: 14px;
  color: #b4b4b4;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-weight: bold;
`;

const EndMessage = styled.p`
  text-align: center;
  color: #474747;
`;

export default App;
