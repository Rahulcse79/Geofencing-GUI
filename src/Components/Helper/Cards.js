import React from 'react';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';

const StyledCard = styled(Card)`
  border-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  padding: 10px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconContainer = styled.div`
  font-size: 40px; /* Adjust size as needed */
  color: ${({ color }) => color};
  margin-right: 15px;
`;

const TextContainer = styled.div`
  flex: 1;
  font-size: 14px;
  
`;

const Value = styled.div`
  font-size: 24px; /* Adjust size as needed */
  color: ${({ color }) => color};
  font-weight: bold;
`;

const Change = styled.div`
  font-size: 16px; /* Adjust size as needed */
  color: #666; /* Change color as needed */
`;

const DashboardCard = ({ title, value, change, icon, color }) => {
  return (
    <StyledCard color={color}>
      <Card.Body>
        <CardContent>
          <IconContainer color={color}>{icon}</IconContainer>
          <TextContainer>
            <Card.Title>{title}</Card.Title>
            <Value color={color}>{value}</Value>
            <Change>{change}</Change>
          </TextContainer>
        </CardContent>
      </Card.Body>
    </StyledCard>
  );
};

export default DashboardCard;
