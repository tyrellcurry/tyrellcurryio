import { Container } from '@mantine/core';

const Hero = () => {
  return (
    <Container fluid h={50} bg="var(--mantine-color-blue-light)">
      <Button></Button>
      Fluid container has 100% max-width
    </Container>
  );
};

export default Hero;
