import React from 'react';
import { Container, Button, Figure, Stack } from 'react-bootstrap';
import Box from '../assets/empty-box-svgrepo-com.png';

function PlaceHolder({ navbarHeight = '56px', footerHeight = '80px' }) {
  // Calculate available height accounting for navbar and footer
  const contentHeight = `calc(100vh - (${navbarHeight} + ${footerHeight}))`;

  return (
    <Container 
      fluid 
      className="poppins d-flex flex-column" 
      style={{ 
        minHeight: contentHeight,
        paddingTop: navbarHeight,
        paddingBottom: footerHeight
      }}
    >
      <Stack 
        gap={4} 
        className="mx-auto my-auto text-center align-items-center justify-content-center px-3"
        style={{ maxWidth: '800px' }}
      >
        <Figure className="mb-0">
          <Figure.Image
            src={Box}
            width={220}
            height={220}
            alt="Aucun quiz disponible"
            className="img-fluid"
          />
        </Figure>
        
        <h1 className="display-5 fw-bold mb-2">Des quiz vous attendent ! Créez-en un.</h1>
        
        <p className="fs-4 text-muted mb-4">
          Cliquez ci-dessous pour commencer votre aventure ici...
        </p>
        
        <Button 
          variant="custom" 
          size="lg"
          className="px-5 py-3 fw-bold rounded-3 text-white"
          style={{ 
            backgroundColor: '#fe6363',
            border: 'none',
            fontSize: '1.25rem',
            minWidth: '220px'
          }}
        >
          Créer un Quiz
        </Button>
      </Stack>
    </Container>
  );
}

export default PlaceHolder;