import React, { useEffect, useState } from "react";
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

  return (
    <Container>
      <TotalText>총 금액: ${totalPrice}</TotalText>
      {items.map((item) => (
        <ItemContainer key={item.productId}>
          <RowWrapper>
            <ItemName>{item.productName}</ItemName>
            <ItemPrice>${item.price}</ItemPrice>
          </RowWrapper>
          <ItemDate>{item.boughtDate}</ItemDate>
        </ItemContainer>
      ))}
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

export default App;
